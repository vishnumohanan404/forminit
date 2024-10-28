import { body } from "express-validator";

// Validation rules for user registration
export const signupValidation = [
  body("fullName").notEmpty().withMessage("Name is required"),
  body("email").isEmail().withMessage("Invalid email"),
  body("password")
    .isLength({ min: 6 })
    .withMessage("Password must be at least 6 characters"),
  // TODO: uncheck in production
  // .matches(/\d/)
  // .withMessage("Password must contain at least one number")
  // .matches(/[A-Z]/)
  // .withMessage("Password must contain at least one uppercase letter")
  // .matches(/[a-z]/)
  // .withMessage("Password must contain at least one lowercase letter")
  // .matches(/[!@#$%^&*(),.?":{}|<>]/)
  // .withMessage("Password must contain at least one special character"),
];

export const loginValidation = [
  body("email").isEmail().withMessage("Invalid email format"),
  body("password").notEmpty().withMessage("Password is required"),
];
