import express from "express";
import { z } from "zod";
import db from "../database";
const hallRouter = express.Router();

hallRouter.get("/", async (req, res) => {
  try {
    const data = await db.selectFrom("Hall").selectAll().execute();

    res.status(200).json(data);
  } catch (error) {
    res.status(500).json({ message: "Internal server error", error });
  }
});

hallRouter.get("/:id", async (req, res) => {
  try {
    const hall_id = z.coerce.number().parse(req.params.id);

    const data = await db
      .selectFrom("Hall")
      .where("Hall.hall_id", "=", hall_id)
      .selectAll()
      .executeTakeFirst();

    if (!data) {
      return res.status(404).json({
        message: "Hall with id " + hall_id + " not found",
      });
    }

    res.status(200).json(data);
  } catch (error) {
    if (error instanceof z.ZodError) {
      return res.status(400).json({
        name: "Invalid data type.",
        message: JSON.parse(error.message),
      });
    }

    res.status(500).json({ message: "Internal server error", error });
  }
});

export default hallRouter;
