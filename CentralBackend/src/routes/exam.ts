import express from "express";
import db from "../database";
import { addFiltration } from "../helper/addFiltration";
import { paginatedResults } from "../helper/paginatedResults";
import { SessionRequest, verifySession } from "../middlewares/verifySession";
import {
  checkPermissions,
  PermissionRequest,
  Role,
} from "../middlewares/checkPermissions";
import { z } from "zod";
const examRouter = express.Router();

examRouter.get("/", async (req, res) => {
  try {
    var query = db
      .selectFrom("Exam")
      .innerJoin("Department", "Exam.department_id", "Department.department_id")
      .innerJoin(
        "Academic_Session",
        "Exam.academic_session_id",
        "Academic_Session.academic_session_id",
      )
      .innerJoin("Program", "Academic_Session.program_id", "Program.program_id")
      .selectAll();

    query = addFiltration("Exam", query, req);
    query = addFiltration("Academic_Session", query, req);
    query = addFiltration("Department", query, req);

    paginatedResults(query, req, res);
    // res.send({data: query})
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Internal server error", error });
  }
});

examRouter.get(
  "/upcoming",
  verifySession,
  checkPermissions,
  async (req: PermissionRequest, res) => {
    if (req.role !== Role.Student)
      return res.status(403).json({
        message: "Only students are allowed to access this document.",
      });

    const data = await db
      .selectFrom("Exam")
      .innerJoin("Department", "Exam.department_id", "Department.department_id")
      .innerJoin(
        "Academic_Session",
        "Exam.academic_session_id",
        "Academic_Session.academic_session_id",
      )
      .innerJoin("Program", "Academic_Session.program_id", "Program.program_id")
      .innerJoin("Student", "Student.department_id", "Department.department_id")
      .where("Student.user_id", "=", req.session?.user_id!)
      .where("Exam.exam_end_date", "is", null)
      .select([
        "Exam.exam_id",
        "Department.department_id",
        "Academic_Session.academic_session_id",
        "Exam.exam_name",
        "Exam.exam_centre",
        "Exam.exam_session",
        "Exam.exam_end_date",
        "Exam.exam_start_date",
        "Exam.is_result_submitted",
        "Exam.result_submit_date",
        "Exam.committee_created",
        "Department.department_name",
        "Department.university_id",
        "Department.faculty",
        "Department.undergrad_semester_no",
        "Department.grad_semester_no",
        "Department.department_abbr",
        "Academic_Session.session",
        "Academic_Session.semester",
        "Program.program_id",
        "Program.program_name",
        "Program.program_abbr",
      ])
      .execute();

    return res.status(200).json(data);
  },
);

examRouter.get("/:id", async (req, res) => {
  try {
    const id = z.coerce.number().parse(req.params.id ?? 0);

    const exam = await db
      .selectFrom("Exam")
      .where("exam_id", "=", id)
      .innerJoin("Department", "Exam.department_id", "Department.department_id")
      .innerJoin(
        "Academic_Session",
        "Exam.academic_session_id",
        "Academic_Session.academic_session_id",
      )
      .innerJoin("Program", "Academic_Session.program_id", "Program.program_id")
      .selectAll()
      .executeTakeFirst();
    return res.status(200).json(exam);
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

examRouter.get(
  "/:id/form",
  // verifySession,
  // checkPermissions,
  async (req: PermissionRequest, res) => {
    try {
      const id = z.coerce.number().parse(req.params.id ?? 0);

      var formsQuery = db
        .selectFrom("Form")
        .where("exam_id", "=", id)
        .selectAll();
      formsQuery = addFiltration("Form", formsQuery, req);
      paginatedResults(formsQuery, req, res);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({
          name: "Invalid data type.",
          message: JSON.parse(error.message),
        });
      }

      return res.status(500).json({ message: "Internal server error", error });
    }
  },
);

examRouter.get(
  "/:id/course/:cid",
  // verifySession,
  // checkPermissions,
  async (req, res) => {
    try {
      const id = z.coerce.number().parse(req.params.id ?? 0);
      const cid = z.coerce.number().parse(req.params.cid ?? 0);

      var formsQuery = db
        .selectFrom("Form")
        .innerJoin("Form_Courses", "Form_Courses.form_id", "Form.form_id")
        .where("exam_id", "=", id)
        .where("course_id", "=", cid)
        .select(["Form.student_id", "Form.student_status"])
        .groupBy(["Form.student_id", "Form.student_status"]);
      formsQuery = addFiltration("Form", formsQuery, req);
      paginatedResults(formsQuery, req, res);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({
          name: "Invalid data type.",
          message: JSON.parse(error.message),
        });
      }

      return res.status(500).json({ message: "Internal server error", error });
    }
  },
);

export default examRouter;
