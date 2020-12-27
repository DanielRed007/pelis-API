import { Document } from "mongoose";

export interface IComment extends Document {
  _id: string;
  name: string;
  email: string;
  movie_id: string;
  text: string;
  date: Date;
}
