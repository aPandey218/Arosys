import { Request, Response, NextFunction } from "express";
import { UserService } from "../services/User.service";
import { accessToken, refreshToken } from "../utils/jwt.util";

export class UserController {

  private s = new UserService();

  signup = async (req: Request, res: Response, n: NextFunction) => {
    try {
      const user = await this.s.signup(req.body);
      res.status(201).json(user);
    } catch (e) {
      n(e);
    }
  };

  login = async (req: Request, res: Response, n: NextFunction) => {
    try {
      const user = await this.s.login(req.body.email, req.body.password);

      const at = accessToken({ id: user._id, role: user.role });
      const rt = refreshToken({ id: user._id });

      user.refreshToken = rt;
      await user.save();

      res.json({ accessToken: at, refreshToken: rt });
    } catch (e) {
      n(e);
    }
  };

  me = async (req: Request, res: Response) => {
    res.json(await this.s.me(req.user!.id));
  };

  updateMe = async (req: Request, res: Response) => {
    res.json(await this.s.updateSelf(req.user!.id, req.body));
  };

  deleteMe = async (req: Request, res: Response) => {
    await this.s.deleteSelf(req.user!.id);
    res.json({ message: "Deleted" });
  };
  // ADMIN
  all = async (req: Request, res: Response, n: NextFunction) => {
    try {
      const page = Number(req.query.page) || 1;
      const limit = Number(req.query.limit) || 10;
      res.json(await this.s.all(page, limit));
    } catch (e) {
      n(e);
    }
  };

  adminUpdate = async (
    req: Request<{ id: string }>,
    res: Response,
    n: NextFunction
  ) => {
    try {
      const { id } = req.params;
      const data = req.body;

      const updatedUser = await this.s.adminUpdate(id, data);
      res.json(updatedUser);
    } catch (e) {
      n(e);
    }
  };

  adminDelete = async (
    req: Request<{ id: string }>,
    res: Response,
    n: NextFunction
  ) => {
    try {
      const { id } = req.params;
      await this.s.adminDelete(id);
      res.json({ message: "Deleted" });
    } catch (e) {
      n(e);
    }
  };
}