import { GoogleGenAI, Type } from "@google/genai";
import { TimelineData } from "../types";
import { DEFAULT_ERAS } from "../constants";

const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });

export async function fetchTimeline(scenario: string, erasToCheck: string[] = DEFAULT_ERAS): Promise<TimelineData> {
  const prompt = `Analyze the legal history of the following scenario in the United States: "${scenario}"
  
Check the legality of this scenario across the following eras: ${erasToCheck.join(", ")}.
If the user is asking to "Go Deeper" into a specific era, the eras provided will be sub-eras of that period.

Return ONLY valid JSON matching the requested schema.`;

  const response = await ai.models.generateContent({
    model: "gemini-3-flash-preview",
    contents: prompt,
    config: {
      systemInstruction: "You are an expert legal historian. Provide accurate, fascinating, and well-researched legal history. Cite real statutes, cases, or doctrines where possible. Keep reasoning concise (1-2 sentences).",
      responseMimeType: "application/json",
      responseSchema: {
        type: Type.OBJECT,
        properties: {
          eras: {
            type: Type.ARRAY,
            items: {
              type: Type.OBJECT,
              properties: {
                name: { type: Type.STRING },
                period: { type: Type.STRING },
                verdict: { type: Type.STRING, description: "Must be exactly one of: Legal, Illegal, Gray Area, No Law Exists, Legally Unimaginable" },
                reasoning: { type: Type.STRING, description: "1-2 sentences" },
                wildCard: { type: Type.STRING, description: "One short sentence" },
                whatIf: {
                  type: Type.ARRAY,
                  items: { type: Type.STRING },
                  description: "Exactly 2 scenarios"
                }
              },
              required: ["name", "period", "verdict", "reasoning", "wildCard", "whatIf"]
            }
          },
          evolutionSummary: { type: Type.STRING, description: "1-2 sentences" },
          nextTrip: { type: Type.STRING }
        },
        required: ["eras", "evolutionSummary", "nextTrip"]
      }
    }
  });

  const text = response.text;
  if (!text) throw new Error("No response from AI");
  
  try {
    return JSON.parse(text) as TimelineData;
  } catch (e) {
    console.error("Failed to parse JSON", text);
    throw new Error("Failed to parse timeline data");
  }
}
