import mongoose from "mongoose";

const gallerySchema = new mongoose.Schema({
  title: {
    type: String,
    required: false,
    trim: true
  },
  description: {
    type: String,
    required: false,
    trim: true
  },
  imageUrl: {
    type: String,
    required: true, // Every entry must have an image
  },
  date: {
    type: Date,
    default: Date.now,
  }
});

const Gallery = mongoose.model("Gallery", gallerySchema);

export default Gallery;
