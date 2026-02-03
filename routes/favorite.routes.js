import express from "express";
import { addToFavorites, removeFromFavorites, getFavorites } from "../controllers/favorite.controller.js";

const router = express.Router();

router.post("/", addToFavorites);
router.delete("/:movieId", removeFromFavorites);
router.get("/", getFavorites);

export default router;
