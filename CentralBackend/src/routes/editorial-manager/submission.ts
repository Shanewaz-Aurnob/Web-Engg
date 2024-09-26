import express from "express";
import { z } from "zod";
import db from "../../database";
import { sql } from "kysely";

const submissionRouter = express.Router();

const submissionGetQuerySchema = z.object({
  author_id: z.coerce.number().optional(),
  revisions: z
    .string()
    .toLowerCase()
    .transform((val) => val == "true")
    .optional(),
  accepted: z
    .string()
    .toLowerCase()
    .transform((val) => val == "true")
    .optional(),
  assigned: z
    .string()
    .toLowerCase()
    .transform((val) => val == "true")
    .optional(),
  completed: z
    .string()
    .toLowerCase()
    .transform((val) => val == "true")
    .optional(),
});

// /api/editorial-manager/submission?author_id=$1&revision=[true/false]&accepted=[true/false]&submitted=[true/false]
submissionRouter.get("/", async (req, res) => {
  try {
    const validatedQueryObject = submissionGetQuerySchema.parse(req.query);
    const { author_id, revisions, accepted, assigned, completed } =
      validatedQueryObject;

    let query = db
      .selectFrom("EManager_Submission")
      .selectAll()
      .orderBy([
        "EManager_Submission.status_date desc",
        "EManager_Submission.submission_date desc",
      ]);

    if (author_id) {
      query = query.where("author_id", "==", author_id);
    }

    if (revisions !== undefined) {
      query = query.where(
        "EManager_Submission.initial_submission_id",
        revisions ? "is not" : "is",
        null,
      );
    }

    if (accepted !== undefined) {
      query = query.where(
        "EManager_Submission.status",
        accepted ? "=" : "!=",
        "Accepted",
      );
    }

    if (assigned !== undefined) {
      query = query.where(
        "EManager_Submission.status",
        assigned ? "=" : "not in",
        assigned
          ? "Assigned"
          : ["Accepted", "Rejected", "Assigned", "Reviewed"],
      );
    }

    if (completed !== undefined) {
      query = query.where(
        "EManager_Submission.status",
        completed ? "in" : "not in",
        ["Accepted", "Rejected"],
      );
    }

    return res.status(200).json(await query.execute());
  } catch (err) {
    console.error(err);
    if (err instanceof z.ZodError) {
      return res.status(400).json({ message: "unknown search parameter" });
    } else {
      return res.status(500).json({ message: `internal server error` });
    }
  }
});

const submissionNewQuerySchema = z.object({
  author_id: z.coerce.number(),
  initial_submission_id: z.union([z.string(), z.null()]),
  keywords: z.string(),
  paper_title: z.string(),
  status: z.enum([
    "Accepted",
    "Assigned",
    "Pending",
    "Rejected",
    "Reviewed",
    "Submitted",
  ]),
  status_date: z.coerce.date(),
  submission_date: z.coerce.date(),
  submission_id: z.string(),
});

// /api/editorial-manager/submission/
submissionRouter.post("/", async (req, res) => {
  try {
    const validatedQueryObject = submissionNewQuerySchema.parse(req.body);
    // const { author_id, initial_submission_id, keywords, paper_title, status, status_date, submission_date, submission_id } = validatedQueryObject;
    await db
      .insertInto("EManager_Submission")
      .values(({ ref, fn }) => ({
        author_id: validatedQueryObject.author_id,
        keywords: validatedQueryObject.keywords,
        paper_title: validatedQueryObject.paper_title,
        status_date: sql`str_to_date(${validatedQueryObject.status_date.toLocaleString()}, '%m/%d/%Y, %h:%i:%s %p')`,
        initial_submission_id: validatedQueryObject.initial_submission_id,
        submission_id: validatedQueryObject.submission_id,
        submission_date: sql`str_to_date(${validatedQueryObject.submission_date.toLocaleString()}, '%m/%d/%Y, %h:%i:%s %p')`,
        status: "Submitted",
      }))
      .execute();

    await db
      .insertInto("EManager_Submission_Status_History")
      .values({
        submission_id: validatedQueryObject.submission_id,
        status: "Submitted",
        status_date: validatedQueryObject.status_date,
      })
      .execute();
    return res.status(201).json({ message: "proposal successfully submitted" });
  } catch (err) {
    console.error(err);
    if (err instanceof z.ZodError) {
      return res.status(400).json({ message: "body object has wrong type" });
    } else {
      return res.status(500).json({ message: `internal server error` });
    }
  }
});

// /api/editorial-manager/submission/:submission_id
submissionRouter.get("/:submission_id", async (req, res) => {
  try {
    const result = await db
      .selectFrom("EManager_Submission")
      .innerJoin(
        "Teacher",
        "Teacher.teacher_id",
        "EManager_Submission.author_id",
      )
      .selectAll()
      .where(
        "EManager_Submission.submission_id",
        "=",
        req.params.submission_id as string,
      )
      .execute();

    let teacher;
    if (result) {
      teacher = await db
        .selectFrom("User")
        .select(["User.first_name", "User.last_name", "User.user_id"])
        .where("User.user_id", "=", result[0].user_id)
        .executeTakeFirst();
    }

    if (result.length !== 1) {
      return res.status(400).json({ message: "invalid submission_id" });
    }

    return res.status(200).json({ submission: { ...result[0], ...teacher } });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: `internal server error` });
  }
});

export default submissionRouter;
