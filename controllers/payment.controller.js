import Booking from "../models/Booking.js";
import Stripe from "stripe";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

// Create Payment Intent
export const createPaymentIntent = async (req, res) => {
    try {
        const { bookingId } = req.body;
        const userId = req.auth.userId;

        if (!bookingId) {
            return res.status(400).json({ success: false, message: "Booking ID is required" });
        }

        const booking = await Booking.findById(bookingId);
        if (!booking) {
            return res.status(404).json({ success: false, message: "Booking not found" });
        }

        if (booking.userId !== userId) {
            return res.status(403).json({ success: false, message: "Unauthorized access to this booking" });
        }

        if (booking.isPaid) {
            return res.status(400).json({ success: false, message: "Booking is already paid" });
        }

        // Amount calculation (assuming INR x 100 for paisa)
        // If booking.amount is 500 (INR), stripe needs 50000
        const amount = Math.round(booking.amount * 100);

        const paymentIntent = await stripe.paymentIntents.create({
            amount: amount,
            currency: "inr",
            metadata: { bookingId: booking._id.toString() },
            automatic_payment_methods: {
                enabled: true,
            },
        });

        res.status(200).json({
            success: true,
            clientSecret: paymentIntent.client_secret,
        });

    } catch (error) {
        console.error("Error creating payment intent:", error);
        res.status(500).json({ success: false, message: "Internal Server Error" });
    }
};

// Confirm Payment
export const confirmPayment = async (req, res) => {
    try {
        const { bookingId, paymentIntentId } = req.body;

        if (!bookingId || !paymentIntentId) {
            return res.status(400).json({ success: false, message: "Missing required fields" });
        }

        const booking = await Booking.findById(bookingId);
        if (!booking) {
            return res.status(404).json({ success: false, message: "Booking not found" });
        }

        // Verify with Stripe
        const paymentIntent = await stripe.paymentIntents.retrieve(paymentIntentId);

        if (paymentIntent.status !== 'succeeded') {
            return res.status(400).json({ success: false, message: "Payment verification failed. Status: " + paymentIntent.status });
        }

        // Update booking
        booking.isPaid = true;
        booking.paymentIntentId = paymentIntentId;
        await booking.save();

        res.status(200).json({ success: true, message: "Payment confirmed successfully", booking });

    } catch (error) {
        console.error("Error confirming payment:", error);
        res.status(500).json({ success: false, message: "Internal Server Error" });
    }
};
