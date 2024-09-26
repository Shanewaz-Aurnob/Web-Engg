import express, { Request, Response } from "express";
import { z } from "zod";
import db from "../../database";
import { Course } from "../../types/CoreTables";

const marksheetRouter = express.Router();

marksheetRouter.get("/:exam_id/:course_id", async (req, res) => {
  try {
    const exam_id = z.coerce.number().parse(req.params.exam_id);
    const course_id = z.coerce.number().parse(req.params.course_id);

    const data = await db
      .selectFrom("Marksheet")
      .innerJoin("Form", (join) =>
        join
          .onRef("Form.exam_id", "=", "Marksheet.exam_id")
          .onRef("Form.student_id", "=", "Marksheet.student_id"),
      )
      .where("Marksheet.exam_id", "=", exam_id)
      .where("Marksheet.course_id", "=", course_id)
      .selectAll("Marksheet")
      .select("student_status")
      .execute();

    const processedData = data.map((data) => {
      return {
        student_id: data.student_id,
        fem: data.fem,
        catm: data.catm,
        gpa: data.gpa,
        student_status: data.student_status,
      };
    });

    res.status(200).json(processedData);
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

marksheetRouter.get("/:exam_id", async (req, res) => {
  try {
    const exam_id = z.coerce.number().parse(req.params.exam_id);
    const data = await db
      .selectFrom("Marksheet")
      .innerJoin("Form", (join) =>
        join
          .onRef("Form.exam_id", "=", "Marksheet.exam_id")
          .onRef("Form.student_id", "=", "Marksheet.student_id"),
      )
      .innerJoin("Student", "Student.student_id", "Form.student_id")
      .innerJoin("Hall", "Hall.hall_id", "Student.hall_id")
      .innerJoin("Exam", "Form.exam_id", "Exam.exam_id")
      .innerJoin(
        "Academic_Session",
        "Academic_Session.academic_session_id",
        "Exam.academic_session_id",
      )
      .innerJoin("User", "User.user_id", "Student.user_id")
      .where("Marksheet.exam_id", "=", exam_id)
      .select([
        "student_status",
        "Marksheet.course_id",
        "fem",
        "catm",
        "Marksheet.student_id",
        "course_id",
        "hall_name",
        "session",
        "first_name",
        "last_name",
        "gpa",
      ])
      .execute();

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

export default marksheetRouter;
