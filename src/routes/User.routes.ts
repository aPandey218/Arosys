import { Router, Request, Response, NextFunction } from "express";
import { UserController } from "../controllers/User.controller";
import { auth } from "../middlewares/auth.middleware";
import { allowRoles } from "../middlewares/role.middleware";
import { signupV, loginV } from "../validators/user.validator";
import { validate } from "../middlewares/validate.middleware";

const r = Router();
const c = new UserController();


r.post(
  "/signup",
  signupV,
  validate,
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      await c.signup(req, res, next);
    } catch (e) {
      next(e);
    }
  }
);

r.post(
  "/login",
  loginV,
  validate,
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      await c.login(req, res, next);
    } catch (e) {
      next(e);
    }
  }
);

r.get(
  "/me",
  auth,
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      await c.me(req, res);
    } catch (e) {
      next(e);
    }
  }
);

r.put(
  "/me",
  auth,
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      await c.updateMe(req, res);
    } catch (e) {
      next(e);
    }
  }
);

r.delete(
  "/me",
  auth,
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      await c.deleteMe(req, res);
    } catch (e) {
      next(e);
    }
  }
);


r.get(
  "/",
  auth,
  allowRoles("admin"),
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      await c.all(req, res, next);
    } catch (e) {
      next(e);
    }
  }
);

r.put(
  "/:id",
  auth,
  allowRoles("admin"),
  async (req: Request<{ id: string }>, res: Response, next: NextFunction) => {
    try {
      await c.adminUpdate(req, res, next);
    } catch (e) {
      next(e);
    }
  }
);

r.delete(
  "/:id",
  auth,
  allowRoles("admin"),
  async (req: Request<{ id: string }>, res: Response, next: NextFunction) => {
    try {
      await c.adminDelete(req, res, next);
    } catch (e) {
      next(e);
    }
  }
);

export default r;