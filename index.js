import express from "express";
import bodyParser from "body-parser";
import mongoose from "mongoose";
import userRouter from "./routes/userRouter.js";

const app = express()

app.use(bodyParser.json())

let mongoUrl = "mongodb+srv://sathsara200:123@cluster0.vnoxb.mongodb.net/student?retryWrites=true&w=majority&appName=Cluster0"

mongoose.connect(mongoUrl)

let connection = mongoose.connection

connection.once("open",()=>{
    console.log("MongoDB connection estabilished successfully")
})


app.use("/api/users",userRouter)

app.listen(3000,()=>{
    console.log("Server is running on port 3000");
});