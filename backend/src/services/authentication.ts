import bcrypt from "bcrypt";
import User from "../models/user"; // Mongoose model for User
import { ConflictError, UnauthorizedError } from "../errors/user";
import jwt from "jsonwebtoken";
import { NotFoundError } from "../errors/common";
import Dashboard from "../models/dashboard";
import mongoose from "mongoose";
import { OAuth2Client } from "google-auth-library";

interface UserInput {
  fullName: string;
  email: string;
  password: string;
}

const tokenExpiry = { expiresIn: "1h" };

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
  const token = jwt.sign(
    { _id: user._id, email: user.email }, // Payload
    JWT_SECRET,
    tokenExpiry // Token expiration
  );
  return { user, token };
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
  if (!user.password) {
    throw new UnauthorizedError("USER_NOT_AUTHORIZED"); // If password is not set (Google login)
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
    tokenExpiry // Token expiration
  );

  return { token, user };
};
const oAuth2Client = new OAuth2Client(
  process.env.GOOGLE_CLIENT_ID,
  process.env.GOOGLE_CLIENT_SECRET,
  "postmessage"
);
export const registerGoogleUser = async (code: string) => {
  const { tokens } = await oAuth2Client.getToken(code); // exchange code for tokens

  if (!tokens.id_token) {
    throw new UnauthorizedError("USER_NOT_AUTHORIZED");
  }
  const googleUser = await oAuth2Client.verifyIdToken({
    idToken: tokens.id_token,
    audience: process.env.GOOGLE_CLIENT_ID,
  });
  const { email, name, sub } = googleUser.getPayload() || {};
  if (!email) {
    throw new UnauthorizedError("USER_NOT_AUTHORIZED");
  }
  // Check if the user already exists (e.g., by email)
  const existingUser = await User.findOne({ email });
  if (existingUser) {
    const token = jwt.sign(
      { _id: existingUser._id, email: existingUser.email }, // Payload
      JWT_SECRET,
      tokenExpiry // Token expiration
    );
    return { user: existingUser, token };
  } else {
    const newUser = new User({
      fullName: name,
      email,
      password: null,
      googleId: sub,
    });
    const user = await newUser.save();
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
    const token = jwt.sign(
      { _id: user._id, email: user.email }, // Payload
      JWT_SECRET,
      tokenExpiry // Token expiration
    );
    return { user, token };
  }
};
