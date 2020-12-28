// A small test that worked
function suma(a, b) {
  return a + b;
}

import * as mongoose from "mongoose";
import { dbConfig } from "../../../config/dbConfig";
import { getMovies } from "../movie.controller";

const db = "test";

describe("Get movies with filters", () => {
  beforeAll(async () => {
    const url = `${dbConfig.test}/pelis`;
    await mongoose.connect(url, { useNewUrlParser: true });
  });

  test("Get movies by cast", async () => {
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

    // Todo: Testing seventh page
  });

  afterAll(async () => {
    await mongoose.connection.close();
  });
});
