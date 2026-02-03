import movieGluClient from "../services/movieGluClient.js";
import Movie from "../models/Movie.js";
import Show from "../models/Show.js";

//api to get now playing movies
export const getNowShowingFilms = async (req, res) => {
  try {

    const response = await movieGluClient.get("filmsNowShowing/");
console.log(response)
    res.json({
      success: true,
      data: response.data,
    });

  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.response?.data || error.message,
    });
  }
};

// API To add new show to database
export const addShow = async (req, res) => {
  try {
    const { filmId, showTime, showPrice } = req.body;

    // 🔥 Check if movie already exists
    let movie = await Movie.findOne({ filmId });

    if (!movie) {

      // Fetch film details from MovieGlu
      const response = await movieGluClient.get(`films/${filmId}/`);

      const film = response.data;

      // Create movie in DB
      movie = await Movie.create({
        filmId: film.film_id,
        title: film.film_name,
        description: film.synopsis_long || film.synopsis_short,
        poster: film.images?.poster?.[0]?.medium?.film_image,
        releaseDate: film.release_date,
        runtime: film.duration_mins,
      });
    }

    // ✅ Create Show
    const show = await Show.create({
      movie: movie._id,
      showTime,
      showPrice,
    });

    res.status(201).json({
      success: true,
      message: "Show added successfully",
      show,
    });

  } catch (error) {
    console.error("Add Show Error:", error.response?.data || error.message);

    res.status(500).json({
      success: false,
      message: "Failed to add show",
      error: error.response?.data || error.message,
    });
  }
};