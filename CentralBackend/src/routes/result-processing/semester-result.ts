import express, { Request, Response } from "express";
import { z } from "zod";
import db from "../../database";
import { addFiltration } from "../../helper/addFiltration";

const semesterResultRouter = express.Router();

const semesterResultReqBody = z.object({
  academic_session_id: z.number(),
  cgpa: z.number(),
  student_id: z.number(),
});
semesterResultRouter.post("/", async (req, res) => {
  try {
    const { academic_session_id, cgpa, student_id } =
      semesterResultReqBody.parse(req.body);
    const data = await db
      .insertInto("Semester_Result")
      .values({
        academic_session_id,
        cgpa,
        student_id,
      })
      .execute();
    res
      .status(201)
      .json({ success: true, message: "Semester result added successfully" });
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

semesterResultRouter.get("/", async (req, res) => {
  try {
    var query = db
      .selectFrom("Semester_Result")
      .innerJoin(
        "Academic_Session",
        "Academic_Session.academic_session_id",
        "Semester_Result.academic_session_id",
      )
      .innerJoin("Student", "Student.student_id", "Semester_Result.student_id")
      .innerJoin(
        "Exam",
        "Academic_Session.academic_session_id",
        "Exam.academic_session_id",
      );

    query = addFiltration("Student", query, req);
    query = addFiltration("Academic_Session", query, req);

    const data = await query.selectAll().execute();
    res.status(200).json(data);
  } catch (error) {
    return res.status(500).json({ message: "Internal server error", error });
  }
});

export default semesterResultRouter;
