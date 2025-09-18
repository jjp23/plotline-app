import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import connectDB from "./config/db.js";
import authRoutes from "./routes/auth.js";

console.log("MONGO_URI is:", process.env.MONGO_URI);
dotenv.config();
const app = express();

console.log("🚀 NODE_ENV:", process.env.NODE_ENV);
console.log("🔑 MONGO_URI exists:", !!process.env.MONGO_URI);
console.log("🔑 JWT_SECRET exists:", !!process.env.JWT_SECRET);

app.use(cors());
app.use(express.json());

app.use("/api/auth", authRoutes);

app.get("/api/health", (req, res) => {
    res.json({ status: "ok", message: "Backend is running 🚀" });
  }); 

connectDB();

export default app;
