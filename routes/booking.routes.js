import express from "express";
import { createBooking, getUserBookings, getAllBookings, deleteBooking, getOccupiedSeats } from "../controllers/booking.controller.js";

const router = express.Router();

router.post("/", createBooking);
router.get("/my-bookings", getUserBookings);
router.delete("/:id", deleteBooking);
router.get("/all-bookings", getAllBookings); // Admin route
router.get("/occupied/:showtimeId", getOccupiedSeats);

export default router;
