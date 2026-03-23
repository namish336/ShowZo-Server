import express from "express";
import cors from "cors";
import "dotenv/config";
import connectDB from "./configs/db.js";
import { clerkMiddleware } from '@clerk/express'
import { serve } from "inngest/express";
import { inngest, functions } from "./inngest/index.js"
import webhookRouter from "./webhooks/clerk.js";
//import showRouter from "./routes/showRoutes.js";
import showRoutes from "./routes/showRoutes.js";
import movieRoutes from "./routes/movies.routes.js";
import theaterRoutes from "./routes/theaters.routes.js";
import showtimeRoutes from "./routes/showtime.routes.js";
import bookingRoutes from "./routes/booking.routes.js";
import favoriteRoutes from "./routes/favorite.routes.js";
import collectionRoutes from "./routes/collection.routes.js";
import paymentRoutes from "./routes/payment.routes.js";
import dashboardRoutes from "./routes/dashboard.routes.js";
import newsRoutes from "./routes/news.routes.js";


const app = express();
const port = 3000;

await connectDB()
// Middleware
app.use(express.json());
app.use(cors());
app.use("/api/webhooks", webhookRouter);
app.use(clerkMiddleware())

app.use("/api/inngest", serve({ client: inngest, functions }));
// API Routes
app.get("/", (req, res) => res.send("Server is Live!"))
app.use("/api/inngest", serve({ client: inngest, functions }));
app.use("/api/shows", showRoutes);
app.use("/api/movies", movieRoutes);
app.use("/api/theaters", theaterRoutes);
app.use("/api/showtimes", showtimeRoutes);
app.use("/api/bookings", bookingRoutes);
app.use("/api/favorites", favoriteRoutes);
app.use("/api/collections", collectionRoutes);
app.use("/api/payments", paymentRoutes);
app.use("/api/dashboard", dashboardRoutes);
app.use("/api/news", newsRoutes);






app.listen(port, () =>
  console.log(`Server listening at http://localhost:${port}`)
);