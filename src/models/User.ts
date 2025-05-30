import mongoose, { Schema, Document } from "mongoose";

export type UserRole = "admin" | "teacher" | "student";

export interface IUser extends Document {
  name: string;
  email: string;
  password: string;
  role: UserRole;
}

const UserSchema: Schema = new Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  role: { type: String, enum: ["admin", "teacher", "student"], default: "student" }
});

export default mongoose.models.User || mongoose.model<IUser>("User", UserSchema);
