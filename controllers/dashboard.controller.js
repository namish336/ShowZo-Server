import Booking from "../models/Booking.js";
import Showtime from "../models/Showtime.js";
import User from "../models/User.js";

export const getDashboardStats = async (req, res) => {
    try {
        // 1. Total Bookings
        const totalBookings = await Booking.countDocuments();

        // 2. Total Revenue (sum of amount of PAIND bookings)
        const revenueResult = await Booking.aggregate([
            { $match: { isPaid: true } },
            { $group: { _id: null, total: { $sum: "$amount" } } }
        ]);
        const totalRevenue = revenueResult.length > 0 ? revenueResult[0].total : 0;

        // 3. Active Shows (showTime > now)
        const now = new Date();
        const activeShowsCount = await Showtime.countDocuments({ showTime: { $gt: now } });

        // 4. Total Users
        const totalUsers = await User.countDocuments();

        // 5. Active Shows List (upcoming 4 shows) with details
        const activeShows = await Showtime.find({ showTime: { $gt: now } })
            .sort({ showTime: 1 })
            .limit(4)
            .populate('movie')
            .populate('theater');

        res.status(200).json({
            success: true,
            stats: {
                totalBookings,
                totalRevenue,
                activeShows: activeShowsCount,
                totalUser: totalUsers
            },
            activeShowsList: activeShows
        });

    } catch (error) {
        console.error("Error fetching dashboard stats:", error);
        res.status(500).json({ success: false, message: "Internal Server Error" });
    }
};
