import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import cookieParser from "cookie-parser";
import connectDB from "./config/db.js";

// route imports
import authRoutes from "./routes/authRoutes.js";

// Load environment variables
dotenv.config();

const app = express();

// Connrect database
connectDB();

/* -------------------- MIDDLEWARE -------------------- */

// Parse JSON body
app.use(express.json());

// Parse cookies
app.use(cookieParser());

// CORS (Next.js frontend)
app.use(
  cors({
    origin: process.env.CLIENT_URL || "https://localhost:3000",
    credentials: true,
  })
);

/* -------------------- ROUTES -------------------- */
app.use("/api/auth", authRoutes);

// Health check
app.get("/", (req, res) => {
  res.status(200).json({
    status: "OK",
    message: "API is running 🚀",
  });
});

/* -------------------- ERROR HANDLING -------------------- */

// 404 handler
app.use((req, res) => {
  res.status(404).json({
    message: "Route not found",
  });
});

/* -------------------- SERVER -------------------- */

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`✅ Server running on port ${PORT}`);
});
