import Booking from "../models/Booking.js";
import Showtime from "../models/Showtime.js";

// Create a new booking
export const createBooking = async (req, res) => {
    try {
        const { showtimeId, seats } = req.body;

        console.log("Create Booking Request Debug:");
        console.log("Headers Authorization:", req.headers.authorization);
        console.log("Auth State:", req.auth);

        const userId = req.auth.userId;

        if (!userId) {
            return res.status(401).json({ success: false, message: "Unauthorized", debug: req.auth });
        }

        if (!showtimeId || !seats || seats.length === 0) {
            return res.status(400).json({ success: false, message: "Invalid booking data" });
        }

        const showtime = await Showtime.findById(showtimeId);
        if (!showtime) {
            return res.status(404).json({ success: false, message: "Showtime not found" });
        }

        // Determine price - assume showtime.price is per seat
        const amount = showtime.price * seats.length;

        const newBooking = new Booking({
            userId,
            showtime: showtimeId,
            seats,
            amount,
            isPaid: false, // Default to false so user can pay later
            paymentLink: "https://example.com/payment-placeholder"
        });

        await newBooking.save();

        // Update available seats in Showtime (optional but good practice)
        // Note: We should probably track occupied seats in Showtime model too to prevent double booking.
        // For now, based on SeatLayout.jsx, it seems 'occupiedSeats' logic might be missing or handled elsewhere.
        // Let's just create the booking first as per plan.

        res.status(201).json({ success: true, message: "Booking created successfully", booking: newBooking });
    } catch (error) {
        console.error("Error creating booking:", error);
        res.status(500).json({ success: false, message: "Internal Server Error" });
    }
};

// Get user bookings
export const getUserBookings = async (req, res) => {
    try {
        const userId = req.auth.userId;

        if (!userId) {
            return res.status(401).json({ success: false, message: "Unauthorized" });
        }

        const bookings = await Booking.find({ userId })
            .populate({
                path: 'showtime',
                populate: [
                    { path: 'movie' },
                    { path: 'theater' }
                ]
            })
            .sort({ createdAt: -1 });

        res.status(200).json({ success: true, bookings });
    } catch (error) {
        console.error("Error fetching bookings:", error);
        res.status(500).json({ success: false, message: "Internal Server Error" });
    }
};

// Get all bookings (Admin)
export const getAllBookings = async (req, res) => {
    try {
        const bookings = await Booking.find({})
            .populate({
                path: 'showtime',
                populate: [
                    { path: 'movie' },
                    { path: 'theater' }
                ]
            })
            .sort({ createdAt: -1 });

        res.status(200).json({ success: true, bookings });
    } catch (error) {
        console.error("Error fetching all bookings:", error);
        res.status(500).json({ success: false, message: "Internal Server Error" });
    }
};
// Delete a booking (Cancel)
export const deleteBooking = async (req, res) => {
    try {
        const { id } = req.params;
        const userId = req.auth.userId;

        const booking = await Booking.findById(id);

        if (!booking) {
            return res.status(404).json({ success: false, message: "Booking not found" });
        }

        // Ensure user owns the booking
        if (booking.userId !== userId) {
            return res.status(403).json({ success: false, message: "Unauthorized to cancel this booking" });
        }

        // Ensure booking is not paid (optional logic, usually paid bookings need refund flow)
        if (booking.isPaid) {
            return res.status(400).json({ success: false, message: "Cannot cancel paid booking directly" });
        }

        await Booking.findByIdAndDelete(id);

        res.status(200).json({ success: true, message: "Booking cancelled successfully" });
    } catch (error) {
        console.error("Error cancelling booking:", error);
        res.status(500).json({ success: false, message: "Internal Server Error" });
    }
};
// Get occupied seats for a showtime
export const getOccupiedSeats = async (req, res) => {
    try {
        const { showtimeId } = req.params;

        if (!showtimeId) {
            return res.status(400).json({ success: false, message: "Showtime ID is required" });
        }

        // Find all PAID bookings for this showtime
        const bookings = await Booking.find({ showtime: showtimeId, isPaid: true });

        // Collect all seats (bookings returns array of bookings, each has seats array)
        // Flatten the array of seat arrays
        const occupiedSeats = bookings.flatMap(booking => booking.seats);

        res.status(200).json({ success: true, occupiedSeats });
    } catch (error) {
        console.error("Error fetching occupied seats:", error);
        res.status(500).json({ success: false, message: "Internal Server Error" });
    }
};
