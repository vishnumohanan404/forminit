import { Request, Response } from "express";
import { loginUser, registerGoogleUser, registerNewUser } from "../services/authentication";
import { errorResponse, validate } from "../helpers";

export const signup = async (req: Request, res: Response): Promise<void> => {
  try {
    const { fullName, email, password } = req.body;
    validate(req);

    // Call the service to register the user
    const { user, token } = await registerNewUser({
      fullName,
      email,
      password,
    });
    res.cookie("jwt", token, {
      httpOnly: true,
      secure: ["production", "staging"].includes(process.env.NODE_ENV || ""),
      sameSite: ["production", "staging"].includes(process.env.NODE_ENV || "") ? "none" : "strict",
      maxAge: 3600000, //ms = 1 hour
    });
    res.status(201).json({
      message: "User registered successfully",
      user,
    });
  } catch (error) {
    errorResponse(error, res);
  }
};

export const login = async (req: Request, res: Response) => {
  // Check for validation errors
  validate(req);
  const { email, password } = req.body;
  try {
    const { token, user } = await loginUser({ email, password });

    // Set the token in an HTTP-only cookie
    res.cookie("jwt", token, {
      httpOnly: true,
      secure: ["production", "staging"].includes(process.env.NODE_ENV || ""),
      sameSite: ["production", "staging"].includes(process.env.NODE_ENV || "") ? "none" : "strict",
      maxAge: 3600000, //ms = 1 hour
    });
    // Return the JWT token and user information
    res.status(200).json({
      message: "Login successful",
      user,
    });
  } catch (error: unknown) {
    errorResponse(error, res);
  }
};

export const google = async (req: Request, res: Response): Promise<void> => {
  try {
    // If user doesn't exist, register them
    const { user, token } = await registerGoogleUser(
      req.body.code, // Store Google user ID for future logins
    );
    res.cookie("jwt", token, {
      httpOnly: true,
      secure: ["production", "staging"].includes(process.env.NODE_ENV || ""),
      sameSite: ["production", "staging"].includes(process.env.NODE_ENV || "") ? "none" : "strict",
      maxAge: 3600000, //ms = 1 hour
    });
    res.status(200).json({
      message: "Login successful",
      user,
    });
  } catch (error) {
    errorResponse(error, res);
  }
};
