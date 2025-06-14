import express from "express";
import { addGalleryImage, deleteGalleryImage, getGalleryImages, updateGalleryImage } from "../controllers/galleryController.js";


const galleryRouter = express.Router();

galleryRouter.get("/",getGalleryImages);
galleryRouter.post("/",addGalleryImage);
galleryRouter.put("/:id",updateGalleryImage);
galleryRouter.delete("/:id",deleteGalleryImage);

export default galleryRouter;