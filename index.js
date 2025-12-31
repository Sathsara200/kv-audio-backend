import express from "express";
import bodyParser from "body-parser";
import mongoose from "mongoose";
import jwt from "jsonwebtoken";
import cors from "cors";
import dotenv from "dotenv";

import userRouter from "./routes/userRouter.js";
import productRouter from "./routes/productRouter.js";
import reviewRouter from "./routes/reviewRouter.js";
import inquiryRouter from "./routes/InquiryRouter.js";
import orderRouter from "./routes/orderRouter.js";
import galleryRouter from "./routes/galleryRouter.js";

dotenv.config();
const app = express();

/* ===================== CORS ===================== */
app.use(cors({
  origin: "https://kv-audio-frontend-eight.vercel.app",
  methods: ["GET", "POST", "PUT", "DELETE"],
  allowedHeaders: ["Content-Type", "Authorization"]
}));

/* ===================== BODY PARSER ===================== */
app.use(bodyParser.json());

/* ===================== JWT MIDDLEWARE (GLOBAL) ===================== */
app.use((req, res, next) => {
  const authHeader = req.headers.authorization;

  if (!authHeader) return next();

  const token = authHeader.split(" ")[1];

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded;
  } catch (err) {
    console.log("JWT error:", err.message);
  }

  next();
});

/* ===================== MONGODB ===================== */
mongoose.connect(process.env.MONGO_URL)
  .then(() => console.log("MongoDB connected"))
  .catch(err => {
    console.error("MongoDB connection failed", err);
    process.exit(1);
  });

/* ===================== ROUTES ===================== */
app.use("/api/users", userRouter);   // OTP routes live here
app.use("/api/products", productRouter);
app.use("/api/reviews", reviewRouter);
app.use("/api/inquiries", inquiryRouter);
app.use("/api/orders", orderRouter);
app.use("/api/gallerys", galleryRouter);

/* ===================== SERVER ===================== */
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

// Notes for testing
// Admin: test1@gmail.com / securepassword123
// Customer: test2@gmail.com / 123
