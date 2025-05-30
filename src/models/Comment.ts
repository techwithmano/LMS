import mongoose, { Schema, Document } from "mongoose";

export interface IComment extends Document {
  content: string;
  author: mongoose.Types.ObjectId;
  course?: mongoose.Types.ObjectId;
  lesson?: mongoose.Types.ObjectId;
  parent?: mongoose.Types.ObjectId;
  createdAt: Date;
}

const CommentSchema: Schema = new Schema({
  content: { type: String, required: true },
  author: { type: Schema.Types.ObjectId, ref: "User" },
  course: { type: Schema.Types.ObjectId, ref: "Course" },
  lesson: { type: Schema.Types.ObjectId, ref: "Lesson" },
  parent: { type: Schema.Types.ObjectId, ref: "Comment" },
  createdAt: { type: Date, default: Date.now }
});

export default mongoose.models.Comment || mongoose.model<IComment>("Comment", CommentSchema);
