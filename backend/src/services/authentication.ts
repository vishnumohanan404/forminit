import bcrypt from "bcrypt";
import User from "../models/user"; // Mongoose model for User
import { ConflictError, UnauthorizedError } from "../errors/user";
import jwt from "jsonwebtoken";
import { NotFoundError } from "../errors/common";
import Dashboard from "../models/dashboard";
import mongoose from "mongoose";

interface UserInput {
  fullName: string;
  email: string;
  password: string;
}

// Service function for registering a new user
export const registerNewUser = async ({
  fullName,
  email,
  password,
}: UserInput) => {
  // Check if the user already exists (e.g., by email)
  const existingUser = await User.findOne({ email });
  if (existingUser) {
    throw new ConflictError("USER_ALREADY_EXISTS");
  }
  // Hash the password
  const hashedPassword = await bcrypt.hash(password, 10);
  // Create and save a new user
  const newUser = new User({
    fullName,
    email,
    password: hashedPassword,
  });
  const user = await newUser.save();
  // Create new dashboard
  const newDashboard = new Dashboard({
    user_id: user._id,
    workspaces: [
      {
        name: "My Workspace",
        id: new mongoose.Types.ObjectId(),
        forms: [],
      },
    ],
  });
  const savedDashboard = await newDashboard.save();
  console.log("User workspaces created:", savedDashboard);
  return user;
};

interface LoginInput {
  email: string;
  password: string;
}

// Secret for signing JWT (can be stored in an environment variable)
const JWT_SECRET = process.env.JWT_SECRET || "your_jwt_secret_key";

export const loginUser = async ({ email, password }: LoginInput) => {
  // Check if the user exists by email
  const user = await User.findOne({ email }).select("+password");
  if (!user) {
    throw new NotFoundError("NOT_FOUND_ERROR");
  }

  // Compare the provided password with the stored hashed password
  const isPasswordValid = await bcrypt.compare(password, user.password);
  if (!isPasswordValid) {
    throw new UnauthorizedError("USER_NOT_AUTHORIZED");
  }

  // Generate a JWT token if authentication is successful
  const token = jwt.sign(
    { _id: user._id, email: user.email }, // Payload
    JWT_SECRET,
    { expiresIn: "1h" } // Token expiration
  );

  return { token, user };
};
