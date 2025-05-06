// models/picture.model.js
import mongoose from "mongoose";

const pictureSchema = new mongoose.Schema({
  url: {
    type: String,
    required: true
  },
  sizeInMB: {
    type: Number,
    required: true
  },
  uploadedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  visibleTo: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  }],
  embedding: {
    type: [[Number]],
    required: true
  },
  group: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Group',
    required: true
  }
}, { timestamps: true });

export const Picture = mongoose.model('Picture', pictureSchema);