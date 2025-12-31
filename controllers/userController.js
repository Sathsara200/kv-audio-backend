import User from "../models/user.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import dotenv from "dotenv";
import axios from "axios";
import nodemailer from "nodemailer";
import OTP from "../models/otp.js";

dotenv.config();

// --------------------- Nodemailer transporter (hardcoded credentials) ---------------------
const transport = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: "tharidusathsara200@gmail.com", // Hardcoded Gmail
    pass: "wlnjwadaicuhmqas"             // Hardcoded 16-character App Password
  }
});

// Verify transporter on server start
transport.verify((error, success) => {
  if (error) {
    console.log("Email transporter error:", error);
  } else {
    console.log("Email transporter is ready");
  }
});

// --------------------- User registration ---------------------
export function registerUser(req, res) {
  const data = req.body;
  data.password = bcrypt.hashSync(data.password, 10);

  const newUser = new User(data);
  newUser.save()
    .then(() => res.json({ message: "User registered successfully"}))
    .catch(() => res.status(500).json({ error: "User registration failed" }));
}

// --------------------- User login ---------------------
export function loginUser(req, res) {
  const { email, password } = req.body;

  User.findOne({ email }).then(user => {
    if (!user) return res.status(404).json({ error: "User not found" });
    if (user.isBlocked) return res.status(403).json({ error: "Your account is blocked, contact admin" });

    const isPasswordCorrect = bcrypt.compareSync(password, user.password);
    if (!isPasswordCorrect) return res.status(401).json({ error: "Login failed" });

    const token = jwt.sign({
      firstName: user.firstName,
      lastName: user.lastName,
      email: user.email,
      role: user.role,
      profilePicture: user.profilePicture,
      phone: user.phone,
      emailVerified: user.emailVerified
    }, process.env.JWT_SECRET); // Hardcoded JWT secret

    res.json({ message: "Login successful", token, user });
  });
}

// --------------------- Role checks ---------------------
export function isItAdmin(req) {
  return req.user?.role === "admin";
}

export function isItCustomer(req) {
  return req.user?.role === "customer";
}

// --------------------- Get all users (admin only) ---------------------
export async function getAllUsers(req, res) {
  if (!isItAdmin(req)) return res.status(403).json({ error: "Unauthorized" });

  try {
    const users = await User.find();
    res.json(users);
  } catch (e) {
    res.status(500).json({ error: "Failed to get users" });
  }
}

// --------------------- Block/Unblock user ---------------------
export async function blockOrUnblockUser(req, res) {
  if (!isItAdmin(req)) return res.status(403).json({ error: "Unauthorized" });

  const email = req.params.email;
  try {
    const user = await User.findOne({ email });
    if (!user) return res.status(404).json({ error: "User not found" });

    user.isBlocked = !user.isBlocked;
    await user.save();

    res.json({ message: "User blocked/unblocked successfully" });
  } catch (e) {
    res.status(500).json({ error: "Failed to update user" });
  }
}

// --------------------- Get current user ---------------------
export function getUser(req, res) {
  if (!req.user) return res.status(403).json({ error: "Unauthorized" });
  res.json(req.user);
}

// --------------------- Google login ---------------------
export async function loginWithGoogle(req, res) {
  const accessToken = req.body.accessToken;
  try {
    const response = await axios.get("https://www.googleapis.com/oauth2/v3/userinfo", {
      headers: { Authorization: `Bearer ${accessToken}` }
    });

    let user = await User.findOne({ email: response.data.email });

    if (!user) {
      user = new User({
        email: response.data.email,
        password: "123",
        firstName: response.data.given_name,
        lastName: response.data.family_name,
        address: "Not Given",
        phone: "Not Given",
        profilePicture: response.data.picture,
        emailVerified: true,
      });
      await user.save();
    }

    const token = jwt.sign({
      firstName: user.firstName,
      lastName: user.lastName,
      email: user.email,
      role: user.role,
      profilePicture: user.profilePicture,
      phone: user.phone,
      emailVerified: user.emailVerified
    }, "your_jwt_secret");

    res.json({ message: "Login successful", token, user });

  } catch (e) {
    console.log(e);
    res.status(500).json({ error: "Failed to login with Google" });
  }
}

// --------------------- Send OTP ---------------------
export async function sendOTP(req, res) {
  if (!req.user) return res.status(403).json({ error: "Unauthorized" });

  try {
    const otp = Math.floor(Math.random() * 9000) + 1000;

    const newOTP = new OTP({
      email: req.user.email,
      otp
    });
    await newOTP.save();

    const message = {
      from: "tharidusathsara200@gmail.com",
      to: req.user.email,
      subject: "Your OTP Code",
      text: `Your OTP code is ${otp}`
    };

    await transport.sendMail(message);
    res.json({ message: "OTP sent successfully" });
  } catch (err) {
    console.error("Send OTP error:", err);
    res.status(500).json({ error: "Failed to send OTP" });
  }
}

// --------------------- Verify OTP ---------------------
export async function verifyOTP(req, res) {
  if (!req.user) return res.status(403).json({ error: "Unauthorized" });

  const code = req.body.code;

  try {
    const otp = await OTP.findOne({ email: req.user.email, otp: code });
    if (!otp) return res.status(404).json({ error: "Invalid OTP" });

    await OTP.deleteOne({ email: req.user.email, otp: code });
    await User.updateOne({ email: req.user.email }, { emailVerified: true });

    res.status(200).json({ message: "Email verified successfully" });
  } catch (err) {
    console.error("Verify OTP error:", err);
    res.status(500).json({ error: "Failed to verify OTP" });
  }
}


//wlnj wada icuh mqas