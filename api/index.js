import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import connectDB from "./config/db.js";
import authRoutes from "./routes/auth.js";

dotenv.config();
const app = express();

// --- Debug environment logs (will always flush) ---
process.stdout.write("🚀 Starting server...\n");
process.stdout.write("NODE_ENV: " + process.env.NODE_ENV + "\n");
process.stdout.write("MONGO_URI exists: " + !!process.env.MONGO_URI + "\n");
process.stdout.write("JWT_SECRET exists: " + !!process.env.JWT_SECRET + "\n");

app.use(cors());
app.use(express.json());

// --- Lazy DB initializer ---
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

// Middleware that ensures DB before requests
app.use(async (req, res, next) => {
  await ensureDB();
  next();
});

// Routes
app.use("/api/auth", authRoutes);

// Health check
app.get("/api/health", (req, res) => {
  res.json({ status: "ok", message: "Backend is running 🚀" });
});

export default app;

