import { Router } from "express";
const router = Router();
import { verifyToken } from "../middlewares/verifyToken.js";
import upload from "../middlewares/multer.js";
import { uploadPicture } from "../controllers/gallery.controller.js";


router.post('/upload-pic', verifyToken, upload.single("picture"), uploadPicture);

export default router;