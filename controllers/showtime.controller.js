import Showtime from "../models/Showtime.js";
import Movie from "../models/Movie.js";
import Theater from "../models/Theater.js";

// Create a new showtime
// Create a new showtime for ALL theaters
export const createShowtime = async (req, res) => {
    try {
        const { movie, price, showTime, theater: theaterId } = req.body;

        if (!movie || !price || !showTime) {
            return res.status(400).json({
                success: false,
                message: "Please provide all required fields"
            });
        }

        let theaters = [];

        if (theaterId) {
            const specificTheater = await Theater.findById(theaterId);
            if (!specificTheater) {
                return res.status(404).json({
                    success: false,
                    message: "Selected theater not found"
                });
            }
            theaters = [specificTheater];
        } else {
            // Fetch all theaters if no specific theater is selected
            theaters = await Theater.find({});
        }

        if (theaters.length === 0) {
            return res.status(404).json({
                success: false,
                message: "No theaters found to create shows for"
            });
        }

        const showtimePromises = theaters.map(async (theater) => {
            const newShowtime = new Showtime({
                movie,
                theater: theater._id,
                showTime: new Date(showTime),
                price,
                totalSeats: 100, // Default seats
                availableSeats: 100
            });
            return newShowtime.save();
        });

        await Promise.all(showtimePromises);

        res.status(201).json({
            success: true,
            message: `Showtime created successfully for ${theaters.length} theater(s)`
        });

    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
};

// Get all showtimes or filter by movie and date
export const getAllShowtimes = async (req, res) => {
    try {
        const { movie, date, theater } = req.query;
        let query = {};

        if (movie) {
            query.movie = movie;
        }

        if (theater) {
            query.theater = theater;
        }

        if (date) {
            // Filter by specific date (ignoring time)
            const startDate = new Date(date);
            startDate.setHours(0, 0, 0, 0);

            const endDate = new Date(date);
            endDate.setHours(23, 59, 59, 999);

            query.showTime = {
                $gte: startDate,
                $lte: endDate
            };
        }

        const showtimes = await Showtime.find(query)
            .populate('theater', 'name location')
            .populate('movie', 'title poster_path')
            .sort({ showTime: 1 });

        res.status(200).json({
            success: true,
            showtimes
        });

    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
};
// Delete a showtime
export const deleteShowtime = async (req, res) => {
    try {
        const { id } = req.params;

        const showtime = await Showtime.findById(id);

        if (!showtime) {
            return res.status(404).json({
                success: false,
                message: "Showtime not found"
            });
        }

        await Showtime.findByIdAndDelete(id);

        res.status(200).json({
            success: true,
            message: "Showtime deleted successfully"
        });

    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
};
