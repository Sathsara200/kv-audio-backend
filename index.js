import express from "express";
import bodyParser from "body-parser";
import mongoose from "mongoose";
import userRouter from "./routes/userRouter.js";
import productRouter from "./routes/productRouter.js";
import reviewRouter from "./routes/reviewRouter.js";
import inquiryRouter from "./routes/InquiryRouter.js";
import orderRouter from "./routes/orderRouter.js";
import galleryRouter from "./routes/galleryRouter.js";
import jwt from "jsonwebtoken";
import cors from "cors";

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
    const decoded = jwt.verify(token, "your_jwt_secret_here"); // Replace with your JWT secret
    req.user = decoded;
  } catch (err) {
    console.log("Invalid token:", err.message);
  }

  next();
});

/* ===================== MONGODB ===================== */
const mongoUrl = "mongodb+srv://username:password@cluster.mongodb.net/dbname?retryWrites=true&w=majority"; // Replace with your MongoDB URL
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

/* ===================== SERVER ===================== */
const PORT = 3000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

// Test users:
// test2@gmail.com / 123 - customer
// test1@gmail.com / securepassword123 - admin
