import express from "express";
import { z } from "zod";
import db, { Database, TableName } from "../database";
import { addFiltration } from "../helper/addFiltration";
import { SelectQueryBuilder } from "kysely";
import { paginatedResults } from "../helper/paginatedResults";

const courseSemesterRouter = express.Router();

courseSemesterRouter.get("/", async (req, res) => {
  try {
    var query = db
      .selectFrom("Courses_in_Semester")
      .innerJoin("Course", "Courses_in_Semester.course_id", "Course.course_id")
      .innerJoin(
        "Academic_Session",
        "Academic_Session.academic_session_id",
        "Courses_in_Semester.academic_session_id",
      )
      .selectAll();

    query = addFiltration(
      "Courses_in_Semester",
      query as SelectQueryBuilder<Database, TableName, {}>,
      req,
    ) as any;

    paginatedResults(query, req, res);
  } catch (error) {
    res.status(500).json({ message: "Internal server error", error });
  }
});

courseSemesterRouter.get("/:exam_id", async (req, res) => {
  try {
    const exam_id = z.coerce.number().parse(req.params.exam_id);
    var query = db
      .selectFrom("Courses_in_Semester")
      .innerJoin("Course", "Course.course_id", "Courses_in_Semester.course_id")
      .innerJoin(
        "Academic_Session",
        "Academic_Session.academic_session_id",
        "Courses_in_Semester.academic_session_id",
      )
      .innerJoin(
        "Exam",
        "Exam.academic_session_id",
        "Academic_Session.academic_session_id",
      )
      .innerJoin("Program", "Program.program_id", "Academic_Session.program_id")
      .innerJoin(
        "Department",
        "Department.department_id",
        "Course.department_id",
      )
      .selectAll(["Courses_in_Semester", "Course"])
      .select([
        "program_name",
        "program_abbr",
        "department_abbr",
        "department_name",
      ])
      .where("exam_id", "=", exam_id);

    query = addFiltration("Course", query, req);
    query = addFiltration("Courses_in_Semester", query, req);

    const data = await query.execute();
    res.status(200).json(data);
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
export default courseSemesterRouter;
