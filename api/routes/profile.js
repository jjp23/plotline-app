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

router.get("/", authMiddleware, async (req, res) => {
  try {
    const user = await User.findById(req.userId).select("-password").populate("friends", "name email");
    res.json(user);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

router.post("/", authMiddleware, async (req, res) => {
  try {
    const { wantToRead, currentlyReading, finished } = req.body;
    const user = await User.findByIdAndUpdate(
      req.userId,
      { wantToRead, currentlyReading, finished },
      { new: true }
    )
      .select("-password")
      .populate("friends", "name email");
    res.json(user);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

router.post("/:id/add-friend", authMiddleware, async (req, res) => {
  try {
    const user = await User.findById(req.userId);
    const friend = await User.findById(req.params.id);

    if (!friend) return res.status(404).json({ message: "User not found" });

    if (!user.friends.includes(friend._id)) {
      user.friends.push(friend._id);
      await user.save();
    }

    const populatedUser = await User.findById(req.userId)
      .select("-password")
      .populate("friends", "name email");

    res.json({ message: "Friend added", friends: populatedUser.friends });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

router.get("/:id/profile", authMiddleware, async (req, res) => {
  try {
    const user = await User.findById(req.params.id)
      .select("-password")
      .populate("friends", "name email");

    if (!user) return res.status(404).json({ message: "User not found" });

    res.json(user);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

export default router;
