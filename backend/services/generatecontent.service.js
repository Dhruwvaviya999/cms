import ai from "../config/gemini.js";

async function generateContentWithGemini(prompt) {
  const response = await ai.models.generateContent({
    model: "gemini-2.5-flash",
    contents: prompt,
  });
  return response.text;
}

export {generateContentWithGemini}