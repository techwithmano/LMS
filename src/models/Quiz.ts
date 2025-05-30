import mongoose, { Schema, Document } from "mongoose";

export interface IQuiz extends Document {
  title: string;
  questions: Array<any>;
  course: mongoose.Types.ObjectId;
  submissions: Array<{
    student: mongoose.Types.ObjectId;
    answers: string[];
    score: number;
    graded: boolean;
  }>;
}

const QuizSchema: Schema = new Schema({
  title: { type: String, required: true },
  questions: [Schema.Types.Mixed],
  course: { type: Schema.Types.ObjectId, ref: "Course" },
  submissions: [
    {
      student: { type: Schema.Types.ObjectId, ref: "User" },
      answers: [String],
      score: Number,
      graded: Boolean
    }
  ]
});

export default mongoose.models.Quiz || mongoose.model<IQuiz>("Quiz", QuizSchema);
