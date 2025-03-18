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

dotenv.config();

const app = express()
app.use(cors());

app.use(bodyParser.json())

app.use((req,res,next)=>{
    let token = req.header
    ("Authorization")
