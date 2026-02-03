import mongoose from "mongoose";

const theaterSchema = new mongoose.Schema(
    {
        name: { type: String, required: true },
        location: { type: String, required: true },
        isActive: { type: Boolean, default: true },
    },
    { timestamps: true }
);

const Theater = mongoose.model("Theater", theaterSchema);

export default Theater;
