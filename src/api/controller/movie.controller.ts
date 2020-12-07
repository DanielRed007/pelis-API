import Movie from "../../schema/model/Movie.model";

export const getAllMovies = async (req: any, res: any) => {
  try {
    const movies = await Movie.find();
    res.status(200).json(movies);
  } catch (error) {
    console.log(error);
    res.json(error);
  }
};
