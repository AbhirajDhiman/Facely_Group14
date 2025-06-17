import fs from "fs";
import { getVisionModel } from "../services/gemini.js";
import { chatBot as chatBotPrompt } from "../services/geminiPrompts.js";

const model = getVisionModel();

async function analyzeImage(req, res) {
  const imagePath = req.file.path;
  const imageData = fs.readFileSync(imagePath).toString("base64");

  const result = await model.generateContent([
    { text: "Give a brief 20 to 30 word description of what is shown or said in this image." },
    {
      inlineData: {
        mimeType: "image/jpeg",
        data: imageData,
      },
    },
  ]);
  

  const response = await result.response;
  res.status(201).json({ success: true, message: "Image analyzed successfully", description: response.text() });
}

async function chatBot(req, res) {
  const query = req.body.query;
  const result = await model.generateContent([{ text: chatBotPrompt(query) }]);
  const response = await result.response;
  let responseText = response.text();
  console.log("Gemini raw response:", responseText);

  // Remove code block markers if present
  responseText = responseText.trim();
  if (responseText.startsWith('```json')) {
    responseText = responseText.replace(/^```json/, '').replace(/```$/, '').trim();
  } else if (responseText.startsWith('```')) {
    responseText = responseText.replace(/^```/, '').replace(/```$/, '').trim();
  }

  try {
    const parsedResponse = JSON.parse(responseText);
    res.status(201).json({ success: true, message: "Chatbot response", response: parsedResponse });
  } catch (error) {
    console.error("Error parsing response:", error, "Raw response:", responseText);
    res.status(500).json({ success: false, message: "Failed to parse chatbot response", error: error.message, raw: responseText });
  }
}

export { analyzeImage, chatBot };
