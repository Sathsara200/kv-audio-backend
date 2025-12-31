import express from "express";
import bodyParser from "body-parser";
import mongoose from "mongoose";
import userRouter from "./routes/userRouter.js";
import productRouter from "./routes/productRouter.js";
import jwt from "jsonwebtoken";
import dotenv from "dotenv";
import reviewRouter from "./routes/reviewRouter.js";
import inquiryRouter from "./routes/InquiryRouter.js";
import cors from "cors";
import orderRouter from "./routes/orderRouter.js";
import galleryRouter from "./routes/galleryRouter.js";

dotenv.config();

const app = express();

/* ===================== CORS (FIXED) ===================== */
app.use(cors({
  origin: [
    "https://kv-audio-frontend-eight.vercel.app"
  ],
  methods: ["GET", "POST", "PUT", "DELETE"],
  allowedHeaders: ["Content-Type", "Authorization"],
  credentials: true
}));

/* ===================== BODY PARSER ===================== */
app.use(bodyParser.json());

/* ===================== JWT MIDDLEWARE ===================== */
app.use((req, res, next) => {
  let token = req.header("Authorization");

  if (token) {
    token = token.replace("Bearer ", "");

    jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
      if (!err) {
        req.user = decoded;
      }
    });
  }

  next();
});

/* ===================== MONGODB ===================== */
const mongoUrl = process.env.MONGO_URL;

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
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});


//test2@gmail.com 123 - customer
//test1@gmail.com securepassword123 - admin

