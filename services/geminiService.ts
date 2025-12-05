import { GoogleGenAI } from "@google/genai";
import { AnalysisResponse } from "../types";

// Function to analyze image using Gemini 2.5 Flash Image
export const analyzeImageWithGemini = async (
  apiKey: string,
  base64Image: string
): Promise<AnalysisResponse> => {
  // Initialize the client with the provided key (User provided or env)
  const ai = new GoogleGenAI({ apiKey });

  try {
    // Clean base64 string if it contains the header
    const cleanBase64 = base64Image.replace(/^data:image\/(png|jpg|jpeg|webp);base64,/, "");

    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash-image',
      contents: {
        parts: [
          {
            inlineData: {
              mimeType: 'image/jpeg',
              data: cleanBase64,
            },
          },
          {
            text: "Analyze this image in detail. Describe the objects, setting, and any text visible. Keep the response concise and structured."
          },
        ],
      },
    });

    return {
      text: response.text || "No analysis text returned.",
    };
  } catch (error) {
    console.error("Gemini API Error:", error);
    throw new Error("Failed to analyze image. Please check your API key and try again.");
  }
};