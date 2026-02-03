import mongoose from "mongoose";

const favoriteSchema = new mongoose.Schema({
    userId: {
        type: String,
        required: true,
    },
    movie: {
        type: String,
        ref: "Movie",
        required: true,
    },
}, { timestamps: true });

// Prevent duplicate favorites for the same user/movie
favoriteSchema.index({ userId: 1, movie: 1 }, { unique: true });

const Favorite = mongoose.model("Favorite", favoriteSchema);

export default Favorite;
