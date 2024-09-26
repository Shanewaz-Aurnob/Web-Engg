import express from "express";
import db from "../database";
import { z } from "zod";

const universityRouter = express.Router();

universityRouter.get("/", async (req, res) => {
  try {
    const data = await db.selectFrom("University").selectAll().execute();
    res.status(200).json(data);
  } catch (error) {
    res.status(500).json({ message: "Internal server error", error });
  }
});

universityRouter.get("/:id", async (req, res) => {
  try {
    const university_id = z.coerce.number().parse(req.params.id);

    const data = await db
      .selectFrom("University")
      .where("University.university_id", "=", university_id)
      .selectAll()
      .executeTakeFirst();

    if (!data) {
      return res.status(404).json({
        message: "University with id " + university_id + " not found",
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

export default universityRouter;
