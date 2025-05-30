import mongoose, { Schema, Document } from "mongoose";

export interface IAssignment extends Document {
  title: string;
  description: string;
  pdfUrl: string;
  submissionUrl: string;
  course: mongoose.Types.ObjectId;
  dueDate: Date;
  submissions: Array<{
    student: mongoose.Types.ObjectId;
    fileUrl: string;
    grade: number;
    feedback: string;
  }>;
}

const AssignmentSchema: Schema = new Schema({
  title: { type: String, required: true },
  description: String,
  pdfUrl: String,
  submissionUrl: String,
  course: { type: Schema.Types.ObjectId, ref: "Course" },
  dueDate: Date,
  submissions: [
    {
      student: { type: Schema.Types.ObjectId, ref: "User" },
      fileUrl: String,
      grade: Number,
      feedback: String
    }
  ]
});

export default mongoose.models.Assignment || mongoose.model<IAssignment>("Assignment", AssignmentSchema);
