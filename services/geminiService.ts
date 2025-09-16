// @ts-ignore
import { GoogleGenAI, Type } from "@google/genai";
import type { FormState, GenerationResult } from '../types';

// FIX: Per @google/genai coding guidelines, the API key must be read from process.env.API_KEY.
// This also resolves TS errors related to missing vite/client types.
if (!process.env.API_KEY) {
  throw new Error("API_KEY environment variable not set");
}

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

export const generateCaption = async (formState: FormState): Promise<GenerationResult> => {
  const { platform, productName, style, audience, length, generateHashtags } = formState;

  const prompt = `You are an expert social media marketer specializing in the Cambodian market. Your task is to generate a compelling caption in the Khmer language.

**Instructions:**
1. The entire output, including the caption and hashtags, MUST be in Khmer script.
2. Do not include any English text or translations unless it's a brand name that is commonly used in English.
3. Adapt the tone and style to the specified platform. For TikTok, use more emojis and a casual tone. For Facebook, be slightly more descriptive. For YouTube, focus on a clear and engaging description for a video.
4. Ensure the caption is natural and fluent for native Khmer speakers.

**Caption Details:**
- **Platform:** ${platform}
- **Product/Service/Topic:** ${productName}
- **Style:** ${style}
- **Target Audience:** ${audience}
- **Desired Length:** ${length}

**Task:**
Generate the caption based on the details above.
${generateHashtags ? 'After the caption, provide a list of 5-7 relevant and popular hashtags in Khmer, each starting with the # symbol.' : 'Do not generate hashtags.'}
`;

  try {
    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: prompt,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            caption: {
              type: Type.STRING,
              description: "The generated social media caption in Khmer language.",
            },
            hashtags: {
              type: Type.ARRAY,
              description: "An array of relevant hashtags in Khmer. Should be an empty array if hashtags were not requested.",
              items: {
                type: Type.STRING,
              },
            },
          },
          required: ["caption", "hashtags"],
        },
      },
    });

    const jsonString = response.text.trim();
    const parsedResult = JSON.parse(jsonString) as GenerationResult;

    if (!parsedResult.caption) {
        throw new Error("API returned an empty caption.");
    }

    return parsedResult;
  } catch (error) {
    console.error("Error calling Gemini API:", error);
    throw new Error("Failed to generate caption from Gemini API.");
  }
};
