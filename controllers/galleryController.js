import Gallery from "../models/gallery.js";
import { isItAdmin } from "./userController.js";

// Add new gallery image
export async function addGalleryImage(req, res) {
  try {
    if (!isItAdmin(req)) {
      return res.status(403).json({ message: "Unauthorized access" });
    }

    const { title, description, imageUrl } = req.body;

    if (!imageUrl) {
      return res.status(400).json({ message: "Image URL is required" });
    }

    const newImage = new Gallery({
      title,
      description,
      imageUrl,
      date: new Date()
    });

    const savedImage = await newImage.save();

    res.status(201).json({
      message: "Gallery image added successfully",
      image: savedImage
    });
  } catch (error) {
    console.error("Add Error:", error);
    res.status(500).json({ message: "Failed to add gallery image" });
  }
}

// Get all gallery images
export async function getGalleryImages(req, res) {
  try {
    const images = await Gallery.find().sort({ date: -1 });
    res.json(images);
  } catch (error) {
    console.error("Get Error:", error);
    res.status(500).json({ message: "Failed to fetch gallery images" });
  }
}


// Update gallery image
export async function updateGalleryImage(req, res) {
  try {
    if (!isItAdmin(req)) {
      return res.status(403).json({ message: "Unauthorized access" });
    }

    const updatedImage = await Gallery.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true }
    );

    if (!updatedImage) {
      return res.status(404).json({ message: "Image not found" });
    }

    res.json({
      message: "Gallery image updated successfully",
      image: updatedImage
    });
  } catch (error) {
    console.error("Update Error:", error);
    res.status(500).json({ message: "Failed to update gallery image" });
  }
}

// Delete gallery image
export async function deleteGalleryImage(req, res) {
  try {
    if (!isItAdmin(req)) {
      return res.status(403).json({ message: "Unauthorized access" });
    }

    const deletedImage = await Gallery.findByIdAndDelete(req.params.id);

    if (!deletedImage) {
      return res.status(404).json({ message: "Gallery image not found" });
    }

    res.json({
      message: "Gallery image deleted successfully",
      id: deletedImage._id
    });
  } catch (error) {
    console.error("Delete Error:", error);
    res.status(500).json({ message: "Failed to delete gallery image" });
  }
}
