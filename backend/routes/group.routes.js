// routes/group.routes.js
import { Router } from "express";
const router = Router();
import { 
  createGroup, 
  joinGroup, 
  uploadGroupImage, 
  getGroupImages ,
  getMetaData,
  getGroupMembers
} from "../controllers/group.controller.js";
import { verifyToken } from "../middlewares/verifyToken.js";
import upload from "../middlewares/multer.js";
import { getMyGroups } from "../controllers/auth.controller.js";

router.post("/create", verifyToken, createGroup);
router.post("/join", verifyToken, joinGroup);
router.post("/:groupId/upload", verifyToken, upload.array("image"), uploadGroupImage);
router.get("/:groupId/images", verifyToken, getGroupImages);
router.get("/:groupId/info", verifyToken, getMetaData);
router.get('/my-groups', verifyToken, getMyGroups);
router.get('/:groupId/members', verifyToken, getGroupMembers);

export default router;