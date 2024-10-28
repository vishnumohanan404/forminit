import { Request, Response } from "express";
import { loginUser, registerNewUser } from "../services/authentication";
import { errorResponse, validate } from "../helpers";

export const signup = async (req: Request, res: Response): Promise<void> => {
  try {
    const { fullName, email, password } = req.body;
    validate(req, res);

    // Call the service to register the user
    const user = await registerNewUser({ fullName, email, password });

    res.status(201).json({
      message: "User registered successfully",
      data: user,
    });
  } catch (error) {
    errorResponse(error, res);
  }
};

export const login = async (req: Request, res: Response) => {
  // Check for validation errors
  validate(req, res);
  const { email, password } = req.body;
  try {
    const { token, user } = await loginUser({ email, password });

    // Set the token in an HTTP-only cookie
    res.cookie("jwt", token, {
      httpOnly: true, // Cookie can't be accessed via JavaScript
      secure: process.env.NODE_ENV === "production", // Secure flag for production (only HTTPS)
      sameSite: "strict", // Protects against CSRF attacks
      maxAge: 3600000, // 1 hour
    });

    // Return the JWT token and user information
    res.status(200).json({
      message: "Login successful",
      user: { email: user.email, fullName: user.fullName },
    });
  } catch (error: any) {
    errorResponse(error, res);
  }
};
