import asyncHandler from "express-async-handler";
import jwt from "jsonwebtoken";
import { OAuth2Client } from "google-auth-library";
import User from "../models/User.js";

/* -------------------- HELPERS -------------------- */

const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: "15m",
  });
};

const setTokenCookie = (res, token) => {
  res.cookie("accessToken", token, {
    httpOnly: true,
    secure: true,
    sameSite: "lax",
    maxAge: 15 * 60 * 1000, // 15 minutes
  });
};

const googleClient = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);

/* -------------------- CONTROLLERS -------------------- */

// @desc    Register user (email/password)
// @route   POST /api/auth/register
export const registerUser = asyncHandler(async (req, res) => {
  const { name, email, password } = req.body;

  const userExists = await User.findOne({ email });
  if (userExists) {
    res.status(409); // Conflict
    throw new Error("User already exists");
  }

  const user = await User.create({
    name,
    email,
    password,
    authProvider: "local",
  });

  const token = generateToken(user._id);
  setTokenCookie(res, token);

  res.status(201).json({
    _id: user._id,
    name: user.name,
    email: user.email,
  });
});

// @desc    Login user (email/password)
// @route   POST /api/auth/login
export const loginUser = asyncHandler(async (req, res) => {
  const { email, password } = req.body;

  const user = await User.findOne({ email });
  if (!user) {
    res.status(401);
    throw new Error("Invalid email or password");
  }

  if (user.authProvider !== "local") {
    res.status(400);
    throw new Error("Use Google login for this account");
  }

  const isMatch = await user.matchPassword(password);
  if (!isMatch) {
    res.status(401);
    throw new Error("Invalid email or password");
  }

  const token = generateToken(user._id);
  setTokenCookie(res, token);

  res.json({
    _id: user._id,
    name: user.name,
    email: user.email,
  });
});

// @desc    Google login
// @route   POST /api/auth/google
export const googleLogin = asyncHandler(async (req, res) => {
  try {
    const { credential } = req.body;

    if (!credential)
      res.status(400).json({ message: "Missing credential for google aith" });

    const ticket = await googleClient.verifyIdToken({
      idToken: credential,
      audience: process.env.GOOGLE_CLIENT_ID,
    });

    const payload = ticket.getPayload();
    const { email, name, picture } = payload;

    let user = await User.findOne({ email });

    if (!user) {
      user = await User.create({
        name,
        email,
        avatar: picture,
        authProvider: "google",
      });
    } else if (user.authProvider === "local") {
      user.authProvider = "google";
      user.avatar = picture;
      await user.save();
    }

    const token = generateToken(user._id);
    setTokenCookie(res, token);

    res.json({
      _id: user._id,
      name: user.name,
      email: user.email,
    });
  } catch (error) {
    console.log(error.message);
    res.status(500).json({ message: "Invalid Google Token" });
  }
});

// @desc    Get current user
// @route   GET /api/auth/me
export const getMe = asyncHandler(async (req, res) => {
  res.json(req.user);
});

// @desc    Logout user
// @route   POST /api/auth/logout
export const logoutUser = asyncHandler(async (req, res) => {
  res.cookie("accessToken", "", {
    httpOnly: true,
    expires: new Date(0),
  });

  res.json({ message: "Logged out successfully" });
});
