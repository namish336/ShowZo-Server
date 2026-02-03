import express from "express";
import {
  importShows,
  getShows,
  getSingleShow
} from "../controllers/showController.js";

const router = express.Router();

// Import movies from OMDb
router.get("/import", importShows);

// Get all movies
router.get("/", getShows);

// Get single movie
router.get("/:id", getSingleShow);

export default router;
