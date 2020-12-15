import { Request, Response } from "express";
import Movie from "../../schema/model/Movie.model";
import {
  textSearchQuery,
  castSearchQuery,
  genreSearchQuery,
} from "./query/movie-data-query";

const getMovies = async ({
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
  let cursor;

  try {
    cursor = await Movie.find(query, project)
      .skip(page > 0 ? (page - 1) * moviesPerPage : 0)
      .sort(sort)
      .limit(moviesPerPage);
  } catch (error) {
    console.error(`Unable to issue find command, ${error}`);
    return { moviesList: [], totalNumMovies: 0 };
  }

  // const displayCursor = cursor.limit(moviesPerPage);

  try {
    const moviesList = await cursor;
    const totalNumMovies = await Movie.find(query).countDocuments();

    return { moviesList, totalNumMovies };
  } catch (e) {
    console.error(
      `Unable to convert cursor to array or problem counting documents, ${e}`
    );
    return { moviesList: [], totalNumMovies: 0 };
  }
};

export const searchMovies = async (req: Request, res: Response, next) => {
  const moviesPerPage = 10;
  let page;

  // Set Page number
  try {
    page = req.query.page ? parseInt(req.query.page) : 0;
  } catch (error) {
    console.error(`Got bad value for page:, ${error}`);
    page = 0;
  }

  // Integrate a
  let searchType;

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

  let response = {
    movies: moviesList,
    page: page,
    filters: filters,
    moviesPerPage: moviesPerPage,
    total_count: totalNumMovies,
  };

  res.json(response);
};

export const moviesByGenresAndYear = async (req: Request, res: Response) => {
  try {
    const { year, genres } = req.params;
    const queryGenres = genres.split(",");
    const movies = await Movie.aggregate([
      { $match: { year: parseInt(year), genres: { $all: queryGenres } } },
      {
        $project: { year: 1, genres: 1, title: 1, countries: 1, directors: 1 },
      },
    ]);

    res.json(movies);
  } catch (e) {
    console.error(`Aggregation failed - Error Type: ${e}`);
  }
};
