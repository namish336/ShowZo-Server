import mongoose from "mongoose";
import "dotenv/config";

async function testConnection() {
    try {
        console.log("URI:", process.env.MONGODB_URI);
        await mongoose.connect(process.env.MONGODB_URI);
        console.log("Connection successful!");
        process.exit(0);
    } catch (err) {
        console.error("Connection error:", err);
        process.exit(1);
    }
}
testConnection();
