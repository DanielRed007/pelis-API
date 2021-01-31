// A small test that worked
function suma(a, b) {
  return a + b;
}

import * as mongoose from "mongoose";
import { dbConfig } from "../../../config/dbConfig";
import { getMovies } from "../movie.controller";
import Movie from "../../../schema/model/Movie.model";

const db = "test";

describe("Get movies with filters", () => {
  beforeAll(async () => {
    const url = `${dbConfig.mongoURI}/sample_mflix`;
    await mongoose.connect(url, { useNewUrlParser: true });
  });

  test("Get movies by cast - First Page in list", async () => {
    // Choose an actress existing in the collection
    const filters = { cast: ["Nicole Kidman"] };

    // Testing first page
    const { moviesList: firstPage, totalNumMovies } = await getMovies({
      filters,
    });

    // Check total number of movies by selected actress
    expect(totalNumMovies).toEqual(43);
    // Check the total movies returned in the list
    expect(firstPage.length).toEqual(10);

    const firstMovie = firstPage[0];
    // Check the first movie title in the collection
    expect(firstMovie.title).toEqual("Trespass");
    // Check the year of the selected movie
    expect(firstMovie.year).toEqual(2011);
  });

  test("Get movies by genre - Fourth Page in list", async () => {
    const filters = { genre: ["Comedy"] };

    // Testing fourth page
    const { moviesList: fourthPage, totalNumMovies } = await getMovies({
      filters,
      page: 4,
    });

    // Check total count of search by genre
    expect(totalNumMovies).toEqual(7022);
    // Check total list length
    expect(fourthPage.length).toEqual(10);

    const lastMovie = fourthPage[9];
    // Check title of last movie
    expect(lastMovie.title).toEqual("2 Days in New York");
  });

  test("Get movies by text search - First page in the list", async () => {
    const filters = { text: "Kubrick" };

    const { moviesList: firstPage, totalNumMovies } = await getMovies({
      filters,
      page: 1,
    });

    expect(totalNumMovies).toEqual(3);
    // Check total list length
    expect(firstPage.length).toEqual(3);

    const lastMovie = firstPage[2];
    // Check title of last movie
    expect(lastMovie.title).toEqual("Stanley Kubrick: A Life in Pictures");
  });

  test("Get movies by year range", async () => {
    const pipeline = [
      {
        $match: {
          $and: [{ year: { $lte: 1930 } }, { year: { $gte: 1900 } }],
        },
      },
      {
        $project: { title: 1, genres: 1, year: 1 },
      },
      {
        $sort: { year: -1, title: 1 },
      },
    ];

    const movies = await Movie.aggregate(pipeline);

    const totalMovies = movies.length;
    const seventhMovie = movies[6];

    // Total number of movies
    expect(totalMovies).toEqual(132);
    // Specific movie
    expect(seventhMovie).toBeDefined();
    // Movie title
    expect(seventhMovie.title).toEqual("The Big House");
    // Movie year
    expect(seventhMovie.year).toEqual(1930);
    // Second movie genre
    expect(seventhMovie.genres[1]).toEqual("Romance");
  });

  afterAll(async () => {
    await mongoose.connection.close();
  });
});
