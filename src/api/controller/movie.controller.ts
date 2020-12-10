import Movie from "../../schema/model/Movie.model";

const textSearchQuery = (text) => {
  const query = { $text: { $search: text } };
  const meta_score = { $meta: "textScore" };
  const sort = [["score", meta_score]];
  const project = { score: meta_score };

  return { query, project, sort };
};

const castSearchQuery = (cast) => {
  const searchCast = Array.isArray(cast) ? cast : cast.split(", ");

  const query = { cast: { $in: searchCast } };
  const project = { title: 1, year: 1, director: 1 };
  const sort = { title: -1 };

  return { query, project, sort };
};

const genreSearchQuery = (genre) => {
  const searchGenre = Array.isArray(genre) ? genre : genre.split(", ");

  const query = { genres: { $in: searchGenre } };
  const project = { title: 1, genres: 1 };
  const sort = { title: 1 };

  return { query, project, sort };
};

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
    cursor = await Movie.find(query, project).sort(sort).limit(moviesPerPage);
  } catch (error) {
    console.error(`Unable to issue find command, ${error}`);
    return { moviesList: [], totalNumMovies: 0 };
  }

  // const displayCursor = cursor.limit(moviesPerPage);

  try {
    const moviesList = await cursor;
    const totalNumMovies = await Movie.find(query).count();

    return { moviesList, totalNumMovies };
  } catch (e) {
    console.error(
      `Unable to convert cursor to array or problem counting documents, ${e}`
    );
    return { moviesList: [], totalNumMovies: 0 };
  }
};

export const searchMovies = async (req: any, res: any, next) => {
  const moviesPerPage = 10;
  let page;

  // Set Page number
  try {
    page = req.query.page ? parseInt(req.query.page, 10) : 0;
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
