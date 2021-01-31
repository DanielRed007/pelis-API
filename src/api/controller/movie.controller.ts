import { Request, Response } from "express";
import {
  IMovie,
  SearchListResponse,
} from "../../schema/interface/Movie.interface";
import Movie from "../../schema/model/Movie.model";
import { movieRouter } from "../route/movie.route";
import {
  aggregationByGenreYear,
  aggregationByYearRange,
  aggregationByAverageDuration,
} from "./aggregation/movie-data-project";
import {
  textSearchQuery,
  castSearchQuery,
  genreSearchQuery,
} from "./query/movie-data-query";

export const getMovies = async ({
  filters = null,
  page = 0,
  moviesPerPage = 10,
} = {}) => {
  let queryParams: any = {};

  if (filters) {
    if ("text" in filters) {
      queryParams = textSearchQuery(filters["text"]);
    } else if ("cast" in filters) {
      queryParams = castSearchQuery(filters["cast"]);
    } else if ("genre" in filters) {
      queryParams = genreSearchQuery(filters["genre"]);
    }
  }

  let { query, project, sort } = queryParams;
  let cursor: IMovie[];

  try {
    cursor = await Movie.find(query, project)
      .skip(page > 0 ? (page - 1) * moviesPerPage : 0)
      .sort(sort)
      .limit(moviesPerPage);
  } catch (error) {
    console.error(`Unable to issue find command, ${error}`);
    return { moviesList: [], totalNumMovies: 0 };
  }

  try {
    const moviesList: IMovie[] = await cursor;
    const totalNumMovies: number = await Movie.find(query).countDocuments();

    return { moviesList, totalNumMovies };
  } catch (e) {
    console.error(
      `Unable to convert cursor to array or problem counting documents, ${e}`
    );
    return { moviesList: [], totalNumMovies: 0 };
  }
};

export const getMovieById = async (
  req: Request,
  res: Response
): Promise<void> => {
  const id: string = req.params.id;
  const movie: IMovie = await Movie.findById(id, {
    title: 1,
    countries: 1,
    directors: 1,
    imdb: 1,
    year: 1,
  });
  res.json(movie);
};

// Get - Movies by Cast, Genre or Text Search
export const searchMovies = async (
  req: Request,
  res: Response,
  next
): Promise<void> => {
  const moviesPerPage: number = 10;
  let page: number;

  // Set Page number
  try {
    page = req.query.page ? parseInt(req.query.page) : 0;
  } catch (error) {
    console.error(`Got bad value for page:, ${error}`);
    page = 0;
  }

  // Integrate a
  let searchType: string;

  try {
    searchType = Object.keys(req.query)[0];
  } catch (error) {
    console.error(`No search keys specified: ${error}`);
  }

  let filters: any = {};

  switch (searchType) {
    case "genre":
      if (req.query.genre !== "") {
        filters.genre = req.query.genre;
      }
      break;
    case "cast":
      if (req.query.cast !== "") {
        filters.cast = req.query.cast;
      }
      break;
    case "text":
      if (req.query.text !== "") {
        filters.text = req.query.text;
      }
      break;
    default:
    // nothing to do
  }

  const { moviesList, totalNumMovies } = await getMovies({
    filters,
    page,
    moviesPerPage,
  });

  let response: SearchListResponse = {
    movies: moviesList,
    page: page,
    filters: filters,
    moviesPerPage: moviesPerPage,
    total_count: totalNumMovies,
  };

  res.json(response);
};

// GET - Movies by a range between two years
export const searchMoviesYearRange = async (req: Request, res: Response) => {
  try {
    const movies: IMovie[] = await Movie.aggregate(aggregationByYearRange(req));
    // TODO: Create a list numbered and filter for this result
    res.json(movies);
  } catch (e) {
    console.error(`Aggregation failed - Error Type: ${e}`);
  }
};

// GET - Movies by Genre and Year
export const moviesByGenresAndYear = async (req: Request, res: Response) => {
  try {
    const movies: IMovie[] = await Movie.aggregate(aggregationByGenreYear(req));

    res.json(movies);
  } catch (e) {
    console.error(`Aggregation failed - Error Type: ${e}`);
  }
};

// GET - Movies by Genre and Year
export const getMoviesByAverage = async (req: Request, res: Response) => {
  try {
    const movies: IMovie[] = await Movie.aggregate(
      aggregationByAverageDuration(req)
    );

    res.json(movies);
  } catch (e) {
    console.error(`Aggregation failed - Error Type: ${e}`);
  }
};
