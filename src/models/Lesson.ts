import mongoose, { Schema, Document } from "mongoose";

export interface ILesson extends Document {
  title: string;
  description: string;
  resources: string[];
  videoLink: string;
  notes: string;
  course: mongoose.Types.ObjectId;
}

const LessonSchema: Schema = new Schema({
  title: { type: String, required: true },
  description: String,
  resources: [String],
  videoLink: String,
  notes: String,
  course: { type: Schema.Types.ObjectId, ref: "Course" }
});

export default mongoose.models.Lesson || mongoose.model<ILesson>("Lesson", LessonSchema);
