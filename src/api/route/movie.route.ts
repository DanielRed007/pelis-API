import * as express from "express";
import {
  moviesByGenresAndYear,
  searchMovies,
  searchMoviesAggregate,
} from "../controller/movie.controller";

const movieRouter = express.Router();

movieRouter.get("/", searchMovies);
movieRouter.get("/by-genre/:year/:genres", moviesByGenresAndYear);
movieRouter.get("/agg-search", searchMoviesAggregate);

export { movieRouter };
