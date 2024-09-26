import express, { Request, Response } from "express";
import { z } from "zod";
import db from "../../database";
import { addFiltration } from "../../helper/addFiltration";
import { sql } from "kysely";

const totalPaperMarkRouter = express.Router();

const totalPaperMarkListItem = z.object({
  paper_code: z.coerce.number(),
  student_id: z.coerce.number().optional(),
  total_mark: z.coerce.number(),
});

const totalPaperMarkPostBody = z.object({
  exam_id: z.coerce.number(),
  course_id: z.coerce.number(),
  set: z.enum(["A", "B"]),
  totalPaperMarkList: z.array(totalPaperMarkListItem),
});

totalPaperMarkRouter.post("/", async (req, res) => {
  try {
    const reqBody = totalPaperMarkPostBody.parse(req.body);

    const proccessedData = reqBody.totalPaperMarkList.map((item) => {
      return {
        exam_id: reqBody.exam_id,
        course_id: reqBody.course_id,
        set: reqBody.set,
        paper_code: item.paper_code,
        total_mark: item.total_mark,
      };
    });

    const query = await db
      .insertInto("Total_Paper_Mark")
      .values(proccessedData)
      .onDuplicateKeyUpdate({
        exam_id: reqBody.exam_id,
      })
      .execute();

    return res
      .status(201)
      .json({ success: true, message: "Total paper mark added successfully" });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return res.status(400).json({
        name: "Invalid data type.",
        message: JSON.parse(error.message),
      });
    }
  }
});

totalPaperMarkRouter.get("/", async (req, res) => {
  try {
    var query = db.selectFrom("Total_Paper_Mark");

    query = addFiltration("Total_Paper_Mark", query, req);
    const result = await query.selectAll().execute();

    const proccessedData = result.map((item) => {
      return {
        student_id: item.student_id,
        set: item.set,
        paper_code: item.paper_code,
      };
    });

    return res.status(200).json({
      exam_id: req.query.exam_id,
      course_id: req.query.course_id,
      set: req.query.set,
      totalPaperMarkList: proccessedData,
    });
  } catch (error) {
    res.status(500).json({ message: "Internal server error", error });
  }
});

totalPaperMarkRouter.get("/:exam_id/:course_id/:set", async (req, res) => {
  try {
    const exam_id = z.coerce.number().parse(req.params.exam_id);
    const course_id = z.coerce.number().parse(req.params.course_id);
    const set = z.enum(["A", "B"]).parse(req.params.set);

    const data = await db
      .selectFrom("Total_Paper_Mark")
      .where("exam_id", "=", exam_id)
      .where("course_id", "=", course_id)
      .where("set", "=", set)
      .select(["paper_code", "total_mark"])
      .execute();

    return res.status(200).json({
      exam_id: exam_id,
      course_id: course_id,
      set: set,
      totalPaperMarkList: data,
    });
  } catch (error) {
    res.status(500).json({ message: "Internal server error", error });
  }
});

const studentDecodeObject = z.object({
  student_id: z.number(),
  set: z.enum(["A", "B"]),
  paper_code: z.number(),
});

const totalPaperMarkDecodeBody = z.object({
  exam_id: z.number(),
  course_id: z.number(),
  studentDecodeList: z.array(studentDecodeObject),
});

totalPaperMarkRouter.post("/decode", async (req, res) => {
  try {
    const reqBody = totalPaperMarkDecodeBody.parse(req.body);
    const proccessedData = reqBody.studentDecodeList.map((item) => {
      return {
        exam_id: reqBody.exam_id,
        course_id: reqBody.course_id,
        set: item.set,
        paper_code: item.paper_code,
        student_id: item.student_id,
      };
    });

    await db.transaction().execute(async (trx) => {
      await trx
        .insertInto("Total_Paper_Mark")
        .values(proccessedData)
        .onDuplicateKeyUpdate({
          student_id: sql`VALUES(student_id)`,
        })
        .execute();

      const academic_session_id = await trx
        .selectFrom("Exam")
        .where("Exam.exam_id", "=", reqBody.exam_id)
        .select("academic_session_id")
        .executeTakeFirst();

      if (!academic_session_id) {
        throw new Error("Academic session not found.");
      }
      await trx
        .updateTable("Courses_in_Semester")
        .set("Courses_in_Semester.is_decoded", 1)
        .where(
          "Courses_in_Semester.academic_session_id",
          "=",
          academic_session_id.academic_session_id,
        )
        .where("course_id", "=", reqBody.course_id)
        .execute();
    });
    return res
      .status(201)
      .json({ success: true, message: "Total paper mark added successfully" });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return res.status(400).json({
        name: "Invalid data type.",
        message: JSON.parse(error.message),
      });
    }
    return res.status(400).json({ message: "Invalid request body", error });
  }
});

totalPaperMarkRouter.get("/decode", async (req, res) => {
  try {
    var query = db.selectFrom("Total_Paper_Mark");

    if (
      req.query.exam_id &&
      z.coerce.number().safeParse(req.query.exam_id).success
    ) {
      query = query.where(
        "Total_Paper_Mark.exam_id",
        "=",
        z.coerce.number().parse(req.query.exam_id),
      );
    } else {
      return res.status(400).json({ message: "Invalid exam id" });
    }

    if (
      req.query.course_id &&
      z.coerce.number().safeParse(req.query.course_id).success
    ) {
      query = query.where(
        "Total_Paper_Mark.course_id",
        "=",
        z.coerce.number().parse(req.query.course_id),
      );
    } else {
      return res.status(400).json({ message: "Invalid course id" });
    }

    const result = await query
      .select(["set", "paper_code", "student_id"])
      .execute();

    var proccessedData: {
      student_id: number;
      set_A: number | null;
      set_B: number | null;
    }[] = [];

    result.forEach((item) => {
      const index = proccessedData.findIndex(
        (data) => data.student_id === item.student_id,
      );
      if (index !== -1) {
        if (item.set === "A") {
          proccessedData[index].set_A = item.paper_code;
        } else {
          proccessedData[index].set_B = item.paper_code;
        }
      } else {
        proccessedData.push({
          student_id: item.student_id!!,
          set_A: item.set === "A" ? item.paper_code : null,
          set_B: item.set === "B" ? item.paper_code : null,
        });
      }
    });

    const decodeData = await db
      .selectFrom("Courses_in_Semester")
      .innerJoin(
        "Exam",
        "Exam.academic_session_id",
        "Courses_in_Semester.academic_session_id",
      )
      .where("exam_id", "=", z.coerce.number().parse(req.query.exam_id))
      .where("course_id", "=", z.coerce.number().parse(req.query.course_id))
      .select("Courses_in_Semester.is_decoded")
      .executeTakeFirst();

    const data = {
      exam_id: req.query.exam_id,
      course_id: req.query.course_id,
      is_decoded: decodeData?.is_decoded,
      studentDecodeList: proccessedData,
    };

    return res.status(200).json(data);
  } catch (error) {
    res.status(500).json({ message: "Internal server error", error });
  }
});

export default totalPaperMarkRouter;
