// controllers/group.controller.js
import crypto from "crypto";
import axios from "axios";
import FormData from "form-data";
import fs from "fs";
import { Group } from "../models/group.model.js";
import { User } from "../models/user.model.js";
import uploadToCloudinary from "../cloudinary/uploadToCloudinary.js";
import { Picture } from "../models/picture.model.js";
import { compareEmbeddings } from "../utils/faceRecognition.js";
import { analyzeImage } from "./gemini.controller.js";
import { getVisionModel } from "../services/gemini.js";


const model = getVisionModel();


const generateInviteCode = async () => {
  const code = crypto.randomBytes(4).toString("hex");
  const exists = await Group.findOne({ inviteCode: code });
  return exists ? generateInviteCode() : code;
};

export const createGroup = async (req, res) => {
    console.log("aagya")
    const inviteCode = await generateInviteCode();
  try {
    const group = new Group({
      name: req.body.name,
      creator: req.userId,
      inviteCode,
      members: [req.userId]
    });
    await group.save();
    const user = await User.findById(req.userId);
    user.createdGroups.push(group._id);
    user.joinedGroups.push(group._id);
    await user.save();
    res.status(200).json({ success: true, group, ok:true, inviteCode });
  } catch (error) {
    console.log(error.message);
    res.status(400).json({ success: false, message: error.message });
  }
};

export const joinGroup = async (req, res) => {
  try {
    const group = await Group.findOne({ inviteCode: req.body.inviteCode });
    if (!group) throw new Error("Invalid invite code");
    
    if (group.members.includes(req.userId)) {
        return res.status(400).json({ success: false, message: "You already have joined the group" });
    }
    
    group.members.push(req.userId);
    await group.save();
    const user = await User.findById(req.userId);
    user.joinedGroups.push(group._id);
    await user.save();
    res.status(200).json({ success: true, group });
  } catch (error) {
    console.log(error.message)
    res.status(400).json({ success: false, message: error.message });
  }
};

export const uploadGroupImage = async (req, res) => {
  let tempFilePath = req.file?.path;

  try {
      const group = await Group.findById(req.params.groupId);
      if (group.creator.toString() !== req.userId) {
          throw new Error("Not a group creator");
      }
      const imageData = fs.readFileSync(tempFilePath).toString("base64");

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
      const description = response.text();
      console.log(description);

      // 1. Upload to Cloudinary
      // const imageUrl = await uploadToCloudinary(tempFilePath);

      // 2. Create initial Picture document without embeddings/visibility
      // const picture = new Picture({
      //     url: imageUrl,
      //     sizeInMB: req.file.size / (1024 * 1024),
      //     uploadedBy: req.userId,
      //     group: group._id,
      //     embeddings: [],
      //     visibleTo: [],
      //     description
      // });
      // await picture.save();
      // console.log(picture);

      // // 3. Update group gallery immediately
      // group.gallery.push(picture._id);
      // await group.save();

      // // 4. Send quick response
      res.status(201).json({ success: true, message: "Image uploaded successfully" });

      // // 5. Process embeddings and visibility in the background
      // processEmbeddingsAndVisibility(picture._id, tempFilePath, group.members)
      //     .catch(error => console.error("Background processing failed:", error));

  } catch (error) {
      // Cleanup temp file on error
      if (tempFilePath && fs.existsSync(tempFilePath)) {
          fs.unlinkSync(tempFilePath);
      }
      res.status(400).json({ success: false, message: error.message });
  }
};

// Background processing function
async function processEmbeddingsAndVisibility(pictureId, filePath, memberIds) {
  try {
      // Generate embeddings via Python service
      const formData = new FormData();
      formData.append("image", fs.createReadStream(filePath));
      const embeddingRes = await axios.post(
          "http://127.0.0.1:8000/make-multiple-embeddings",
          formData,
          { headers: formData.getHeaders() }
      );

      const embeddings = embeddingRes.data.embedding;
      if (!embeddings?.length) throw new Error("Face detection failed");

      // Compare with members' embeddings
      const members = await User.find({ _id: { $in: memberIds } });
      const visibleTo = await Promise.all(
          members.map(async (member) => 
              (await compareEmbeddings(member.faceEmbedding, embeddings)) ? member._id : null
          )
      ).then(results => results.filter(Boolean));

      // Update picture with results
      await Picture.findByIdAndUpdate(pictureId, { embeddings, visibleTo });

  } catch (error) {
      console.error("Background processing error:", error);

  } finally {
      // Cleanup temp file
      if (filePath && fs.existsSync(filePath)) fs.unlinkSync(filePath);
  }
}

  
  export const getGroupImages = async (req, res) => {
    try {
      const group = await Group.findById(req.params.groupId)
        .populate({
          path: 'gallery',
          populate: {
            path: 'uploadedBy',
            select: 'name profilePic'
          }
        });
  
      if (!group) {
        return res.status(404).json({ success: false, message: "Group not found" });
      }
  
      if (!group.members.some(member => member.equals(req.userId))) {
        return res.status(403).json({ success: false, message: "Not a member" });
      }
  
      let images;
      if (group.creator.equals(req.userId)) {
        images = group.gallery;
      } else {
        images = group.gallery.filter(image => 
          image.visibleTo.some(id => id.equals(req.userId))
        );
      }
  
      res.status(200).json({ success: true, images });
    } catch (error) {
      console.error(error);
      res.status(500).json({ success: false, message: "Server error" });
    }
  };

export const getMetaData = async (req, res) => {
  try {
    const group = await Group.findById(req.params.groupId)
      .populate("creator", "name profilePic")
      .populate("members", "name profilePic");

    res.status(200).json({ success: true, group });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
};