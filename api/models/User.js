import mongoose from "mongoose";

const userSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    wantToRead: [{ title: String, author: String, coverId: Number }],
    currentlyReading: [{ title: String, author: String, coverId: Number }],
    finished: [{ title: String, author: String, coverId: Number }]
  },
  { timestamps: true }
);

export default mongoose.models.User || mongoose.model("User", userSchema);

