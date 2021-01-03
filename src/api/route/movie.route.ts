import * as express from "express";
import {
  moviesByGenresAndYear,
  searchMovies,
  searchMoviesYearRange,
  getMovieById
} from "../controller/movie.controller";

const movieRouter = express.Router();

movieRouter.get("/", searchMovies);
movieRouter.get("/by-genre/:year/:genres", moviesByGenresAndYear);
movieRouter.get("/agg-search", searchMoviesYearRange);
movieRouter.get("/:id",getMovieById);

export { movieRouter };
