import * as express from "express";
import {
  moviesByGenresAndYear,
  searchMovies,
} from "../controller/movie.controller";

const movieRouter = express.Router();

movieRouter.get("/", searchMovies);
movieRouter.get("/by-genre/:year/:genres", moviesByGenresAndYear);

export { movieRouter };
