import { Request, Response, NextFunction } from "express-serve-static-core";
import jwt from "jsonwebtoken";
import User from "../models/user";

interface DecodedToken {
  _id: string;
}
const JWT_SECRET = process.env.JWT_SECRET || "your_jwt_secret_key";

declare module "express-serve-static-core" {
  export interface Request {
    user: any;
  }
}

export const verifyToken = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  const token = req.cookies.jwt; // Get the token from the HTTP-only cookie

  if (!token) {
    res.status(401).json({ message: "Unauthorized" });
    return;
  }

  try {
    // Verify the token
    const decoded = jwt.verify(token, JWT_SECRET) as DecodedToken;
    const user = await User.findOne({
      _id: decoded._id,
    });

    if (!user) {
      throw new Error("Authentication failed. User not found.");
    }
    req.user = decoded; //
    next(); // Call next middleware
  } catch (error) {
    console.error("Token error", error);
    res.clearCookie("jwt", {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production", // Set secure flag in production
      sameSite: "strict", // Adjust based on your needs
    });
    res.status(401).json({ message: "Invalid token" });
  }
};
