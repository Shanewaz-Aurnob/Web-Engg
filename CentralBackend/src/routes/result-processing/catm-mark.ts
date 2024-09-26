import express, { Request, Response } from "express";
import { z } from "zod";
import db from "../../database";

const catmMarkRouter = express.Router();

const catmMarkPostBody = z.array(
  z.object({
    student_id: z.coerce.number(),
    ct_mark: z.coerce.number(),
    attendance_mark: z.coerce.number(),
  }),
);

catmMarkRouter.post("/:exam_id/:course_id", async (req, res) => {
  try {
    const exam_id = z.coerce.number().parse(req.params.exam_id);
    const course_id = z.coerce.number().parse(req.params.course_id);

    const reqBody = catmMarkPostBody.parse(req.body.catmList);
    const processedData = reqBody.map((data) => {
      return {
        exam_id: exam_id,
        course_id: course_id,
        student_id: data.student_id,
        ct_mark: data.ct_mark,
        attendance_mark: data.attendance_mark,
      };
    });
    await db.transaction().execute(async (trx) => {
      await trx.insertInto("Catm_Mark").values(processedData).execute();

      const session_id = await db
        .selectFrom("Academic_Session")
        .innerJoin(
          "Exam",
          "Exam.academic_session_id",
          "Academic_Session.academic_session_id",
        )
        .where("Exam.exam_id", "=", exam_id)
        .select("Academic_Session.academic_session_id")
        .executeTakeFirstOrThrow()
        .then((data) => data.academic_session_id);

      await trx
        .updateTable("Courses_in_Semester")
        .set("is_catm_submitted", 1)
        .set("catm_submit_date", new Date())
        .where("course_id", "=", course_id)
        .where("Courses_in_Semester.academic_session_id", "=", session_id)
        .execute();
    });

    res.status(200).json({ message: "Data inserted successfully" });
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

catmMarkRouter.get("/:exam_id/:course_id", async (req, res) => {
  try {
    const exam_id = z.coerce.number().parse(req.params.exam_id);
    const course_id = z.coerce.number().parse(req.params.course_id);

    const data = await db
      .selectFrom("Catm_Mark")
      .where("course_id", "=", course_id)
      .where("exam_id", "=", exam_id)
      .selectAll()
      .execute();

    const processedData = data.map((data) => {
      return {
        student_id: data.student_id,
        ct_mark: data.ct_mark,
        attendance_mark: data.attendance_mark,
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

export default catmMarkRouter;
