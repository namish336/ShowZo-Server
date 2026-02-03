import express from "express";
import { getMovieById, getAllMovies, updateMovie } from "../controllers/movies.controller.js";

const router = express.Router();

router.get("/", getAllMovies);
router.get("/:id", getMovieById);
router.put("/:id", updateMovie);

export default router;
