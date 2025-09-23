import express from "express";
import User from "../models/User.js";
import jwt from "jsonwebtoken";

const router = express.Router();

function authMiddleware(req, res, next) {
  const token = req.headers.authorization?.split(" ")[1];
  if (!token) return res.status(401).json({ message: "No token provided" });

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.userId = decoded.id;
    next();
  } catch {
    return res.status(401).json({ message: "Invalid token" });
  }
}

// 🔎 Search users by name or email
router.get("/search", authMiddleware, async (req, res) => {
  try {
    const query = req.query.query;
    if (!query) return res.json([]);

    const users = await User.find({
      $or: [
        { name: new RegExp(query, "i") },
        { email: new RegExp(query, "i") }
      ]
    })
      .select("-password")
      .limit(10);

    res.json(users);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

export default router;
