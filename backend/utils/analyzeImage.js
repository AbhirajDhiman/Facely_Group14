import fs from "fs";
import { getVisionModel } from "../services/gemini.js";

const model = getVisionModel();

async function analyzeImage(imagePath, prompt = "Give a brief 20 to 30 word description of what is shown or said in this image.") {
  const imageData = fs.readFileSync(imagePath).toString("base64");

  const result = await model.generateContent([
    { text: prompt },
    {
      inlineData: {
        mimeType: "image/jpeg",
        data: imageData,
      },
    },
  ]);

  const response = await result.response;
  console.log("🔍 Analysis Result:\n", response.text());
}

export default analyzeImage;
