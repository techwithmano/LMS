import mongoose, { Schema, Document } from "mongoose";

export type UserRole = "owner" | "admin" | "student";

export interface IUser extends Document {
  name: string;
  userId: string;  // like AD001, ST001
  password: string;
  role: UserRole;
  email?: string;  // Optional email
}

const UserSchema: Schema = new Schema({
  name: { type: String, required: true },
  userId: { type: String, required: true, unique: true },  // Primary identifier for login
  password: { type: String, required: true },
  email: { type: String, required: false },  // Optional
  role: { type: String, enum: ["owner", "admin", "student"], default: "student" }
});

export default mongoose.models.User || mongoose.model<IUser>("User", UserSchema);
