import { GoogleGenAI, Type } from "@google/genai";
import { EnrichmentData, GraphNode, NodeType, HypothesisResult } from '../types';

const getAiClient = () => {
  const apiKey = process.env.API_KEY;
  if (!apiKey) {
    console.error("API_KEY is missing from environment variables.");
    return null;
  }
  return new GoogleGenAI({ apiKey });
};

export const analyzeEvidence = async (query: string, availableNodes: GraphNode[]): Promise<HypothesisResult | null> => {
  const ai = getAiClient();
  if (!ai) return null;

  // Create a lightweight list of available nodes for the model context
  const nodeContext = availableNodes.map(n => `${n.id} (${n.label}, ${n.type})`).join("\n");

  try {
    const prompt = `
      You are a specialized Knowledge Graph Reasoner for SARS-CoV-2.
      
      User Evidence/Query: "${query}"
      
      Available Knowledge Graph Nodes:
      ${nodeContext}

      Task:
      1. Analyze the user's evidence.
      2. Identify which specific nodes from the provided list are most relevant to this evidence.
      3. Formulate a scientific hypothesis that connects the evidence to these nodes.
      4. Provide a synthesis answering the query based on the graph relationships.

      Return the response in JSON format.
    `;

    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: prompt,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
            type: Type.OBJECT,
            properties: {
                hypothesis: { type: Type.STRING, description: "A short, concise scientific hypothesis (1 sentence)." },
                synthesis: { type: Type.STRING, description: "A detailed paragraph explaining the connection between the user evidence and the graph nodes." },
                relevantNodeIds: { 
                    type: Type.ARRAY, 
                    items: { type: Type.STRING },
                    description: "List of exact IDs from the provided node list that are relevant." 
                }
            },
            required: ["hypothesis", "synthesis", "relevantNodeIds"]
        }
      }
    });

    const result = JSON.parse(response.text || "{}");
    return result as HypothesisResult;

  } catch (error) {
    console.error("Gemini hypothesis generation failed:", error);
    return null;
  }
};

export const enrichNodeWithGemini = async (node: GraphNode): Promise<EnrichmentData | null> => {
  const ai = getAiClient();
  if (!ai) return null;

  try {
    let specificContext = "";

    // Dynamic prompt construction based on node type
    switch (node.type) {
      case NodeType.VARIANT:
        specificContext = `
          Context: This is a SARS-CoV-2 Variant of Concern (or Interest).
          Focus On:
          1. Key spike protein mutations and their functional impact (transmissibility, ACE2 binding).
          2. Immune escape potential (vaccine breakthrough, antibody evasion).
          3. Severity compared to ancestral strains.
        `;
        break;
      case NodeType.VACCINE:
        specificContext = `
          Context: This is a COVID-19 Vaccine or Therapeutic.
          Focus On:
          1. Technology platform (e.g., mRNA, Subunit) and mechanism.
          2. Efficacy updates against recent circulating variants (e.g., JN.1, XBB).
          3. Durability of protection and booster recommendations.
        `;
        break;
      case NodeType.SURVEILLANCE:
        specificContext = `
          Context: This is a Surveillance System or Genomic Epidemiology tool.
          Focus On:
          1. How it tracks viral evolution or spread (methodology).
          2. Recent key reports or findings released via this platform.
          3. Importance for global public health policy.
        `;
        break;
      case NodeType.LITERATURE:
        specificContext = `
          Context: This is a key Scientific Publication or Literature Reference regarding SARS-CoV-2.
          Focus On:
          1. The primary discovery or claim of this paper (Abstract summary).
          2. Its impact on our understanding of the pandemic (e.g., did it define a receptor, structure, or variant?).
          3. How later research has built upon or cited this work.
        `;
        break;
      case NodeType.GO_TERM:
        specificContext = `
          Context: This is a Gene Ontology (GO) Term or Biological Process.
          Focus On:
          1. Definition of this biological process in the context of viral infection.
          2. Which viral proteins are key drivers of this process.
          3. How therapeutic interventions attempt to disrupt this process.
        `;
        break;
      case NodeType.DATASET:
        specificContext = `
          Context: This is a Dataset or Research Resource for SARS-CoV-2.
          Focus On:
          1. Data types included (sequences, structures, literature).
          2. How researchers are using this to accelerate discovery.
          3. Accessibility and major contributors.
        `;
        break;
      default:
        specificContext = `
          Context: This is a biological entity (Protein, Drug, Pathway) related to COVID-19.
          Focus On:
          1. Mechanism of action or pathophysiology.
          2. Recent experimental evidence (2023-2025).
          3. Clinical implications.
        `;
    }

    const prompt = `
      You are an expert computational biologist and virologist.
      
      Entity: "${node.label}"
      Type: ${node.type}
      Description: ${node.description}
      
      ${specificContext}

      Using Google Search, find the latest credible information (publications, health agency reports, data portals).
      
      Output Format (Markdown):
      - **Executive Summary**: A high-level overview of the entity's current status in the pandemic.
      - **Key Insights**: Bullet points addressing the "Focus On" items above.
      - **Scientific Context**: A brief paragraph on why this entity matters for future preparedness or treatment.
      
      Ensure citations are implicit via the grounding tool (do not manually type [1]).
    `;

    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: prompt,
      config: {
        tools: [{ googleSearch: {} }],
      },
    });

    const text = response.text || "No enrichment data available.";
    
    // Extract grounding chunks for citations
    const chunks = response.candidates?.[0]?.groundingMetadata?.groundingChunks || [];
    const sources = chunks
      .map(chunk => {
        if (chunk.web) {
          return { title: chunk.web.title || "Web Source", uri: chunk.web.uri || "#" };
        }
        return null;
      })
      .filter((s): s is { title: string; uri: string } => s !== null);

    // Dedup sources
    const uniqueSourcesMap = new Map<string, { title: string; uri: string }>();
    sources.forEach(item => uniqueSourcesMap.set(item.uri, item));
    const uniqueSources = Array.from(uniqueSourcesMap.values());

    return {
      summary: text,
      sources: uniqueSources,
      relatedTopics: [] 
    };

  } catch (error) {
    console.error("Gemini enrichment failed:", error);
    return {
      summary: "Failed to load AI enrichment. Please check your API key or network connection.",
      sources: [],
      relatedTopics: []
    };
  }
};