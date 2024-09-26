import express, { Request, Response } from "express";
import { z } from "zod";
import db from "../../database";
import { addFiltration } from "../../helper/addFiltration";

const questionMarkRouter = express.Router();

const questionMarkListItem = z.object({
  paper_code: z.coerce.number(),
  q_no: z.string(),
  q_mark: z.coerce.number(),
});

const questionMarkPostBody = z.object({
  exam_id: z.coerce.number(),
  course_id: z.coerce.number(),
  set: z.enum(["A", "B"]),
  questionMarkList: z.array(questionMarkListItem),
});

questionMarkRouter.post("/", async (req, res) => {
  try {
    const reqBody = questionMarkPostBody.parse(req.body);

    const proccessedData = reqBody.questionMarkList.map((item) => {
      return {
        exam_id: reqBody.exam_id,
        course_id: reqBody.course_id,
        set: reqBody.set,
        paper_code: item.paper_code,
        q_no: item.q_no,
        q_mark: item.q_mark,
      };
    });

    await db.transaction().execute(async (trx) => {
      await trx.insertInto("Question_Mark").values(proccessedData).execute();

      await trx
        .updateTable("Examiner")
        .set("Examiner.is_submitted", 1)
        .set("Examiner.submit_date", new Date())
        .where("Examiner.exam_id", "=", reqBody.exam_id)
        .where("Examiner.course_id", "=", reqBody.course_id)
        .where("Examiner.set", "=", reqBody.set)
        .execute();

      const { academic_session_id } = await trx
        .selectFrom("Exam")
        .where("Exam.exam_id", "=", reqBody.exam_id)
        .select("academic_session_id")
        .executeTakeFirstOrThrow();

      await trx
        .updateTable("Courses_in_Semester")
        .set(
          reqBody.set === "A"
            ? "Courses_in_Semester.set_A_sumitted"
            : "Courses_in_Semester.set_A_sumitted",
          1,
        )
        .where("course_id", "=", reqBody.course_id)
        .where(
          "Courses_in_Semester.academic_session_id",
          "=",
          academic_session_id,
        )
        .execute();
    });

    return res
      .status(201)
      .json({ success: true, message: "Question mark added successfully" });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return res.status(400).json({
        name: "Invalid data type.",
        message: JSON.parse(error.message),
      });
    }
  }
});

questionMarkRouter.get("/", async (req, res) => {
  try {
    var query = db.selectFrom("Question_Mark");

    query = addFiltration("Question_Mark", query, req);

    const result = await query.selectAll().execute();
    const proccessedData = result.map((item) => {
      return {
        paper_code: item.paper_code,
        q_no: item.q_no,
        q_mark: item.q_mark,
      };
    });

    return res.status(200).json(proccessedData);
  } catch (error) {
    res.status(500).json({ message: "Internal server error", error });
  }
});

export default questionMarkRouter;
