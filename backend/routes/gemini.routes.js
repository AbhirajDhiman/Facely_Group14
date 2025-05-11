import { Router } from "express";
const router = Router();
import { verifyToken } from "../middlewares/verifyToken.js";
import upload from "../middlewares/multer.js";

import { analyzeImage } from "../controllers/gemini.controller.js";


router.post('/analyze-image', verifyToken, upload.single("image"), analyzeImage);

export default router;
