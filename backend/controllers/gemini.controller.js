import fs from "fs";
import { getVisionModel } from "../services/gemini.js";

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

export { analyzeImage };
