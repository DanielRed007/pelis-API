export const textSearchQuery = (text) => {
  const query = { $text: { $search: text } };
  const sort = { title: 1, year: 1, director: 1 };
  const project = { };
  
  return { query, project, sort };
};

export const castSearchQuery = (cast) => {
  const searchCast = Array.isArray(cast) ? cast : cast.split(", ");

  const query = { cast: { $in: searchCast } };
  const project = { title: 1, year: 1, director: 1 };
  const sort = { title: -1 };

  return { query, project, sort };
};

export const genreSearchQuery = (genre) => {
  const searchGenre = Array.isArray(genre) ? genre : genre.split(", ");

  const query = { genres: { $in: searchGenre } };
  const project = { title: 1, genres: 1 };
  const sort = { title: 1 };

  return { query, project, sort };
};
