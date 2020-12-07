import * as express from "express";
import { getAllMovies } from "../controller/movie.controller";

const movieRouter = express.Router();

movieRouter.get("/", getAllMovies);

export { movieRouter };
