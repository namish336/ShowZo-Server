import express from "express";
import { createShowtime, getAllShowtimes, deleteShowtime, bulkDeleteShowtimes } from "../controllers/showtime.controller.js";

const router = express.Router();

router.post("/", createShowtime);
router.get("/", getAllShowtimes);
router.post("/bulk-delete", bulkDeleteShowtimes);
router.delete("/:id", deleteShowtime);

export default router;
