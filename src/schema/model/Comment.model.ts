import * as mongoose from "mongoose";
import { IComment } from "../interface/Comment.interface";

const Schema = mongoose.Schema;

const CommentSchema: mongoose.Schema = new Schema(
  {
    _id: { type: mongoose.Types.ObjectId },
    name: { type: String },
    email: { type: String },
    movie_id: { type: mongoose.Types.ObjectId },
    text: { type: String },
    date: { type: Date },
  },
  { collection: "comments" }
);

export default mongoose.model<IComment>("Comment", CommentSchema);
