import Movie from "../models/Movie.js";

export const getMovieById = async (req, res) => {
  try {

    const movie = await Movie.findById(req.params.id);

    if (!movie) {
      return res.status(404).json({
        success: false,
        message: "Movie not found"
      });
    }

    res.status(200).json({
      success: true,
      movie
    });

  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

export const getAllMovies = async (req, res) => {
  try {
    const { nowShowing, home, isHero } = req.query;
    let query = {};

    if (nowShowing === 'true') {
      query.isNowShowing = true;
    }
    if (home === 'true') {
      query.showOnHome = true;
    }
    if (isHero === 'true') {
      query.isHero = true;
    }

    const movies = await Movie.find(query);

    res.status(200).json({
      success: true,
      movies
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

export const updateMovie = async (req, res) => {
  try {
    const { id } = req.params;
    const updates = req.body;

    const movie = await Movie.findByIdAndUpdate(id, updates, { new: true });

    if (!movie) {
      return res.status(404).json({
        success: false,
        message: "Movie not found"
      });
    }

    res.status(200).json({
      success: true,
      movie,
      message: "Movie updated successfully"
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};
