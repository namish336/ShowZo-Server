import express from "express";
import { getAllTheaters } from "../controllers/theater.controller.js";

const router = express.Router();

router.get("/", getAllTheaters);

export default router;
