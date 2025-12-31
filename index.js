import express from "express";
import bodyParser from "body-parser";
import mongoose from "mongoose";
import jwt from "jsonwebtoken";
import cors from "cors";
import userRouter, { sendOTP, verifyOTP } from "./routes/userRouter.js";
import productRouter from "./routes/productRouter.js";
import reviewRouter from "./routes/reviewRouter.js";
import inquiryRouter from "./routes/InquiryRouter.js";
import orderRouter from "./routes/orderRouter.js";
import galleryRouter from "./routes/galleryRouter.js";

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
  if (!authHeader) return next(); // No token, skip

  const token = authHeader.replace("Bearer ", "");
  try {
    const decoded = jwt.verify(token, "my_hardcoded_jwt_secret"); // hard-coded JWT secret
    req.user = decoded;
  } catch (err) {
    console.log("Invalid token:", err.message);
  }
  next();
});

/* ===================== MONGODB ===================== */
const mongoUrl = "mongodb+srv://username:password@cluster0.mongodb.net/dbname"; // replace with your MongoDB URI
mongoose.connect(mongoUrl)
  .then(() => console.log("MongoDB connected successfully"))
  .catch((err) => {
    console.error("MongoDB connection error:", err);
    process.exit(1);
  });

/* ===================== ROUTES ===================== */
app.use("/api/users", userRouter);
app.use("/api/products", productRouter);
app.use("/api/reviews", reviewRouter);
app.use("/api/inquiries", inquiryRouter);
app.use("/api/orders", orderRouter);
app.use("/api/gallerys", galleryRouter);

// Protect OTP routes
app.get("/api/users/sendOTP", (req, res, next) => {
  if (!req.user) return res.status(403).json({ error: "Unauthorized" });
  next();
}, sendOTP);

app.post("/api/users/verifyEmail", (req, res, next) => {
  if (!req.user) return res.status(403).json({ error: "Unauthorized" });
  next();
}, verifyOTP);

/* ===================== SERVER ===================== */
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

// Notes for testing
// Admin: test1@gmail.com / securepassword123
// Customer: test2@gmail.com / 123
