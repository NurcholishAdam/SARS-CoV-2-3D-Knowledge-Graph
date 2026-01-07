
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
    // STAGE 1: Search Grounding (Verification Pass)
    const verificationResponse = await ai.models.generateContent({
      model: "gemini-3-flash-preview",
      contents: `Verify the following scientific claim/query for factuality and retrieve current literature: "${query}". Identify key biological entities and mechanisms.`,
      config: { tools: [{ googleSearch: {} }] }
    });
    
    const facts = verificationResponse.text;
    const sources = extractSources(verificationResponse);

    // STAGE 2: URM Hybrid Reasoning (Thinking Pass)
    const hybridPrompt = `
      You are the URM (Universal Reasoning Model) Hybrid Architect.
      
      Verified Context: ${facts}
      User Inquiry: "${query}"
      Active Domain: ${domain}
      Local Graph Context (Nodes): 
      ${nodeContext}

      GOAL: Implement a Hybrid Synthesis between Local Graph Data and Global Scientific Knowledge.
      
      CORE PRINCIPLES (URM Hybrid):
      1. Compositionality: How do parts (proteins/genes) form a functional whole?
      2. Monotonicity: Does adding new evidence increase or decrease certainty logically?
      3. Cross-Domain Transfer: Can an insight from synthetic biology solve a SARS-CoV-2 mechanism?

      OUTPUT FORMAT: STRICT JSON
      {
        "architectureBridge": {
          "coreSynthesis": "Abstract summary of the reasoning path.",
          "lawAlignment": "LORE law utilized (e.g., Compositionality).",
          "universalImpact": "Potential impact outside this domain.",
          "urmHybridLogic": "How local graph nodes were combined with global search data."
        },
        "universalReasoning": {
          "firstPrinciples": ["Point 1", "Point 2"],
          "crossDomainSynergy": [{"domain": "Neuro", "insight": "Parallel mechanism in protein misfolding"}],
          "abstractLogicMapping": "Conceptual graph description.",
          "certaintyScore": 0.0-1.0
        },
        "lore": {
          "complexity": { "graphDepth": 5, "entropy": 0.8, "quantumCircuitDepth": 12, "tokenCount": 1500 },
          "laws": { "computeMonotonicity": true, "compositionalityScore": 0.9, "accuracyDecay": 0.05 },
          "compliance": { "nMAD": 0.02, "spearman": 0.95, "status": "High" }
        },
        "reasoning": {
          "intentsDetected": ["intent1", "intent2"],
          "steps": ["Reasoning Step 1", "Reasoning Step 2"],
          "biasCheck": "Analysis of genotypic vs phenotypic data gaps (specifically for AMR/Pathology).",
          "confidenceScore": 0.95,
          "quantumStages": {
            "superposition": "Multiple competing hypotheses currently held in memory.",
            "entanglement": "Links between different scientific domains identified.",
            "interference": "How conflicting evidence was resolved.",
            "collapse": "The final definitive hypothesis chosen.",
            "decoherence": "Uncertainties or noise remaining in the prediction."
          }
        },
        "hypothesis": "The core novel prediction.",
        "synthesis": "Detailed Markdown explanation.",
        "relevantNodeIds": ["id1", "id2"],
        "serendipityTraces": ["Unexpected connection found between X and Y"]
      }
    `;

    const hybridResponse = await ai.models.generateContent({
      model: "gemini-3-pro-preview",
      contents: hybridPrompt,
      config: {
        thinkingConfig: { thinkingBudget: 32768 }
      }
    });

    const text = hybridResponse.text || "{}";
    const cleanText = text.replace(/```json|```/g, '').trim();
    const result = JSON.parse(cleanText);
    result.sources = sources;
    
    return result as HypothesisResult;

  } catch (error) {
    console.error("URM Hybrid Engine Error:", error);
    return null;
  }
};

export const validateProposal = async (proposal: { label: string; description: string; type: string }, domain: GraphDomain) => {
    const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
    const prompt = `Validate the following addition to the ${domain} knowledge graph: "${proposal.label}".
    Critique based on current literature. Return JSON {approved: boolean, critique: string, provenanceScore: number, refinedNode: {label: string, description: string}}`;
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
  const prompt = `Enrich the entity "${node.label}" within the ${domain} context. Provide clinical, molecular, and surveillance details. Use Markdown.`;
  const response = await ai.models.generateContent({
    model: "gemini-3-flash-preview",
    contents: prompt,
    config: { tools: [{ googleSearch: {} }] }
  });
  return { summary: response.text, sources: extractSources(response), relatedTopics: [] };
};
