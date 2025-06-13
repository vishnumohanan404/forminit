import mongoose, { InferSchemaType } from "mongoose";

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
    bio: {
      type: String,
      required: false,
    },
    password: {
      type: String,
      required: false,
      select: false,
    },
    avatar: {
      type: String,
      required: false,
    },
    googleId: { type: String, unique: true, sparse: true },
  },
  { timestamps: true }
);
export type UserInterface = InferSchemaType<typeof userSchema>;
const User = mongoose.model("User", userSchema);

export default User;
