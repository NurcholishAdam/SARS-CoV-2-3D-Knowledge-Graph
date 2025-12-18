
import { GoogleGenAI, Type } from "@google/genai";
import { EnrichmentData, GraphNode, NodeType, HypothesisResult, GraphDomain } from '../types';

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

/**
 * Universal Reasoning Model: Multi-stage Analysis
 * Stage 1: Search-based fact collection (Flash)
 * Stage 2: Universal reasoning synthesis (Pro with Thinking)
 */
export const analyzeEvidence = async (query: string, availableNodes: GraphNode[], domain: GraphDomain): Promise<HypothesisResult | null> => {
  // Always initialize client directly with process.env.API_KEY
  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
  const nodeContext = availableNodes.map(n => `${n.id} (${n.label}, ${n.type})`).join("\n");

  try {
    // Stage 1: Verification via Gemini 3 Flash
    const verificationResponse = await ai.models.generateContent({
      model: "gemini-3-flash-preview",
      contents: `Search for the latest scientific evidence regarding: "${query}". Provide a concise summary of established facts and emerging uncertainties.`,
      config: { tools: [{ googleSearch: {} }] }
    });
    
    const facts = verificationResponse.text;
    const sources = extractSources(verificationResponse);

    // Stage 2: Universal Reasoning via Gemini 3 Pro
    const prompt = `
      You are the Universal Scientific Reasoning Engine.
      
      Verified Context: ${facts}
      
      User Query: "${query}"
      Active Primary Domain: ${domain}
      
      Available Knowledge Graph Context:
      ${nodeContext}

      TASK:
      Perform "Universal Reasoning" by identifying abstract logical patterns that transcend the primary domain.
      1. Apply First-Principles Thinking to the biological and environmental data.
      2. Identify "Cross-Domain Synergy": How do principles from outside ${domain} (e.g. physics, economics, climatology) influence this specific query?
      3. Map the "Abstract Logic" of the system (e.g. feedback loops, entropy, rate-distortion limits).
      4. Synthesize a "Multi-Intent Hypothesis".

      RETURN RAW JSON ONLY:
      {
        "universalReasoning": {
          "firstPrinciples": ["string"],
          "crossDomainSynergy": [{"domain": "string", "insight": "string"}],
          "abstractLogicMapping": "string",
          "certaintyScore": number
        },
        "reasoning": {
          "intentsDetected": ["string"],
          "steps": ["string"],
          "biasCheck": "string",
          "confidenceScore": number,
          "quantumStages": {
            "superposition": "Mapping latent variables...",
            "entanglement": "Correlating multi-domain signals...",
            "interference": "Filtering noise...",
            "collapse": "Defining hypothesis...",
            "decoherence": "Validating against clinical data..."
          }
        },
        "hypothesis": "string",
        "synthesis": "Markdown formatted summary with bold key terms.",
        "relevantNodeIds": ["string"],
        "serendipityTraces": ["string"]
      }
    `;

    const response = await ai.models.generateContent({
      model: "gemini-3-pro-preview",
      contents: prompt,
      config: {
        thinkingConfig: { thinkingBudget: 32768 }
      }
    });

    const text = response.text || "{}";
    const cleanText = text.replace(/```json|```/g, '').trim();
    const result = JSON.parse(cleanText);
    result.sources = sources;
    
    return result as HypothesisResult;

  } catch (error) {
    console.error("Universal Reasoning Error:", error);
    return null;
  }
};

/**
 * Validates a user proposal for the graph.
 * Returns refined descriptions and grounding sources.
 */
export const validateProposal = async (proposal: { label: string; description: string; type: string }, domain: GraphDomain) => {
    const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
    const prompt = `Validate the following proposal for the ${domain} graph: "${proposal.label} - ${proposal.description}". 
    Use search to check scientific validity and provenance. 
    Return JSON ONLY: 
    {
      "approved": boolean, 
      "critique": "string", 
      "provenanceScore": number, 
      "refinedNode": { "label": "string", "description": "string" }
    }`;

    try {
        const response = await ai.models.generateContent({
            model: "gemini-3-flash-preview", 
            contents: prompt,
            config: { tools: [{ googleSearch: {} }] }
        });
        const cleanText = response.text.replace(/```json|```/g, '').trim();
        const result = JSON.parse(cleanText);
        result.sources = extractSources(response);
        return result;
    } catch (error) {
        console.error("Validation Error:", error);
        return { approved: false, critique: "Validation engine failed to process request." };
    }
};

export const enrichNodeWithGemini = async (node: GraphNode, domain: GraphDomain): Promise<EnrichmentData | null> => {
  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
  const prompt = `Provide a comprehensive scientific enrichment for the entity "${node.label}" within the context of ${domain}. Use search for latest data.`;
  
  try {
    const response = await ai.models.generateContent({
        model: "gemini-3-flash-preview",
        contents: prompt,
        config: { tools: [{ googleSearch: {} }] }
      });
      return { summary: response.text, sources: extractSources(response), relatedTopics: [] };
  } catch (error) {
    console.error("Enrichment Error:", error);
    return null;
  }
};
