
import { GoogleGenAI, Type } from "@google/genai";
import { EnrichmentData, GraphNode, NodeType, HypothesisResult, HubProposal, GraphDomain } from '../types';

const getAiClient = () => {
  const apiKey = process.env.API_KEY;
  if (!apiKey) {
    console.error("API_KEY is missing from environment variables.");
    return null;
  }
  return new GoogleGenAI({ apiKey });
};

// Helper to extract sources from grounding metadata
const extractSources = (response: any) => {
    const chunks = response.candidates?.[0]?.groundingMetadata?.groundingChunks || [];
    return chunks
      .map((chunk: any) => {
        if (chunk.web) {
          return { title: chunk.web.title || "Web Source", uri: chunk.web.uri || "#" };
        }
        return null;
      })
      .filter((s: any): s is { title: string; uri: string } => s !== null);
};

export const analyzeEvidence = async (query: string, availableNodes: GraphNode[], domain: GraphDomain): Promise<HypothesisResult | null> => {
  const ai = getAiClient();
  if (!ai) return null;

  const nodeContext = availableNodes.map(n => `${n.id} (${n.label}, ${n.type})`).join("\n");

  let domainInstruction = "";
  switch(domain) {
      case GraphDomain.SARS_COV_2:
        domainInstruction = "Graph Nuances: Consider Socioeconomic factors (HealthcareAccess), Comorbidities (Diabetes), Coinfections (Influenza), and Environmental factors (AirQuality) alongside Viral biology. Analyze the 'Rate-Distortion' trade-off between speed of immune response and tissue damage.";
        break;
      case GraphDomain.AMR: 
        domainInstruction = "Focus on transmission pathways, gene mechanisms, and treatment alternatives. Reflect on gaps in surveillance data."; 
        break;
      case GraphDomain.ONCOLOGY:
        domainInstruction = "Focus on precision medicine, clinical trial outcomes, and molecular drivers. Analyze patient cohort demographics and drug repurposing potential using hybrid quantum models.";
        break;
      case GraphDomain.QUANTUM_HEALTH:
        domainInstruction = "Focus on VQE, QAOA, and NISQ hardware limitations. Evaluate hybrid classical-quantum efficacy.";
        break;
      default: 
        domainInstruction = "Focus on domain-specific causal relationships and evidence gaps.";
  }

  try {
    const prompt = `
      You are an advanced Meta-Cognitive Engine utilizing a 5-STAGE QUANTUM CORRELATION FRAMEWORK.
      Domain: ${domain}
      
      User Evidence/Query: "${query}"
      
      Available Knowledge Graph Nodes:
      ${nodeContext}

      Specific Domain Instructions: ${domainInstruction}

      Task:
      1. Use Google Search to verify the latest scientific data.
      2. Apply the 5-Stage Framework to the analysis:
         - **Stage 1: Superposition (Data Ingestion)**: Map all potential variables and conflicting data points.
         - **Stage 2: Entanglement (Correlation)**: Identify hidden multi-intent links and non-obvious dependencies (Serendipity).
         - **Stage 3: Interference (Filter)**: Weigh conflicting evidence to reduce noise/bias.
         - **Stage 4: Collapse (Hypothesis)**: Formulate the single most probable scientific hypothesis.
         - **Stage 5: Decoherence (Validation)**: Cross-reference with physical/biological constraints (e.g., thermodynamic limits, clinical reality).
      
      3. Identify "Serendipity Traces": 2-3 unexpected or novel connections between disparate nodes (e.g., Air Quality <-> Viral Entry).

      IMPORTANT: Return the response in RAW JSON format only.
      Expected JSON Structure:
      {
        "reasoning": {
            "intentsDetected": ["string"],
            "steps": ["string"],
            "biasCheck": "string",
            "confidenceScore": number,
            "quantumStages": {
                "superposition": "string (summary of stage 1)",
                "entanglement": "string (summary of stage 2)",
                "interference": "string (summary of stage 3)",
                "collapse": "string (summary of stage 4)",
                "decoherence": "string (summary of stage 5)"
            }
        },
        "serendipityTraces": ["string"],
        "quantumScore": number, 
        "hypothesis": "string",
        "synthesis": "string", // Use Markdown (bullets, bold)
        "relevantNodeIds": ["string"]
      }
    `;

    // USING GEMINI 3 PRO WITH THINKING BUDGET FOR COMPLEX REASONING
    const response = await ai.models.generateContent({
      model: "gemini-3-pro-preview",
      contents: prompt,
      config: {
        tools: [{ googleSearch: {} }],
        thinkingConfig: { thinkingBudget: 32768 }, 
      }
    });

    const text = response.text || "{}";
    const cleanText = text.replace(/```json|```/g, '').trim();
    const result = JSON.parse(cleanText);
    
    // Attach sources
    result.sources = extractSources(response);
    
    return result as HypothesisResult;

  } catch (error) {
    console.error("Gemini hypothesis generation failed:", error);
    return null;
  }
};

export const validateProposal = async (proposal: { label: string; description: string; type: string }, domain: GraphDomain): Promise<{ approved: boolean; critique: string; refinedNode?: GraphNode; sources?: { title: string; uri: string }[]; provenanceScore?: number }> => {
    const ai = getAiClient();
    if (!ai) return { approved: false, critique: "AI Service Unavailable" };

    try {
        const prompt = `
            You are a Scientific Reviewer (Governance Checkpoint) for the ${domain} Open Source Hub.
            
            User Proposal:
            Label: ${proposal.label}
            Type: ${proposal.type}
            Description: ${proposal.description}

            Task:
            1. Use Google Search to find INDEPENDENT scientific sources/studies validating this link.
            2. Count unique, credible studies (Provenance Check).
            3. Rule: Reject if fewer than 2 independent studies support it.
            4. If valid, approve.

            IMPORTANT: Return RAW JSON only.
            {
                "approved": boolean,
                "provenanceScore": number,
                "critique": "string",
                "refinedId": "string",
                "refinedDescription": "string"
            }
        `;

        const response = await ai.models.generateContent({
            model: "gemini-2.5-flash", 
            contents: prompt,
            config: {
                tools: [{ googleSearch: {} }],
            }
        });

        const text = response.text || "{}";
        const cleanText = text.replace(/```json|```/g, '').trim();
        const result = JSON.parse(cleanText);
        const sources = extractSources(response);
        
        if (result.approved) {
            return {
                approved: true,
                critique: result.critique,
                provenanceScore: result.provenanceScore,
                refinedNode: {
                    id: result.refinedId || proposal.label,
                    label: proposal.label,
                    type: proposal.type as NodeType,
                    description: result.refinedDescription || proposal.description,
                    val: 20
                },
                sources
            };
        }
        
        return { approved: false, critique: result.critique, sources, provenanceScore: result.provenanceScore };

    } catch (e) {
        console.error("Validation Error", e);
        return { approved: false, critique: "Validation Error or Parsing Error" };
    }
};

export const enrichNodeWithGemini = async (node: GraphNode, domain: GraphDomain): Promise<EnrichmentData | null> => {
  const ai = getAiClient();
  if (!ai) return null;

  try {
    const prompt = `
      You are an expert in ${domain}.
      Entity: "${node.label}"
      Type: ${node.type}
      Description: ${node.description}
      
      Using Google Search, find the latest credible information.
      
      Output Format (Markdown):
      - **Executive Summary**: High-level overview.
      - **Key Insights**: Bullet points.
      - **Context**: Relevance to ${domain}.
    `;

    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: prompt,
      config: {
        tools: [{ googleSearch: {} }],
      },
    });

    const text = response.text || "No enrichment data available.";
    const sources = extractSources(response);

    return {
      summary: text,
      sources: sources,
      relatedTopics: [] 
    };

  } catch (error) {
    console.error("Gemini enrichment failed:", error);
    return {
      summary: "Failed to load AI enrichment.",
      sources: [],
      relatedTopics: []
    };
  }
};
