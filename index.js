import express from "express";
import bodyParser from "body-parser";
import mongoose from "mongoose";
import jwt from "jsonwebtoken";
import cors from "cors";
import dotenv from "dotenv";

import userRouter, { sendOTP, verifyOTP } from "./routes/userRouter.js"; // Make sure sendOTP/verifyOTP are exported
import productRouter from "./routes/productRouter.js";
import reviewRouter from "./routes/reviewRouter.js";
import inquiryRouter from "./routes/InquiryRouter.js";
import orderRouter from "./routes/orderRouter.js";
import galleryRouter from "./routes/galleryRouter.js";

dotenv.config();

const app = express();

/* ===================== CORS ===================== */
app.use(cors({
  origin: ["https://kv-audio-frontend-eight.vercel.app"],
  methods: ["GET", "POST", "PUT", "DELETE"],
  allowedHeaders: ["Content-Type", "Authorization"],
  credentials: true
}));

/* ===================== BODY PARSER ===================== */
app.use(bodyParser.json());

/* ===================== JWT MIDDLEWARE ===================== */
app.use((req, res, next) => {
  const authHeader = req.header("Authorization");
  if (!authHeader) return next(); // No token, just skip

  const token = authHeader.replace("Bearer ", "");

  try {
    const decoded = jwt.verify(token, "your_jwt_secret_here"); // hard-coded JWT secret
    req.user = decoded;
  } catch (err) {
    console.log("Invalid token:", err.message);
    // Optional: reject invalid tokens
    // return res.status(403).json({ error: "Invalid token" });
  }

  next();
});

/* ===================== MONGODB ===================== */
const mongoUrl = process.env.MONGO_URL || "mongodb://127.0.0.1:27017/your-db-name";
mongoose.connect(mongoUrl);

mongoose.connection.once("open", () => {
  console.log("MongoDB connected successfully");
});

/* ===================== ROUTES ===================== */
app.use("/api/users", userRouter);
app.use("/api/products", productRouter);
app.use("/api/reviews", reviewRouter);
app.use("/api/inquiries", inquiryRouter);
app.use("/api/orders", orderRouter);
app.use("/api/gallerys", galleryRouter);

/* ===================== OTP ROUTES (PROTECTED) ===================== */
app.get("/api/users/sendOTP", (req, res) => {
  if (!req.user) return res.status(403).json({ error: "Unauthorized" });
  sendOTP(req, res);
});

app.post("/api/users/verifyEmail", (req, res) => {
  if (!req.user) return res.status(403).json({ error: "Unauthorized" });
  verifyOTP(req, res);
});

/* ===================== SERVER ===================== */
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

// Hard-coded test users for reference
// test2@gmail.com 123 - customer
// test1@gmail.com securepassword123 - admin
