import * as mongoose from "mongoose";
import { IMovie } from "../interface/Movie.interface";

const Schema = mongoose.Schema;

const MovieSchema: mongoose.Schema = new Schema(
  {
    _id: { type: mongoose.Types.ObjectId },
    plot: { type: String },
    genres: { type: Array },
    runtime: { type: Number },
    cast: { type: Array },
    num_mflix_comments: { type: Number },
    title: { type: String },
    fullplot: { type: Array },
    countries: { type: Array },
    released: { type: Date },
    directors: { type: Array },
    rated: { type: String },
    awards: { type: Object },
    lastupdated: { type: Date },
    year: { type: Number },
    imdb: { type: Object },
    type: { type: String },
    tomatoes: { type: Object },
  },
  { collection: "movies" }
);

MovieSchema.index({year: 1, director: -1});
MovieSchema.index({plot: "text"});

export default mongoose.model<IMovie>("Movie", MovieSchema);
