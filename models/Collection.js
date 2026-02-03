import mongoose from "mongoose";

const collectionSchema = new mongoose.Schema({
    userId: {
        type: String,
        required: true,
    },
    name: {
        type: String,
        required: true,
    },
    movies: [{
        type: String,
        ref: "Movie",
    }],
}, { timestamps: true });

// Prevent duplicate collection names for the same user
collectionSchema.index({ userId: 1, name: 1 }, { unique: true });

const Collection = mongoose.model("Collection", collectionSchema);

export default Collection;
