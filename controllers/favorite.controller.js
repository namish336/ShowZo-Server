import Favorite from "../models/Favorite.js";
import Movie from "../models/Movie.js";

// Add a movie to favorites
export const addToFavorites = async (req, res) => {
    try {
        const userId = req.auth.userId;
        const { movieId } = req.body;

        if (!movieId) {
            return res.status(400).json({ success: false, message: "Movie ID is required" });
        }

        const movie = await Movie.findById(movieId);
        if (!movie) {
            return res.status(404).json({ success: false, message: "Movie not found" });
        }

        // Check if already favorite
        const existing = await Favorite.findOne({ userId, movie: movieId });
        if (existing) {
            return res.status(400).json({ success: false, message: "Movie already in favorites" });
        }

        const favorite = new Favorite({ userId, movie: movieId });
        await favorite.save();

        res.status(201).json({ success: true, message: "Added to favorites", favorite });
    } catch (error) {
        console.error("Error adding favorite:", error);
        res.status(500).json({ success: false, message: "Internal Server Error" });
    }
};

// Remove a movie from favorites
export const removeFromFavorites = async (req, res) => {
    try {
        const userId = req.auth.userId;
        const { movieId } = req.params;

        const deleted = await Favorite.findOneAndDelete({ userId, movie: movieId });

        if (!deleted) {
            return res.status(404).json({ success: false, message: "Favorite not found" });
        }

        res.status(200).json({ success: true, message: "Removed from favorites" });
    } catch (error) {
        console.error("Error removing favorite:", error);
        res.status(500).json({ success: false, message: "Internal Server Error" });
    }
};

// Get user's favorites
export const getFavorites = async (req, res) => {
    try {
        const userId = req.auth.userId;
        const favorites = await Favorite.find({ userId }).populate("movie").sort({ createdAt: -1 });

        res.status(200).json({ success: true, favorites });
    } catch (error) {
        console.error("Error fetching favorites:", error);
        res.status(500).json({ success: false, message: "Internal Server Error" });
    }
};
