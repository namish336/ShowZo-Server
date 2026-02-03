import mongoose from "mongoose";

const bookingSchema = new mongoose.Schema(
    {
        userId: { type: String, required: true }, // Clerk User ID
        showtime: { type: mongoose.Schema.Types.ObjectId, ref: 'Showtime', required: true },
        seats: [{ type: String, required: true }],
        amount: { type: Number, required: true },
        isPaid: { type: Boolean, default: false },
        paymentLink: { type: String },
        paymentIntentId: { type: String },
    },
    { timestamps: true }
);

const Booking = mongoose.model("Booking", bookingSchema);

export default Booking;
