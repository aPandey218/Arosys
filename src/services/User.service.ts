import User from "../models/User.model";
import * as bcrypt from "bcrypt";
import { ApiError } from "../utils/ApiError";

export class UserService {

  async signup(data: any) {
    if (await User.findOne({ email: data.email }))
      throw new ApiError(409, "Email exists");

    data.password = await bcrypt.hash(data.password, 12);
    return User.create(data);
  }

  async login(email: string, password: string) {
    const user = await User.findOne({ email, isDeleted: false }).select("+password");
    if (!user || !(await bcrypt.compare(password, user.password)))
      throw new ApiError(401, "Invalid credentials");

    return user;
  }

  async me(id: string) {
    return User.findOne({ _id: id, isDeleted: false });
  }

  async updateSelf(id: string, data: any) {
    delete data.role;
    delete data.password;
    return User.findByIdAndUpdate(id, data, { new: true });
  }

  async deleteSelf(id: string) {
    return User.findByIdAndUpdate(id, { isDeleted: true });
  }

  // ADMIN
  async all(page: number, limit: number) {
    return User.find({ isDeleted: false })
      .skip((page - 1) * limit)
      .limit(limit);
  }

  async adminUpdate(id: string, data: any) {
    return User.findByIdAndUpdate(id, data, { new: true });
  }

  async adminDelete(id: string) {
    return User.findByIdAndUpdate(id, { isDeleted: true });
  }
}