import express from "express";
import { inngest } from "../inngest/index.js";

const router = express.Router();

router.post("/clerk", async (req, res) => {
  const event = req.body;

  if (event.type === "user.created") {
    await inngest.send({
      name: "clerk/user.created",
      data: event.data,
    });
  }

  if (event.type === "user.updated") {
    await inngest.send({
      name: "clerk/user.updated",
      data: event.data,
    });
  }

  if (event.type === "user.deleted") {
    await inngest.send({
      name: "clerk/user.deleted",
      data: event.data,
    });
  }

  res.status(200).json({ ok: true });
});

export default router;
