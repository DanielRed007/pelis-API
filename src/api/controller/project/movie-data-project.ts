import { Request } from "express";

export const projectByGenreYear = (req: Request) => {
  const { year, genres } = req.params;
  const queryGenres = genres.split(",");
  return [
    { $match: { year: parseInt(year), genres: { $all: queryGenres } } },
    {
      $project: { year: 1, genres: 1, title: 1, countries: 1, directors: 1 },
    },
  ];
};
