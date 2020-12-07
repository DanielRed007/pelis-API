import * as express from "express";

// Database Connection
import { connectDB } from "./config/db";

// Routes
import { movieRouter } from "./api/route/movie.route";

const app = express();

connectDB();

app.use("/api/movies", movieRouter);

app.get("/", (req, res) => {
  res.send("Hello World");
});

const PORT = process.env.PORT || 7000;

app.listen(PORT, () => {
  console.log(`Server is running in http://localhost:${PORT}`);
});
