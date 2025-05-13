import { Router } from "express";
const router = Router();
import { verifyToken } from "../middlewares/verifyToken.js";
import upload from "../middlewares/multer.js";
import { filterPhotos, getMyGallery, uploadPicture } from "../controllers/gallery.controller.js";


router.post('/upload-pic', verifyToken, upload.single("picture"), uploadPicture);
router.get('/gallery-pictures', verifyToken, getMyGallery);
router.post('/filter-photos', verifyToken, filterPhotos);


export default router;