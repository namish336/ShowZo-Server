import mongoose from "mongoose";

const newsSchema = new mongoose.Schema({
    title: { type: String, required: true },
    description: { type: String, required: true },
    image: { type: String, required: true },
    category: { type: String, default: "General" },
    date: { type: String, required: true },
    content: { type: String }, // Optional full article content
}, { timestamps: true });

const News = mongoose.models.News || mongoose.model("News", newsSchema);

export default News;
