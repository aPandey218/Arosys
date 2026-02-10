
import { Request, Response, NextFunction } from "express";
import { AdminService } from "../services/Admin.service";
import { accessToken, refreshToken } from "../utils/jwt.util";

export class AdminController {

    private adminService = new AdminService();

    // Admin Login
    login = async (req: Request, res: Response, next: NextFunction) => {
        try {
            const { email, password } = req.body;
            const admin = await this.adminService.adminLogin(email, password);

            // Generate tokens (role: admin)
            const at = accessToken({ id: admin._id, role: admin.role });
            const rt = refreshToken({ id: admin._id });

            admin.refreshToken = rt;
            await admin.save();

            res.status(200).json({
                success: true,
                message: "Admin Login Successful",
                accessToken: at,
                refreshToken: rt,
                user: {
                    id: admin._id,
                    name: admin.name,
                    email: admin.email,
                    role: admin.role,
                },
            });
        } catch (error) {
            next(error);
        }
    };

    // Get All Users
    getAllUsers = async (req: Request, res: Response, next: NextFunction) => {
        try {
            const page = Number(req.query.page) || 1;
            const limit = Number(req.query.limit) || 10;
            const data = await this.adminService.getAllUsers(page, limit);
            res.status(200).json({ success: true, data });
        } catch (error) {
            next(error);
        }
    };

    // Create New User (Admin Action) - reusing UserService signup logic if needed, or specific admin create
    createUser = async (req: Request, res: Response, next: NextFunction) => {
        try {
            const user = await this.adminService.signup(req.body); // Creating a user
            res.status(201).json({ success: true, data: user });
        } catch (error) {
            next(error);
        }
    };

    // Update User
    updateUser = async (req: Request, res: Response, next: NextFunction) => {
        try {
            const { id } = req.params;
            const updatedUser = await this.adminService.updateUser(id as string, req.body);
            res.status(200).json({ success: true, data: updatedUser });
        } catch (error) {
            next(error);
        }
    };

    // Delete User
    deleteUser = async (req: Request, res: Response, next: NextFunction) => {
        try {
            const { id } = req.params;
            const result = await this.adminService.deleteUser(id as string);
            res.status(200).json({ success: true, ...result });
        } catch (error) {
            next(error);
        }
    };
    // Create Admin (Public/Setup)
    createAdmin = async (req: Request, res: Response, next: NextFunction) => {
        try {
            const user = await this.adminService.createAdminUser(req.body);
            res.status(201).json({ success: true, message: "Admin created", data: user });
        } catch (error) {
            next(error);
        }
    };
}
