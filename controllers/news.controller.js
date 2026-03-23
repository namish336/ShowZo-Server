import News from "../models/News.js";

export const getAllNews = async (req, res) => {
    try {
        const news = await News.find().sort({ createdAt: -1 });
        res.status(200).json({ success: true, news });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

export const getNewsById = async (req, res) => {
    try {
        const news = await News.findById(req.params.id);
        if (!news) {
            return res.status(444).json({ success: false, message: "News not found" });
        }
        res.status(200).json({ success: true, news });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

export const createNews = async (req, res) => {
    try {
        const { title, description, image, category, date, content } = req.body;
        const newNews = new News({ title, description, image, category, date, content });
        await newNews.save();
        res.status(201).json({ success: true, news: newNews });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

export const updateNews = async (req, res) => {
    try {
        const { id } = req.params;
        const updatedNews = await News.findByIdAndUpdate(id, req.body, { new: true });
        res.status(200).json({ success: true, news: updatedNews });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

export const deleteNews = async (req, res) => {
    try {
        const { id } = req.params;
        await News.findByIdAndDelete(id);
        res.status(200).json({ success: true, message: "News deleted successfully" });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};
