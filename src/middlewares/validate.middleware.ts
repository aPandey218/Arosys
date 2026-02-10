import { validationResult } from "express-validator";

export const validate = (req: any, res: any, next: any) => {
  const e = validationResult(req);
  if (!e.isEmpty()) return res.status(422).json(e.array());
  next();
};