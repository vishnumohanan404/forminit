import crypto from "crypto";
import { Request, Response } from "express-serve-static-core";
import { validationResult } from "express-validator";
import { RequestValidationError } from "../errors/common";
import { ErrorBase } from "../errors/base";
import mongoose from "mongoose";

// authentication
export const random = () => crypto.randomBytes(128).toString("base64");
export const authentication = (salt: string, password: string) => {
  return crypto
    .createHmac("sha256", [salt, password].join("/"))
    .update(String(process.env.JWT_SECRET));
};

export const validate = (req: Request, res: Response) => {
  const result = validationResult(req);
  if (!result.isEmpty()) {
    throw new RequestValidationError(
      "REQUEST_VALIDATION_ERROR",
      result.array()
    );
  }
};

export const errorResponse = (error: unknown, res: Response) => {
  // Check if the error has a message
  console.error(error);
  if (error instanceof ErrorBase) {
    res.status(error.statusCode).json({ message: error.message });
    console.error("err", error.message);
  } else if (error instanceof mongoose.Error.ValidationError) {
    res.status(500).json({
      message: error.message || "Internal Server Error",
      errors: error.errors,
    });
  } else {
    // If no proper message, send a generic Internal Server Error
    res.status(500).json({
      message: error || "Internal Server Error",
    });
  }
};
