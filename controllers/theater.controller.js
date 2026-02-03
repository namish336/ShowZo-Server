import Theater from "../models/Theater.js";

export const getAllTheaters = async (req, res) => {
    try {
        const theaters = await Theater.find({ isActive: true });
        res.status(200).json({
            success: true,
            theaters
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
};
