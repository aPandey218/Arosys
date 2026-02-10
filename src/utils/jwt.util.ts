import * as jwt from "jsonwebtoken";

export const accessToken = (p: any) =>
  jwt.sign(p, process.env.JWT_SECRET!, { expiresIn: "15m" });

export const refreshToken = (p: any) =>
  jwt.sign(p, process.env.JWT_REFRESH_SECRET!, { expiresIn: "7d" });