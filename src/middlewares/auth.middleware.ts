import { Request, Response, NextFunction } from "express";
import * as jwt from "jsonwebtoken";
import { ApiError } from "../utils/ApiError";

export const auth = (
  req: Request,
  _res: Response,
  next: NextFunction
) => {
  const token = req.headers.authorization?.split(" ")[1];
  if (!token) {
    throw new ApiError(401, "Unauthorized");
  }

  const decoded = jwt.verify(token, process.env.JWT_SECRET!) as {
    id: string;
    role: string;
  };

  req.user = decoded;
  next();
};