// controllers/group.controller.js
import crypto from "crypto";
import axios from "axios";
import FormData from "form-data";
import fs from "fs";

const generateInviteCode = async () => {
  const code = crypto.randomBytes(4).toString("hex");
  const exists = await Group.findOne({ inviteCode: code });
  return exists ? generateInviteCode() : code;
};

export const createGroup = async (req, res) => {
  try {
    const group = new Group({
      name: req.body.name,
      creator: req.userId,
      inviteCode: await generateInviteCode(),
      members: [req.userId]
    });
    await group.save();
    res.status(201).json({ success: true, group });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
};

export const joinGroup = async (req, res) => {
  try {
    const group = await Group.findOne({ inviteCode: req.body.inviteCode });
    if (!group) throw new Error("Invalid invite code");
    
    if (!group.members.includes(req.userId)) {
      group.members.push(req.userId);
      await group.save();
    }
    
    res.status(200).json({ success: true, group });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
};

export const uploadGroupImage = async (req, res) => {
  try {
    const group = await Group.findById(req.params.groupId);
    if (!group.members.includes(req.userId)) throw new Error("Not a member");

    // Generate image embedding
    const formData = new FormData();
    formData.append("image", fs.createReadStream(req.file.path));
    const embeddingRes = await axios.post(
      "http://127.0.0.1:8000/make-embedding",
      formData,
      { headers: formData.getHeaders() }
    );

    if (!embeddingRes.data.success) {
      throw new Error("Face detection failed");
    }

    // Compare with all members
    const visibleTo = [];
    const members = await User.find({ _id: { $in: group.members } });

    for (const member of members) {
      const compareForm = new FormData();
      compareForm.append("image", fs.createReadStream(req.file.path));
      compareForm.append("embedding", JSON.stringify(member.faceEmbedding));

      const compareRes = await axios.post(
        "http://127.0.0.1:8000/compare-embedding",
        compareForm,
        { headers: compareForm.getHeaders() }
      );

      if (compareRes.data.match) visibleTo.push(member._id);
    }

    // Upload to Cloudinary
    const imageUrl = await uploadToCloudinary(req.file.path);

    // Save to group gallery
    group.gallery.push({
      url: imageUrl,
      sizeInMB: req.file.size / (1024 * 1024),
      uploadedBy: req.userId,
      visibleTo
    });

    await group.save();
    fs.unlinkSync(req.file.path);
    
    res.status(201).json({ success: true, visibleTo });
  } catch (error) {
    if (req.file) fs.unlinkSync(req.file.path);
    res.status(400).json({ success: false, message: error.message });
  }
};

export const getGroupImages = async (req, res) => {
  try {
    const group = await Group.findById(req.params.groupId)
      .populate("gallery.uploadedBy", "name profilePic");
    
    if (!group.members.includes(req.userId)) throw new Error("Not a member");

    const filtered = group.gallery.filter(image => 
      image.visibleTo.some(id => id.equals(req.userId))
    );

    res.status(200).json({ success: true, images: filtered });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
};