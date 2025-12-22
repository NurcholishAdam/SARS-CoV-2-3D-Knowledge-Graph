
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

export const analyzeEvidence = async (query: string, availableNodes: GraphNode[], domain: GraphDomain): Promise<HypothesisResult | null> => {
  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
  const nodeContext = availableNodes.map(n => `${n.id} (${n.label}, ${n.type})`).join("\n");

  try {
    // Stage 1: Multilingual Verification via Gemini 3 Flash (Input Law)
    const verificationResponse = await ai.models.generateContent({
      model: "gemini-3-flash-preview",
      contents: `Perform cross-domain verification for query: "${query}". Analyze established facts and multi-intent signals. Detect graph depth required for the prompt logic.`,
      config: { tools: [{ googleSearch: {} }] }
    });
    
    const facts = verificationResponse.text;
    const sources = extractSources(verificationResponse);

    // Stage 2: LORE Compliance Reasoning via Gemini 3 Pro
    const prompt = `
      You are the LORE-Compliance Reasoning Engine (Laws of Reasoning Framework).
      
      Verified Context: ${facts}
      User Query: "${query}"
      Active Domain: ${domain}
      Available Node Context: ${nodeContext}

      TASK: Perform Universal Reasoning while auditing compliance with LORE Laws.
      
      STAGES OF ANALYSIS:
      1. INPUT AUDIT: Map multilingual complexity signals.
      2. COMPUTE LAW TESTS: 
         - Monotonicity: Is reasoning token count proportionate to graph depth?
         - Compositionality: Compose query as X = (X1 + X2) and test if compute(X) ≈ compute(X1) + compute(X2).
      3. ACCURACY LAW TESTS:
         - Accuracy Monotonicity: Ensure accuracy score decreases as graph traversal depth increases.
         - Accuracy Compositionality: Test if Accuracy(X1+X2) ≈ Accuracy(X1) * Accuracy(X2).
      4. QUANTUM ENHANCEMENTS: Use Quantum Circuit Depth as a proxy for logic gate complexity.

      RETURN RAW JSON ONLY:
      {
        "universalReasoning": {
          "firstPrinciples": ["string"],
          "crossDomainSynergy": [{"domain": "string", "insight": "string"}],
          "abstractLogicMapping": "string",
          "certaintyScore": number
        },
        "lore": {
          "complexity": {
            "graphDepth": number,
            "entropy": number,
            "quantumCircuitDepth": number,
            "tokenCount": number
          },
          "laws": {
            "computeMonotonicity": boolean,
            "compositionalityScore": number,
            "accuracyDecay": number
          },
          "compliance": {
            "nMAD": number, 
            "spearman": number,
            "status": "High" | "Partial" | "Fail"
          }
        },
        "reasoning": {
          "intentsDetected": ["string"],
          "steps": ["string"],
          "biasCheck": "Reflect on AMR data gaps or specific domain epistemic blind spots.",
          "confidenceScore": number,
          "quantumStages": {
            "superposition": "string",
            "entanglement": "string",
            "interference": "string",
            "collapse": "string",
            "decoherence": "string"
          }
        },
        "hypothesis": "string",
        "synthesis": "Markdown formatted summary.",
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
    console.error("LORE Reasoning Error:", error);
    return null;
  }
};

export const validateProposal = async (proposal: { label: string; description: string; type: string }, domain: GraphDomain) => {
    const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
    const prompt = `Validate the following proposal for the ${domain} graph: "${proposal.label} - ${proposal.description}". Use search. Return JSON {approved: boolean, critique: string, provenanceScore: number, refinedNode: {label: string, description: string}}`;
    const response = await ai.models.generateContent({
        model: "gemini-3-flash-preview", 
        contents: prompt,
        config: { tools: [{ googleSearch: {} }] }
    });
    const cleanText = response.text.replace(/```json|```/g, '').trim();
    const res = JSON.parse(cleanText);
    res.sources = extractSources(response);
    return res;
};

export const enrichNodeWithGemini = async (node: GraphNode, domain: GraphDomain) => {
  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
  const prompt = `Enrich entity "${node.label}" in ${domain} context. Return Markdown.`;
  const response = await ai.models.generateContent({
    model: "gemini-3-flash-preview",
    contents: prompt,
    config: { tools: [{ googleSearch: {} }] }
  });
  return { summary: response.text, sources: extractSources(response), relatedTopics: [] };
};
