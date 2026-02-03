import mongoose from "mongoose";

const showtimeSchema = new mongoose.Schema(
    {
        movie: { type: String, ref: 'Movie', required: true }, // Referencing by String ID matching Movie model
        theater: { type: mongoose.Schema.Types.ObjectId, ref: 'Theater', required: true },
        showTime: { type: Date, required: true },
        totalSeats: { type: Number, required: true },
        availableSeats: { type: Number, required: true },
        price: { type: Number, required: true },
    },
    { timestamps: true }
);

const Showtime = mongoose.model("Showtime", showtimeSchema);

export default Showtime;
