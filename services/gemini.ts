
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
        domainInstruction = "Quantum LIMIT Graph Mode: Handle multi-intent queries like 'structural vs non-structural trade-offs'. Meta-Cognitive Task: Explicitly reflect on evidence gaps. Highlight RD curve trade-offs between immune evasion and functional fitness in synthesis. Explore Hybrid Classical-Quantum ML models for variant transmissibility scoring.";
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
      You are an advanced Meta-Cognitive Engine for the domain: ${domain}.
      
      User Evidence/Query: "${query}"
      
      Available Knowledge Graph Nodes:
      ${nodeContext}

      Specific Domain Instructions: ${domainInstruction}

      Task:
      1. Use Google Search to verify the latest scientific data related to the query.
      2. Analyze the query for MULTIPLE INTENTS.
      3. Perform a "Quantum-Enhanced Meta-Cognition":
         - Break down reasoning steps.
         - Critique assumptions.
         - GENERATE A "Hybrid Classical-Quantum Confidence Score" (0-100) representing the reliability of the prediction if it were run on a hybrid QML model.
      4. Identify relevant nodes.
      5. Formulate a scientific hypothesis.
      6. Synthesize the findings into a CLEAR, READABLE summary. Use Markdown formatting (bullet points, bold key terms) to make it easy to digest.

      IMPORTANT: Return the response in RAW JSON format only.
      Expected JSON Structure:
      {
        "reasoning": {
            "intentsDetected": ["string"],
            "steps": ["string"],
            "biasCheck": "string",
            "confidenceScore": number
        },
        "quantumScore": number, // The simulated Hybrid QML Score
        "hypothesis": "string",
        "synthesis": "string", // Use Markdown here (bullets, bold)
        "relevantNodeIds": ["string"]
      }
    `;

    // USING GEMINI 3 PRO WITH THINKING BUDGET FOR COMPLEX REASONING
    const response = await ai.models.generateContent({
      model: "gemini-3-pro-preview",
      contents: prompt,
      config: {
        tools: [{ googleSearch: {} }],
        thinkingConfig: { thinkingBudget: 32768 }, // Max thinking budget
        // No maxOutputTokens per instruction
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

        // Validation is a simpler task, stick to Flash to save latency/cost
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
