import Collection from "../models/Collection.js";
import Movie from "../models/Movie.js";
import axios from "axios";
import Favorite from "../models/Favorite.js";

export const createCollection = async (req, res) => {
    try {
        const { userId } = req.auth;
        const { name } = req.body;

        if (!name) return res.status(400).json({ success: false, message: "Collection name is required" });

        const existing = await Collection.findOne({ userId, name });
        if (existing) return res.status(400).json({ success: false, message: "Collection already exists" });

        const collection = new Collection({ userId, name, movies: [] });
        await collection.save();

        res.status(201).json({ success: true, collection });
    } catch (error) {
        console.error("Error creating collection:", error);
        res.status(500).json({ success: false, message: "Server Error" });
    }
};

export const getCollections = async (req, res) => {
    try {
        const { userId } = req.auth;
        const collections = await Collection.find({ userId }).populate("movies");
        res.json({ success: true, collections });
    } catch (error) {
        console.error("Error fetching collections:", error);
        res.status(500).json({ success: false, message: "Server Error" });
    }
};

export const addMovieToCollection = async (req, res) => {
    try {
        const { userId } = req.auth;
        const { collectionId, movieId } = req.body;

        const collection = await Collection.findOne({ _id: collectionId, userId });
        if (!collection) return res.status(404).json({ success: false, message: "Collection not found" });

        if (collection.movies.includes(movieId)) {
            return res.status(400).json({ success: false, message: "Movie already in collection" });
        }

        // Check if movie exists in local DB
        let movie = await Movie.findById(movieId);
        if (!movie) {
            // Fetch from OMDB
            const omdbKey = process.env.OMDB_API_KEY || "7bfbdb37";
            const response = await axios.get(`https://www.omdbapi.com/?apikey=${omdbKey}&i=${movieId}&plot=full`);
            const data = response.data;

            if (data.Response === "True") {
                // Save to local DB
                movie = new Movie({
                    _id: data.imdbID,
                    title: data.Title,
                    overview: data.Plot,
                    poster_path: data.Poster,
                    backdrop_path: data.Poster, // OMDB often doesn't give a separate backdrop, fallback to poster or leave empty if your UI handles it
                    release_date: new Date(data.Released),
                    vote_average: parseFloat(data.imdbRating) || 0,
                    vote_count: parseInt(data.imdbVotes?.replace(/,/g, '')) || 0,
                    runtime: parseInt(data.Runtime) || 0,
                    genres: data.Genre?.split(', ').map((g, i) => ({ id: i, name: g })) || [],
                    director: data.Director,
                    writer: data.Writer,
                    actors: data.Actors,
                    awards: data.Awards,
                    rated: data.Rated,
                    country: data.Country,
                    metascore: data.Metascore,
                    boxOffice: data.BoxOffice,
                    casts: data.Actors?.split(', ').map(name => ({ name, profile_path: null })) || [],
                });
                await movie.save();
            } else {
                return res.status(404).json({ success: false, message: "Movie not found in external database" });
            }
        }

        collection.movies.push(movieId);
        await collection.save();

        res.json({ success: true, message: "Added to collection", collection });
    } catch (error) {
        console.error("Error adding to collection:", error);
        res.status(500).json({ success: false, message: "Server Error" });
    }
};



export const removeMovieFromCollection = async (req, res) => {
    try {
        const { userId } = req.auth;
        const { collectionId, movieId } = req.params;

        const collection = await Collection.findOne({ _id: collectionId, userId });
        if (!collection) return res.status(404).json({ success: false, message: "Collection not found" });

        collection.movies = collection.movies.filter(id => id.toString() !== movieId);
        await collection.save();

        // Cleanup: Check if movie is used elsewhere
        const movie = await Movie.findById(movieId);
        if (movie && !movie.isNowShowing && !movie.showOnHome) {
            // Check usage in other collections
            const inOtherCollections = await Collection.countDocuments({ movies: movieId });
            // Check usage in favorites
            const inFavorites = await Favorite.countDocuments({ movie: movieId });

            if (inOtherCollections === 0 && inFavorites === 0) {
                await Movie.findByIdAndDelete(movieId);
                console.log(`Deleted unused movie: ${movieId}`);
            }
        }

        res.json({ success: true, message: "Removed from collection" });
    } catch (error) {
        console.error("Error removing from collection:", error);
        res.status(500).json({ success: false, message: "Server Error" });
    }
};

export const deleteCollection = async (req, res) => {
    try {
        const { userId } = req.auth;
        const { collectionId } = req.params;

        const result = await Collection.deleteOne({ _id: collectionId, userId });
        if (result.deletedCount === 0) return res.status(404).json({ success: false, message: "Collection not found" });

        res.json({ success: true, message: "Collection deleted" });
    } catch (error) {
        console.error("Error deleting collection:", error);
        res.status(500).json({ success: false, message: "Server Error" });
    }
};
