import { Request } from "express";

export const aggregationByGenreYear = (req: Request) => {
  const { year, genres } = req.params;
  const queryGenres = genres.split(",");
  return [
    { $match: { year: parseInt(year), genres: { $all: queryGenres } } },
    {
      $project: { year: 1, genres: 1, title: 1, countries: 1, directors: 1 },
    },
  ];
};

export const aggregationByYearRange = (req: Request) => {
  const { endYear, startYear } = req.query;
  return [
    {
      $match: {
        $and: [
          { year: { $lte: parseInt(endYear) } },
          { year: { $gte: parseInt(startYear) } },
        ],
      },
    },
    {
      $project: { title: 1, genres: 1, year: 1 },
    },
    {
      $sort: { year: -1, title: 1 },
    },
  ];
};
