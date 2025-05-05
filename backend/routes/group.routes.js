// routes/group.routes.js
import { Router } from "express";
const router = Router();
import { 
  createGroup, 
  joinGroup, 
  uploadGroupImage, 
  getGroupImages 
} from "../controllers/group.controller.js";
import { verifyToken } from "../middlewares/verifyToken.js";
import upload from "../middlewares/multer.js";

router.post("/create", verifyToken, createGroup);
router.post("/join", verifyToken, joinGroup);
router.post("/:groupId/upload", verifyToken, upload.single("image"), uploadGroupImage);
router.get("/:groupId/images", verifyToken, getGroupImages);

export default router;