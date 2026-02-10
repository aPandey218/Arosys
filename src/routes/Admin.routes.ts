
import { Router } from "express";
import { AdminController } from "../controllers/Admin.controller";
import { auth } from "../middlewares/auth.middleware";
import { allowRoles } from "../middlewares/role.middleware";

const router = Router();
const adminController = new AdminController();


router.post("/setup", (req, res, next) => adminController.createAdmin(req, res, next));
router.post("/login", (req, res, next) => adminController.login(req, res, next));

router.use(auth);
router.use(allowRoles("admin"));

router.get("/users", (req, res, next) => adminController.getAllUsers(req, res, next));
router.post("/users", (req, res, next) => adminController.createUser(req, res, next));
router.put("/users/:id", (req, res, next) => adminController.updateUser(req, res, next));
router.delete("/users/:id", (req, res, next) => adminController.deleteUser(req, res, next));

export default router;
