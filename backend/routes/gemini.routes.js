
import { Router } from "express";
import { chatBot } from "../controllers/gemini.controller.js";

const router = Router();

router.post("/chatbot", chatBot);

export default router;