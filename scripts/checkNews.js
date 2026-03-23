import mongoose from 'mongoose';
import 'dotenv/config';

const newsSchema = new mongoose.Schema({
    title: { type: String, required: true },
    description: { type: String, required: true },
    image: { type: String, required: true },
    category: { type: String, default: "General" },
    date: { type: String, required: true },
    content: { type: String },
}, { timestamps: true });

const News = mongoose.model("News", newsSchema);

const checkNews = async () => {
    try {
        await mongoose.connect(process.env.MONGODB_URI);
        console.log("Connected to MongoDB");
        const news = await News.find().sort({ createdAt: -1 });
        console.log(`Found ${news.length} news articles:`);
        news.forEach((item, index) => {
            console.log(`${index + 1}. Title: ${item.title}, ID: ${item._id}`);
        });
        process.exit(0);
    } catch (error) {
        console.error("Error:", error);
        process.exit(1);
    }
};

checkNews();
