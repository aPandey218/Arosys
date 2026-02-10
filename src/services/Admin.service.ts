import User from "../models/User.model";
import * as bcrypt from "bcrypt";
import { ApiError } from "../utils/ApiError";
import { UserService } from "./User.service";

export class AdminService extends UserService {
    async adminLogin(email: string, password: string) {
        const user = await User.findOne({ email, isDeleted: false }).select("+password");

        if (!user || !(await bcrypt.compare(password, user.password))) {
            throw new ApiError(401, "Invalid credentials or user not found");
        }

        if (user.role !== "admin") {
            throw new ApiError(403, "Access denied: Not an Admin");
        }

        return user;
    }


    async getAllUsers(page: number, limit: number) {
        const skip = (page - 1) * limit;
        const users = await User.find({ isDeleted: false })
            .skip(skip)
            .limit(limit)
            .sort({ createdAt: -1 }); // Newest first

        const total = await User.countDocuments({ isDeleted: false });

        return {
            users,
            pagination: {
                total,
                page,
                limit,
                pages: Math.ceil(total / limit)
            }
        };
    }


    async updateUser(id: string, data: any) {
        // Prevent changing password directly through this route for security, unless specified logic exists
        if (data.password) {
            data.password = await bcrypt.hash(data.password, 12);
        }

        const user = await User.findByIdAndUpdate(id, data, { new: true });
        if (!user) throw new ApiError(404, "User not found");
        return user;
    }

    async deleteUser(id: string) {
        const user = await User.findByIdAndUpdate(id, { isDeleted: true }, { new: true });
        if (!user) throw new ApiError(404, "User not found");
        return { message: "User deleted successfully" };
    }

    async createAdminUser(data: any) {

        data.role = "admin";


        if (data.password) {
            data.password = await bcrypt.hash(data.password, 12);
        }

        return User.create(data);
    }
}
