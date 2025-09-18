import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import connectDB from "./config/db.js";
import authRoutes from "./routes/auth.js";
import profileRoutes from "./routes/profile.js";

dotenv.config();
const app = express();

process.stdout.write("🚀 Starting server...\n");
process.stdout.write("NODE_ENV: " + process.env.NODE_ENV + "\n");
process.stdout.write("MONGO_URI exists: " + !!process.env.MONGO_URI + "\n");
process.stdout.write("JWT_SECRET exists: " + !!process.env.JWT_SECRET + "\n");

app.use(cors());
app.use(express.json());

let dbConnected = false;
async function ensureDB() {
  if (!dbConnected) {
    try {
      await connectDB();
      dbConnected = true;
      process.stdout.write("✅ MongoDB connected\n");
    } catch (err) {
      process.stdout.write("❌ MongoDB connection failed: " + err.message + "\n");
    }
  }
}

app.use(async (req, res, next) => {
  await ensureDB();
  next();
});

app.use("/api/auth", authRoutes);
app.use("/api/profile", profileRoutes);

app.get("/api/health", (req, res) => {
  res.json({ status: "ok", message: "Backend is running 🚀" });
});

export default app;

