import mongoose from "mongoose";

const movieSchema = new mongoose.Schema(
  {
    _id: { type: String, required: true }, // Using String ID to match dummy data/TMDB IDs loosely if needed, or we can rely on standard ObjectIds but user dummy data had specific IDs.
    title: { type: String, required: true },
    overview: { type: String, required: true },
    poster_path: { type: String, required: true },
    backdrop_path: { type: String, required: true },
    release_date: { type: Date, required: true },
    original_language: { type: String },
    tagline: { type: String },
    genres: [
      {
        id: { type: Number },
        name: { type: String },
      },
    ],
    casts: [
      {
        name: { type: String },
        profile_path: { type: String },
      },
    ],
    vote_average: { type: Number },
    vote_count: { type: Number },
    runtime: { type: Number, required: true },
    director: { type: String }, // New
    writer: { type: String },   // New
    actors: { type: String },   // New (Storing full string if needed, mostly redundant with casts but good for display)
    awards: { type: String },   // New
    rated: { type: String },    // New
    country: { type: String },  // New
    metascore: { type: String }, // New
    boxOffice: { type: String }, // New
    isNowShowing: { type: Boolean, default: false },
    showOnHome: { type: Boolean, default: false },
    isHero: { type: Boolean, default: false },
    showTimes: { type: [String], default: [] },
  },
  { timestamps: true, _id: false } // We want to allow setting _id manually if needed, or we can remove _id: false if we want mongo to generate it. However, the schema definition had _id explicitly defined.
);

// To ensure we can save the document with the provided _id
// movieSchema.set('_id', false); // This is risky if we don't provide it.
// The dummy data had numeric IDs or string IDs. Let's keep strict to the schema provided.
// Actually, re-reading the dummy data, IDs were "324544" (string).
// I will keep _id definition as provided in previous file but expanded.

const Movie = mongoose.model("Movie", movieSchema);

export default Movie;