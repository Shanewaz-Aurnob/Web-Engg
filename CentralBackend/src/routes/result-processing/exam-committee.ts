import express, { Request, Response } from "express";
const examCommitteeRouter = express.Router();
import db from "../../database";
import { paginatedResults } from "../../helper/paginatedResults";
import { z } from "zod";
import { verifySession } from "../../middlewares/verifySession";
import {
  PermissionRequest,
  Role,
  checkPermissions,
} from "../../middlewares/checkPermissions";
import { addFiltration } from "../../helper/addFiltration";
import { sql } from "kysely";

examCommitteeRouter.get(
  "/",
  //   verifySession,
  //   checkPermissions,
  async (req, res) => {
    try {
      var query = db
        .selectFrom("Exam_Committee")
        .innerJoin("Teacher", "Exam_Committee.teacher_id", "Teacher.teacher_id")
        .innerJoin("User", "User.user_id", "Teacher.user_id")
        .innerJoin("Exam", "Exam.exam_id", "Exam_Committee.exam_id")
        .innerJoin(
          "Department",
          "Department.department_id",
          "Teacher.department_id",
        )
        .innerJoin(
          "University",
          "University.university_id",
          "Department.university_id",
        )
        .selectAll();
      query = addFiltration("Exam_Committee", query, req);
      query = addFiltration("User", query, req);
      query = addFiltration("University", query, req);
      query = addFiltration("Department", query, req);
      query = addFiltration("Exam", query, req);

      paginatedResults(query, req, res);
    } catch (error) {
      console.log(error);
      res.status(500).json({ message: "Internal server error", error });
    }
  },
);

// If the requesting user is a teacher, return his exam committee info
examCommitteeRouter.get(
  "/:id",
  verifySession,
  checkPermissions,
  async (req: PermissionRequest, res: Response) => {
    if (req.role != Role.Teacher) {
      return res.status(403).json({
        message:
          "You don't have enough permissions to access this information.",
      });
    }

    try {
      const teacher_id = z.coerce.number().parse(req.params.id);

      const data = await db
        .selectFrom("Exam_Committee")
        .where("Exam_Committee.teacher_id", "=", teacher_id)
        .innerJoin("User", "Exam_Committee.teacher_id", "User.user_id")
        .executeTakeFirst();

      if (!data) {
        return res.status(404).json({
          message: "Exam committee member with id " + teacher_id + " not found",
        });
      }

      return res.status(200).json(data);
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

const examCommtteePostBody = z.object({
  memberList: z.array(
    z.object({
      teacher_id: z.coerce.number(),
      role: z.enum(["Chairman", "Member", "Tabulator"]),
    }),
  ),
  program: z.coerce.number(),
  session: z.string(),
  semester: z.coerce.number(),
});

examCommitteeRouter.post("/", async (req, res) => {
  try {
    const reqBody = examCommtteePostBody.parse(req.body);

    const exam_id = await db
      .selectFrom("Academic_Session")
      .innerJoin(
        "Exam",
        "Exam.academic_session_id",
        "Academic_Session.academic_session_id",
      )
      .where("program_id", "=", reqBody.program)
      .where("exam_session", "=", reqBody.session)
      .where("semester", "=", reqBody.semester)
      .select("exam_id")
      .executeTakeFirst();

    if (exam_id === null || exam_id === undefined) {
      return res.status(404).json({ message: "Exam not found." });
    }

    const processedData = reqBody.memberList.map((member) => {
      return {
        exam_id: exam_id?.exam_id,
        teacher_id: member.teacher_id,
        role: member.role,
      };
    });

    await db.insertInto("Exam_Committee").values(processedData).execute();

    await db
      .updateTable("Exam")
      .set({ committee_created: 1 })
      .where("exam_id", "=", exam_id?.exam_id)
      .execute();

    return res
      .status(201)
      .json({ success: true, message: "Exam committee created successfully" });
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

examCommitteeRouter.get("/:id/assigned-exams", async (req, res) => {
  try {
    const teacher_id = z.coerce.number().parse(req.params.id);

    var query = db
      .selectFrom("Exam_Committee")
      .innerJoin("Exam", "Exam.exam_id", "Exam_Committee.exam_id")
      .innerJoin(
        "Academic_Session",
        "Academic_Session.academic_session_id",
        "Exam.academic_session_id",
      )
      .where("Exam_Committee.teacher_id", "=", teacher_id)
      .select([
        sql<string>`(SELECT COUNT(*) FROM Courses_in_Semester WHERE Courses_in_Semester.academic_session_id = Exam.academic_session_id)`.as(
          "total_courses",
        ),
        sql<string>`(SELECT COUNT(*) FROM Courses_in_Semester WHERE Courses_in_Semester.academic_session_id = Exam.academic_session_id AND Courses_in_Semester.result_status = 'Completed')`.as(
          "completed_courses",
        ),
      ])
      .selectAll(["Exam_Committee"])
      .select([
        "Academic_Session.semester",
        "Exam.exam_name",
        "Exam.exam_session",
      ]);

    query = addFiltration("Exam", query, req);
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

examCommitteeRouter.get("/:session/:semester", async (req, res) => {
  try {
    const session = z.coerce.string().parse(req.params.session);
    const semester = z.coerce.number().parse(req.params.semester);

    const data = await db
      .selectFrom("Exam")
      .innerJoin("Exam_Committee", "Exam_Committee.exam_id", "Exam.exam_id")
      .innerJoin(
        "Academic_Session",
        "Academic_Session.academic_session_id",
        "Exam.academic_session_id",
      )
      .innerJoin("Teacher", "Teacher.teacher_id", "Exam_Committee.teacher_id")
      .innerJoin("User", "Teacher.user_id", "User.user_id")
      .innerJoin(
        "Department",
        "Department.department_id",
        "Teacher.department_id",
      )
      .innerJoin(
        "University",
        "University.university_id",
        "Department.university_id",
      )
      .where("Exam.exam_session", "=", session)
      .where("Academic_Session.semester", "=", semester)
      .selectAll(["Exam", "Exam_Committee", "Teacher", "Department"])
      .select(["User.first_name", "User.last_name", "email", "phone"])
      .execute();

    res.status(200).json(data);
  } catch (error) {
    if (error instanceof z.ZodError) {
      return res.status(400).json({
        name: "Invalid data type.",
        message: JSON.parse(error.message),
      });
    }
  }
});

export default examCommitteeRouter;
