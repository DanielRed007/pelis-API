import { Document } from "mongoose";

export interface IMovie extends Document {
  _id: string;
  plot: string;
  genres: string[];
  runtime: number;
  cast: string[];
  num_mflix_comments: number;
  title: string;
  fullplot: string;
  countries: string[];
  released: Date;
  directors: string[];
  rated: string;
  awards: object;
  lastupdated: Date;
  year: 1893;
  imdb: object;
  type: string;
  tomatoes: object;
}

export interface SearchListResponse {
  movies: IMovie[];
  page: number;
  filters: {};
  moviesPerPage: number;
  total_count: number;
}