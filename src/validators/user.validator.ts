import { body } from "express-validator";

export const signupV = [
  body("name").notEmpty(),
  body("email").isEmail(),
  body("password").isLength({ min: 6 })
];

export const loginV = [
  body("email").isEmail(),
  body("password").notEmpty()
];