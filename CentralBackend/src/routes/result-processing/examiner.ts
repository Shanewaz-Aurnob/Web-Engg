import express, { query, Request, Response } from "express";
import db from "../../database";
import { date, z } from "zod";
import { addFiltration } from "../../helper/addFiltration";

const examinerRouter = express.Router();

const ExaminerBody = z.object({
  exam_id: z.coerce.number(),
  course_id: z.coerce.number(),
  teacher_id: z.coerce.number(),
  set: z.enum(["A", "B"]),
});

examinerRouter.post("/", async (req, res) => {
  try {
    const { exam_id, course_id, teacher_id, set } = ExaminerBody.parse(
      req.body,
    );

    await db
      .insertInto("Examiner")
      .values({
        exam_id,
        course_id,
        teacher_id,
        set,
      })
      .execute();

    res
      .status(201)
      .json({ success: true, message: "Examiner assigned successfully" });
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

examinerRouter.get("/", async (req, res) => {
  try {
    var query = db
      .selectFrom("Examiner")
      .innerJoin("Teacher", "Teacher.teacher_id", "Examiner.teacher_id")
      .innerJoin("Course", "Course.course_id", "Examiner.course_id")
      .innerJoin("Exam", "Exam.exam_id", "Examiner.exam_id")
      .innerJoin(
        "Academic_Session",
        "Exam.academic_session_id",
        "Academic_Session.academic_session_id",
      )
      .innerJoin(
        "Department",
        "Department.department_id",
        "Exam.department_id",
      );

    query = addFiltration("Examiner", query, req);
    query = addFiltration("Teacher", query, req);
    query = addFiltration("Course", query, req);

    const data = await query
      .selectAll(["Examiner", "Course"])
      .select([
        "Exam.exam_name",
        "Exam.exam_session",
        "Department.department_abbr",
        "Department.department_name",
        "semester",
      ])
      .execute();

    res.status(200).json(data);
  } catch (error) {
    res.status(500).json({ message: "Internal server error", error });
  }
});

examinerRouter.get("/:exam_id/:course_id/:set", async (req, res) => {
  try {
    const exam_id = z.coerce.number().parse(req.params.exam_id);
    const course_id = z.coerce.number().parse(req.params.course_id);
    const set = z.enum(["A", "B"]).parse(req.params.set);
    const data = await db
      .selectFrom("Examiner")
      .innerJoin("Teacher", "Teacher.teacher_id", "Examiner.teacher_id")
      .innerJoin("User", "User.user_id", "Teacher.user_id")
      .where("Examiner.exam_id", "=", exam_id)
      .where("Examiner.course_id", "=", course_id)
      .where("Examiner.set", "=", set)
      .select([
        "Examiner.assigned_date",
        "User.first_name",
        "User.last_name",
        "Examiner.is_submitted",
        "Teacher.designation",
        "submit_date",
      ])
      .executeTakeFirst();

    if (!data) {
      return res.status(200).json({
        examiner_assigned: false,
      });
    }

    res.status(200).json(data);
  } catch (error) {
    res.status(500).json({ message: "Internal server error", error });
  }
});

export default examinerRouter;
