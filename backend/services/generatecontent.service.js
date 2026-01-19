import ai from "../config/gemini";

async function generateContentWithGemini(prompt) {
  const response = await ai.models.generateContent({
    model: "gemini-2.5-flash",
    contents: prompt,
  });
  return response.text;
}

export {generateContentWithGemini}