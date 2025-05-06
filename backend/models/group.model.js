// models/group.model.js
import mongoose from "mongoose";

const groupSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true
  },
  creator: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  inviteCode: {
    type: String,
    required: true,
    unique: true
  },
  members: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  }],
  gallery: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Picture'
  }]
}, { timestamps: true });

export const Group = mongoose.model('Group', groupSchema);