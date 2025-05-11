// models/picture.model.js
import mongoose from "mongoose";
import { type } from "os";

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
  },
  description: {
    type: String,
    required: true
  },
  peopleDetected: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  }]
}, { timestamps: true });

export const Picture = mongoose.model('Picture', pictureSchema);