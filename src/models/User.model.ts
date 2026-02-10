import mongoose, { Document } from "mongoose";

export interface IUser extends Document {
  name: string;
  email: string;
  password: string;
  role: "user" | "admin";
  isDeleted: boolean;
  refreshToken?: string;
}

const schema = new mongoose.Schema<IUser>({
  name: { type: String, required: true },
  email: { type: String, unique: true, index: true },
  password: { type: String, select: false },
  role: { type: String, enum: ["user", "admin"], default: "user" },
  isDeleted: { type: Boolean, default: false },
  refreshToken: { type: String, select: false }
}, { timestamps: true });

export default mongoose.model<IUser>("User", schema);