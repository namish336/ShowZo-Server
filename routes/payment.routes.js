import express from "express";
import { createPaymentIntent, confirmPayment } from "../controllers/payment.controller.js";
import { requireAuth } from "@clerk/express";

const router = express.Router();

// Require authentication for all payment routes
// Assuming requireAuth or similar middleware enforces auth, or handled in controller via req.auth
// Looking at booking.routes.js might be helpful to see auth pattern. 
// In server.js: app.use(clerkMiddleware()) is used.
// In booking.controller.js: uses req.auth.userId.
// I will just use the router efficiently.

router.post("/create-payment-intent", createPaymentIntent);
router.post("/confirm-payment", confirmPayment);

export default router;
