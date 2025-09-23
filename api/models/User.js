import mongoose from "mongoose";

const bookSchema = new mongoose.Schema({
  title: String,
  author: String,
  coverId: Number,
  review: String,        
  rating: {              
    type: Number,
    min: 1,
    max: 5
  }
});

const userSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    wantToRead: [{ title: String, author: String, coverId: Number }],
    currentlyReading: [{ title: String, author: String, coverId: Number }],
    finished: [{ title: String, author: String, coverId: Number }],
    friends: [{type: mongoose.Schema.Types.ObjectId, ref:"User"}]
  },
  { timestamps: true }
);

export default mongoose.models.User || mongoose.model("User", userSchema);

