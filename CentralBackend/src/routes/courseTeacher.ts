import express, { Request, Response } from "express";
import { z } from "zod";
import db from "../database";
import { addFiltration } from "../helper/addFiltration";

const courseTeacherRouter = express.Router();

courseTeacherRouter.get("/:teacher_id", async (req, res) => {
  try {
    const teacher_id = z.coerce.number().parse(req.params.teacher_id);
    var query = db
      .selectFrom("Course_Teacher")
      .innerJoin(
        "Academic_Session",
        "Course_Teacher.academic_session_id",
        "Academic_Session.academic_session_id",
      )
      .innerJoin("Course", "Course.course_id", "Course_Teacher.course_id")
      .innerJoin(
        "Exam",
        "Exam.academic_session_id",
        "Course_Teacher.academic_session_id",
      )
      .innerJoin(
        "Department",
        "Department.department_id",
        "Course.department_id",
      )
      .innerJoin("Program", "Program.program_id", "Academic_Session.program_id")
      .innerJoin("Courses_in_Semester", (join) =>
        join
          .onRef("Courses_in_Semester.course_id", "=", "Course.course_id")
          .onRef(
            "Courses_in_Semester.academic_session_id",
            "=",
            "Exam.academic_session_id",
          ),
      )
      .where("Course_Teacher.teacher_id", "=", teacher_id)
      .selectAll("Course")
      .select([
        "Academic_Session.session",
        "Exam.exam_session",
        "semester",
        "department_abbr",
        "department_name",
        "is_catm_submitted",
        "program_name",
        "program_abbr",
        "Exam.exam_id",
        "Academic_Session.academic_session_id",
      ]);

    query = addFiltration("Course", query, req);

    if (
      req.query.exam_id &&
      z.coerce.number().safeParse(req.query.exam_id).success
    ) {
      query = query.where(
        "Exam.exam_id",
        "=",
        z.coerce.number().parse(req.query.exam_id),
      );
    }

    const data = await query.execute();

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

courseTeacherRouter.get("/:exam_id/:course_id", async (req, res) => {
  try {
    const exam_id = z.coerce.number().parse(req.params.exam_id);
    const course_id = z.coerce.number().parse(req.params.course_id);
    var query = await db
      .selectFrom("Course_Teacher")
      .innerJoin("Teacher", "Teacher.teacher_id", "Course_Teacher.teacher_id")
      .innerJoin("User", "User.user_id", "Teacher.user_id")
      .innerJoin(
        "Department",
        "Department.department_id",
        "Teacher.department_id",
      )
      .innerJoin("Courses_in_Semester", (join) =>
        join
          .onRef(
            "Courses_in_Semester.course_id",
            "=",
            "Course_Teacher.course_id",
          )
          .onRef(
            "Courses_in_Semester.academic_session_id",
            "=",
            "Course_Teacher.academic_session_id",
          ),
      )
      .innerJoin(
        "Exam",
        "Exam.academic_session_id",
        "Courses_in_Semester.academic_session_id",
      )
      .where("Course_Teacher.course_id", "=", course_id)
      .where("Exam.exam_id", "=", exam_id)
      .select([
        "Teacher.title",
        "User.first_name",
        "User.last_name",
        "Teacher.designation",
        "Department.department_name",
        "Department.department_abbr",
        "Department.faculty",
        "User.email",
        "Courses_in_Semester.is_catm_submitted",
        "Course_Teacher.course_id",
        "Course_Teacher.academic_session_id",
      ])
      .executeTakeFirst();

    res.status(200).json(query);
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

export default courseTeacherRouter;
