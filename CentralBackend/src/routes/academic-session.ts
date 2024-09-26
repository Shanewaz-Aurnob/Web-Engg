import express, { Request, Response } from "express";
import { z } from "zod";
import db from "../database";
import { addFiltration } from "../helper/addFiltration";

const academicSessionRouter = express.Router();

const academicSessionReqBody = z.object({
  session: z.string(),
  semester: z.number(),
  program_id: z.number(),
});

academicSessionRouter.post("/", async (req, res) => {
  try {
    const reqBody = academicSessionReqBody.parse(req.body);
    await db
      .insertInto("Academic_Session")
      .values(reqBody as any)
      .execute();
    return res.status(201).json({
      success: true,
      message: "Academic session created successfully",
    });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return res.status(400).json({
        name: "Invalid data type.",
        message: JSON.parse(error.message),
      });
    }
    return res.status(500).json({ message: "Internal server error", error });
  }
});

academicSessionRouter.get("/", async (req, res) => {
  try {
    var query = db.selectFrom("Academic_Session");

    query = addFiltration("Academic_Session", query, req);

    const data = await query.selectAll().execute();

    return res.status(200).json(data);
  } catch (error) {
    return res.status(500).json({ message: "Internal server error", error });
  }
});

export default academicSessionRouter;
