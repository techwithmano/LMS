import mongoose, { Schema, Document } from "mongoose";

export interface ICourse extends Document {
  title: string;
  subject: string;
  level: string;
  image: string;
  instructor: mongoose.Types.ObjectId;
  lessons: mongoose.Types.ObjectId[];
  students: mongoose.Types.ObjectId[];
}

const CourseSchema: Schema = new Schema({
  title: { type: String, required: true },
  subject: String,
  level: String,
  image: String,
  instructor: { type: Schema.Types.ObjectId, ref: "User" },
  lessons: [{ type: Schema.Types.ObjectId, ref: "Lesson" }],
  students: [{ type: Schema.Types.ObjectId, ref: "User" }]
});

export default mongoose.models.Course || mongoose.model<ICourse>("Course", CourseSchema);
