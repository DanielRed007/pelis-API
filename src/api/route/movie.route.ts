import * as express from "express";
import { searchMovies } from "../controller/movie.controller";

const movieRouter = express.Router();

movieRouter.get("/", searchMovies);

export { movieRouter };
