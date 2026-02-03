import express from "express";
import {
    createCollection,
    getCollections,
    addMovieToCollection,
    removeMovieFromCollection,
    deleteCollection
} from "../controllers/collection.controller.js";

const router = express.Router();

router.post("/", createCollection);
router.get("/", getCollections);
router.post("/add", addMovieToCollection);
router.delete("/:collectionId/movie/:movieId", removeMovieFromCollection);
router.delete("/:collectionId", deleteCollection);

export default router;
