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
  let tempFilePaths = (req.files || []).map(f => f.path);

  try {
    const group = await Group.findById(req.params.groupId);
    if (group.creator.toString() !== req.userId) {
      throw new Error("Not a group creator");
    }
    if (!req.files || req.files.length === 0) {
      throw new Error("No files uploaded");
    }

    // 1. Upload all images to Cloudinary in parallel
    const uploadResults = await Promise.all(
      req.files.map(async (file) => {
        const url = await uploadToCloudinary(file.path);
        return {
          url,
          sizeInMB: file.size / (1024 * 1024),
          localPath: file.path,
          originalName: file.originalname,
        };
      })
    );

    // 2. Create Picture docs with placeholder description
    const pictures = await Promise.all(
      uploadResults.map(async (result) => {
        const picture = new Picture({
          url: result.url,
          sizeInMB: result.sizeInMB,
          uploadedBy: req.userId,
          group: group._id,
          description: "Generating..."
        });
        await picture.save();
        group.gallery.push(picture._id);
        return picture;
      })
    );
    await group.save();

    // 3. Respond immediately with uploaded image info
    res.status(201).json({
      success: true,
      message: "Images uploaded successfully",
      images: pictures.map(p => ({
        _id: p._id,
        url: p.url,
        sizeInMB: p.sizeInMB,
        description: p.description,
      }))
    });

    // 4. Background: generate description and trigger embeddings/visibility for each image
    Promise.all(
      req.files.map(async (file, idx) => {
        try {
          const imageData = fs.readFileSync(file.path).toString("base64");
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
          console.log(description)
          await Picture.findByIdAndUpdate(pictures[idx]._id, { description });
          await processEmbeddingsAndVisibility(pictures[idx]._id, file.path, group.members);
        } catch (err) {
          console.error("Description/embeddings failed for image", file.path, err);
        } finally {
          if (file.path && fs.existsSync(file.path)) {
            fs.unlinkSync(file.path);
          }
        }
      })
    );

  } catch (error) {
    // Cleanup all temp files on error
    if (tempFilePaths && tempFilePaths.length) {
      tempFilePaths.forEach(path => {
        if (path && fs.existsSync(path)) fs.unlinkSync(path);
      });
    }
    res.status(400).json({ success: false, message: error.message });
  }
};

// Background processing function
async function processEmbeddingsAndVisibility(pictureId, filePath, memberIds) {
  try {
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
      const visibleTo = [];
      for (const member of members) {
        const isMatch = await compareEmbeddings(member.faceEmbedding, embeddings);
        if (isMatch) {
          visibleTo.push(member._id);
          // Add to user's gallery if not already present
          if (!member.gallery.includes(pictureId)) {
            member.gallery.push(pictureId);
            await member.save();
          }
        }
      }

      // Update picture with results
      await Picture.findByIdAndUpdate(pictureId, { embeddings, visibleTo });

  } catch (error) {
      console.error("Background processing error:", error.message);

  } finally {
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

export const getGroupMembers = async (req, res) => {
  try {
    const group = await Group.findById(req.params.groupId)
      .populate("members", "name profilePic");

    res.status(200).json({ success: true, members: group.members });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
};

