import axios from "axios";
import Movie from "../models/Movie.js";

const OMDB_API_KEY = "7bfbdb37";
const OMDB_BASE_URL = "http://www.omdbapi.com/";

// Keywords to capture both Bollywood + Hollywood
const SEARCH_TERMS = [
  "2026",
  "bollywood",
  "hindi",
  "india",
  "action",
  "thriller",
  "marvel",
  "dc",
  "hollywood",
  "love",
  "war"
];


// 👉 Import movies into DB
export const importShows = async (req, res) => {
  try {

    let importedMovies = [];

    for (const term of SEARCH_TERMS) {

      // OMDb supports max 10 pages
      for (let page = 1; page <= 5; page++) {

        const response = await axios.get(OMDB_BASE_URL, {
          params: {
            apikey: OMDB_API_KEY,
            s: term,
            type: "movie",
            y: "2026",
            page
          }
        });

        if (response.data.Response === "False") continue;

        const movies = response.data.Search;

        for (const movie of movies) {

          // Check if movie already exists
          const exists = await Movie.findOne({ imdbID: movie.imdbID });
          if (exists) continue;

          // Get full details
          const details = await axios.get(OMDB_BASE_URL, {
            params: {
              apikey: OMDB_API_KEY,
              i: movie.imdbID,
              plot: "full"
            }
          });

          const data = details.data;

          const newMovie = await Movie.create({
            imdbID: data.imdbID,
            title: data.Title,
            plot: data.Plot,
            poster: data.Poster,
            genre: data.Genre,
            director: data.Director,
            actors: data.Actors,
            runtime: data.Runtime,
            released: data.Released,
            year: data.Year,
            language: data.Language,
            imdbRating: data.imdbRating
          });

          importedMovies.push(newMovie);
        }
      }
    }

    res.status(200).json({
      success: true,
      message: `${importedMovies.length} movies imported`,
      data: importedMovies
    });

  } catch (error) {

    console.error("Movie import failed:", error.message);

    res.status(500).json({
      success: false,
      message: "Movie import failed"
    });
  }
};




// 👉 Get all 2026 movies (with pagination)
export const getShows = async (req, res) => {

  try {

    const page = Number(req.query.page) || 1;
    const limit = 20;
    const skip = (page - 1) * limit;

    const movies = await Movie.find({ year: "2026" })
      .sort({ imdbRating: -1 })
      .skip(skip)
      .limit(limit);

    const total = await Movie.countDocuments({ year: "2026" });

    res.status(200).json({
      success: true,
      page,
      totalPages: Math.ceil(total / limit),
      totalResults: total,
      data: movies
    });

  } catch (error) {

    res.status(500).json({
      success: false,
      message: "Failed to fetch movies"
    });
  }
};




// 👉 Get single movie
export const getSingleShow = async (req, res) => {

  try {

    const movie = await Movie.findOne({ imdbID: req.params.id });

    if (!movie) {
      return res.status(404).json({
        success: false,
        message: "Movie not found"
      });
    }

    res.status(200).json({
      success: true,
      data: movie
    });

  } catch (error) {

    res.status(500).json({
      success: false,
      message: "Failed to fetch movie"
    });
  }
};
