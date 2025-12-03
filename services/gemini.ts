import { GoogleGenAI } from "@google/genai";
import { EnrichmentData, GraphNode } from '../types';

const getAiClient = () => {
  const apiKey = process.env.API_KEY;
  if (!apiKey) {
    console.error("API_KEY is missing from environment variables.");
    return null;
  }
  return new GoogleGenAI({ apiKey });
};

export const enrichNodeWithGemini = async (node: GraphNode): Promise<EnrichmentData | null> => {
  const ai = getAiClient();
  if (!ai) return null;

  try {
    const prompt = `
      You are an expert computational biologist and virologist specializing in SARS-CoV-2.
      
      I need you to provide a "Contextual Enrichment" for the biological entity: "${node.label}" (${node.type}).
      
      Using Google Search, find:
      1. Recent scientific literature (papers from 2023-2025 preferred) discussing this entity in the context of COVID-19.
      2. Any new experimental evidence regarding its mechanism of action or drug interactions.
      3. Relevant clinical trial outcomes if applicable.

      Format your response as a concise summary.
      DO NOT return JSON. Return readable text formatted with Markdown.
      Structure:
      - **Summary of Recent Findings**: A paragraph synthesizing the latest knowledge.
      - **Key Mechanisms**: Bullet points.
      - **Clinical Relevance**: A short paragraph.
    `;

    // Using gemini-2.5-flash for search grounding as per best practices for tool use
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
      relatedTopics: [] // Could extract these with a structured prompt in a second pass if needed
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