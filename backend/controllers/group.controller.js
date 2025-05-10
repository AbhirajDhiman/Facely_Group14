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
    try {
      const group = await Group.findById(req.params.groupId);
      if (group.creator.toString() !== req.userId) {
        throw new Error("Not a group creator");
      }
  
        console.log(req.file);
      // Upload image to Cloudinary first
      const imageUrl = await uploadToCloudinary(req.file.path);
  
        console.log(imageUrl)
      // Generate embeddings using Python service
      const formData = new FormData();
      formData.append("image", fs.createReadStream(req.file.path));
      const embeddingRes = await axios.post(
        "http://127.0.0.1:8000/make-multiple-embeddings",
        formData,
        { headers: formData.getHeaders() }
      );
  
      const embeddings = embeddingRes.data.embedding;
  
      if (!embeddings || !embeddings.length) {
        throw new Error("Face detection failed or no faces found");
      }
  
      // Create picture instance
      const picture = new Picture({
        url: imageUrl,
        sizeInMB: req.file.size / (1024 * 1024),
        uploadedBy: req.userId,
        embeddings, // correct plural field
        group: group._id
      });
  
      // Find all members
      const members = await User.find({ _id: { $in: group.members } });
  
      // Run embedding comparisons in parallel
      const visibleChecks = await Promise.all(
        members.map(async (member) => {
          const isMatch = await compareEmbeddings(member.faceEmbedding, embeddings);
          return isMatch ? member._id : null;
        })
      );
  
      // Filter matched members
      picture.visibleTo = visibleChecks.filter(Boolean); // remove nulls
      await picture.save();
  
      // Update group gallery
      group.gallery.push(picture._id);
      await group.save();
  
    //   Clean up temp file
      if (fs.existsSync(req.file.path)) {
        fs.unlinkSync(req.file.path);
      }
  
      res.status(201).json({
        success: true,
        visibleTo: picture.visibleTo,
        pictureId: picture._id
      });
  
    } catch (error) {
      if (req.file && fs.existsSync(req.file.path)) {
        fs.unlinkSync(req.file.path);
      }
      res.status(400).json({ success: false, message: error.message });
    }
  };

  
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
  
      const filtered = group.gallery.filter(image => 
        image.visibleTo.some(id => id.equals(req.userId))
      );
  
      res.status(200).json({ success: true, images: filtered });
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