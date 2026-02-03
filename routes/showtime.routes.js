import express from "express";
import { createShowtime, getAllShowtimes, deleteShowtime } from "../controllers/showtime.controller.js";

const router = express.Router();

router.post("/add", createShowtime);
router.get("/", getAllShowtimes);
router.delete("/:id", deleteShowtime);

export default router;
