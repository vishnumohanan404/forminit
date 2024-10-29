import mongoose from "mongoose";

const userSchema = new mongoose.Schema(
  {
    fullName: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
    },
    password: {
      type: String,
      required: false,
      select: false,
    },
    googleId: { type: String, unique: true },
  },
  { timestamps: true }
);

const User = mongoose.model("User", userSchema);

export default User;
