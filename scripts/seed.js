import mongoose from "mongoose";
import dotenv from "dotenv";
import axios from "axios";
import Movie from "../models/Movie.js";
import Theater from "../models/Theater.js";
import Showtime from "../models/Showtime.js";

dotenv.config();

const OMDB_API_KEY = "7bfbdb37";

const movieTitles = [
    // Requested Specific
    "Avengers: Endgame",

    "Project Hail Mary",
    "Toy Story 5",
    "Your Name.",

    // Indian Movies 2026 (Researched)
    "The Raja Saab",
    "Swayambhu",
    "Love & War",
    "Toxic", // Toxic: A Fairy Tale For Grown-ups
    "King",
    "Drishyam 3",
    "War 2", // Might be late 2025/2026
    "Alpha",

    // New Additions
    "F1",
    "Superman",
    "Scream 7",
    "Spider-Man: No Way Home",
    "3 Idiots",
    "12th Fail",
    "Uri: The Surgical Strike",
    "Demon Slayer: Kimetsu no Yaiba Infinity Castle",
    "A Silent Voice",
    "Star Wars: Episode III - Revenge of the Sith",
    "Border",
    "Mardaani 3",
    "Avengers: Doomsday"
];

const theatersData = [
    { name: "PVR: Select Citywalk", location: "Saket, New Delhi, Delhi", isActive: true },
    { name: "PVR: Pacific Mall", location: "Subhash Nagar, New Delhi, Delhi", isActive: true },
    { name: "PVR: Elante Mall", location: "Indigust Area, Chandigarh", isActive: true },
    { name: "Cinepolis: Jagat Mall", location: "Sector 17, Chandigarh", isActive: true },
    { name: "Wave Cinemas: MBD Neopolis", location: "Ferozepur Road, Ludhiana, Punjab", isActive: true },
    { name: "PVR: Silver Arc", location: "Ludhiana, Punjab", isActive: true },
    { name: "INOX: Trillium Mall", location: "Amritsar, Punjab", isActive: true },
    { name: "PVR: Mall Road", location: "Shimla, Himachal Pradesh", isActive: true },
    { name: "Gold Cinema", location: "Dharamshala, Himachal Pradesh", isActive: true },
    { name: "PVR: Ambience Mall", location: "Gurgaon, Haryana", isActive: true },
    { name: "INOX: Ardee City", location: "Gurgaon, Haryana", isActive: true },
    { name: "PVR: Galaxy", location: "Ambala, Haryana", isActive: true },
    { name: "Purnam Multiplex", location: "Bilaspur, Himachal Pradesh", isActive: true },
    { name: "Antariksha Pride", location: "Hamirpur, Himachal Pradesh", isActive: true }
];

const fetchMovieFromOMDb = async (title) => {
    try {
        // Search without year first to get correct match, or with year if known.
        // Since list mixes old (Endgame) and new (2026), better to search generic.
        // Or we can try to be specific if we face collisions.
        console.log(`[OMDb] Fetching ${title}...`);
        const response = await axios.get(`http://www.omdbapi.com/?t=${encodeURIComponent(title)}&apikey=${OMDB_API_KEY}`);

        if (response.data.Response === "True") {
            return response.data;
        } else {
            console.error(`[OMDb] Failed to find ${title}: ${response.data.Error}`);
            return null;
        }
    } catch (error) {
        console.error(`[OMDb] Error fetching ${title}:`, error.message);
        return null;
    }
};

const mapOMDbToMovie = (omdbData) => {
    // Map Genres
    const genres = omdbData.Genre ? omdbData.Genre.split(", ").map((g, i) => ({ id: i + 1, name: g })) : [];

    // Map Cast
    const casts = omdbData.Actors ? omdbData.Actors.split(", ").map(actor => ({
        name: actor,
        profile_path: `https://ui-avatars.com/api/?name=${encodeURIComponent(actor)}&background=random`
    })) : [];

    // Parse numeric fields
    const runtime = parseInt(omdbData.Runtime) || 120; // Default 120 if N/A
    const vote_average = parseFloat(omdbData.imdbRating) || 0;
    const vote_count = parseInt(omdbData.imdbVotes ? omdbData.imdbVotes.replace(/,/g, '') : 0) || 0;

    // Release Date
    let release_date = new Date();
    if (omdbData.Released && omdbData.Released !== "N/A") {
        release_date = new Date(omdbData.Released);
    } else if (omdbData.Year) {
        // If "2026" or "2026–"
        const year = omdbData.Year.replace(/–/g, '').split('-')[0];
        release_date = new Date(`${year}-01-01`);
    }

    return {
        _id: omdbData.imdbID || new mongoose.Types.ObjectId().toString(),
        title: omdbData.Title,
        overview: omdbData.Plot !== "N/A" ? omdbData.Plot : "No overview available.",
        poster_path: omdbData.Poster !== "N/A" ? omdbData.Poster : "https://placehold.co/600x900?text=No+Poster",
        backdrop_path: omdbData.Poster !== "N/A" ? omdbData.Poster : "https://placehold.co/1280x720?text=No+Backdrop",
        genres,
        casts,
        release_date,
        original_language: omdbData.Language ? omdbData.Language.split(", ")[0] : "en",
        tagline: "More than just a movie.", // OMDb lacks taglines usually
        vote_average,
        vote_count,
        runtime,

        // New Fields
        director: omdbData.Director,
        writer: omdbData.Writer,
        actors: omdbData.Actors,
        awards: omdbData.Awards,
        rated: omdbData.Rated,
        country: omdbData.Country,
        metascore: omdbData.Metascore,
        boxOffice: omdbData.BoxOffice,

        isNowShowing: true,
        showOnHome: true,
        showTimes: ["09:00 AM", "12:00 PM", "03:00 PM", "06:00 PM", "09:00 PM"]
    };
};

const seedDB = async () => {
    try {
        await mongoose.connect(process.env.MONGODB_URI);
        console.log("Connected to MongoDB...");

        // CLEAR DB
        await Movie.deleteMany({});
        await Theater.deleteMany({});
        await Showtime.deleteMany({});
        console.log("Cleared existing data...");

        // FETCH MOVIES
        const moviesToInsert = [];
        for (const title of movieTitles) {
            const data = await fetchMovieFromOMDb(title);
            if (data) {
                const movie = mapOMDbToMovie(data);
                moviesToInsert.push(movie);
            }
        }

        if (moviesToInsert.length > 0) {
            await Movie.insertMany(moviesToInsert);
            console.log(`Seeded ${moviesToInsert.length} movies from OMDb!`);
        } else {
            console.log("No movies found to seed.");
        }

        // INSERT THEATERS
        await Theater.insertMany(theatersData);
        console.log(`Seeded ${theatersData.length} theaters...`);

        console.log("Database seeded successfully!");
        process.exit(0);
    } catch (error) {
        console.error("Error seeding database:", error);
        process.exit(1);
    }
};

seedDB();
