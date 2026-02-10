// src/middlewares/error.middleware.ts
import { Request, Response, NextFunction } from "express";
import { ApiError } from "../utils/ApiError";

export const errorHandler = (
  err: any,
  _req: Request,
  res: Response,
  _next: NextFunction
) => {

  if (err instanceof ApiError) {
    return res.status(err.status).json({
      success: false,
      message: err.message
    });
  }


  if (err.code === 11000) {
    return res.status(409).json({
      success: false,
      message: "Duplicate value error"
    });
  }


  console.error("🔥 Unhandled Error:", err);

  return res.status(500).json({
    success: false,
    message: "Internal Server Error"
  });
};