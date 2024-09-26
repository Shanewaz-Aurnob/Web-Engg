import express from "express";
import db from "../../database";
import { sql } from "kysely";
import { z } from "zod";
import { Pool } from "mysql2/typings/mysql/lib/Pool";

const reviewerRouter = express.Router();

// /api/editorial-manager/reviewer/
reviewerRouter.get("/", async (req, res) => {
  try {
    const teachers = await db
      .selectFrom("Teacher")
      .innerJoin("User", "User.user_id", "Teacher.user_id")
      .innerJoin(
        "Department",
        "Department.department_id",
        "Teacher.department_id",
      )
      .innerJoin("Education", "Education.user_id", "Teacher.user_id")
      .distinct()
      .select([
        "Teacher.user_id",
        "Teacher.teacher_id",
        "Teacher.designation",
        "Teacher.area_of_interest",
        "Department.department_name",
        "Teacher.title",
        "User.first_name",
        "User.last_name",
        "User.email",
      ])
      .where((eb) =>
        eb.or([
          eb(sql`LOWER(Teacher.designation)`, "=", "professor"),
          eb("Education.education_title", "like", "%PhD%"),
        ]),
      )
      .execute();

    return res.status(200).json({ reviewers: teachers });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: "internal server error" });
  }
});

const assignedReviewers = z.object({
    submission_id: z.string(),
});

// /api/editorial-manager/reviewer/assigned?submission_id=$1
reviewerRouter.get("/assigned", async (req, res) => {
  try {
    const parsedParams = assignedReviewers.parse(req.query);
    const teachers = await db
      .selectFrom("Teacher")
      .innerJoin("User", "User.user_id", "Teacher.user_id")
      .innerJoin(
        "Department",
        "Department.department_id",
        "Teacher.department_id",
      )
      .innerJoin("Education", "Education.user_id", "Teacher.user_id")
      .innerJoin("EManager_Reviewer_Assigned", "EManager_Reviewer_Assigned.reviewer_id", "Teacher.teacher_id")
      .distinct()
      .select([
        "Teacher.user_id",
        "Teacher.teacher_id",
        "Teacher.designation",
        "Teacher.area_of_interest",
        "Department.department_name",
        "Teacher.title",
        "User.first_name",
        "User.last_name",
        "User.email",
        "EManager_Reviewer_Assigned.submission_id",
      ])
      .where((eb) =>
        eb.and([
        eb.or([
          eb(sql`LOWER(Teacher.designation)`, "=", "professor"),
          eb("Education.education_title", "like", "%PhD%"),
        ]),
        eb("EManager_Reviewer_Assigned.submission_id", "=", parsedParams.submission_id)
        ]),
      )
      .execute();

    return res.status(200).json({ reviewers: teachers });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: "internal server error" });
  }
});

reviewerRouter.get("/:reviewer_id/assigned", async (req, res) => {
  try {
    const reviewer_id = req.params.reviewer_id as string;
    const submissions = await db
      .selectFrom("EManager_Submission")
      .innerJoin("EManager_Reviewer_Assigned", "EManager_Reviewer_Assigned.submission_id", "EManager_Submission.submission_id")
      .distinct()
      .select([
        "EManager_Submission.submission_id",
        "EManager_Submission.initial_submission_id",
        "EManager_Submission.status",
        "EManager_Submission.keywords",
        "EManager_Submission.author_id",
        "EManager_Submission.paper_title",
        "EManager_Submission.status_date",
        "EManager_Submission.submission_date",
      ])
      .where("EManager_Reviewer_Assigned.reviewer_id", "=", Number(reviewer_id))
      .execute();
    return res.status(200).json({ submissions });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: "internal server error" });
  }
});

const assignProposalQuerySchema = z.object({
  assigned_date: z.coerce.date(),
  reviewer_id: z.number(),
  submission_id: z.string(),
});

// /api/editorial-manager/reviewer/assign-proposal
reviewerRouter.post("/assign-proposal", async (req, res) => {
  try {
    const validatedBodyObject = assignProposalQuerySchema.parse(req.body);
    await db
      .insertInto("EManager_Reviewer_Assigned")
      .values(validatedBodyObject)
      .execute();
    const result = await db
        .selectFrom("EManager_Reviewer_Assigned")
        .select(({ ref }) => [sql`count(${ref("submission_id")})`.as("count")])
        .groupBy("EManager_Reviewer_Assigned.submission_id")
        .where("EManager_Reviewer_Assigned.submission_id", "=", validatedBodyObject.submission_id)
        .execute();
    if (result.length > 0 && result[0].count == 2) {
        await db
            .updateTable("EManager_Submission")
            .set("EManager_Submission.status", "Assigned")
            .set("EManager_Submission.status_date", validatedBodyObject.assigned_date)
            .where("EManager_Submission.submission_id", "=", validatedBodyObject.submission_id)
            .execute();
    }
    return res.status(201).json({ message: "successfully assigned" });
  } catch (err) {
    console.error(err);
    if (err instanceof z.ZodError) {
      return res.status(400).json({ message: "body has wrong type" });
    } else {
      return res.status(500).json({ message: "internal server error" });
    }
  }
});

const removeReviewerQuerySchema = z.object({
  reviewer_id: z.coerce.number(),
  submission_id: z.string(),
});

// /api/editorial-manager/reviewer/assigned?reviewer_id=$1&submission_id=$2
reviewerRouter.delete("/assigned", async (req, res) => {
  try {
    const validatedQueryObject = removeReviewerQuerySchema.parse(req.query);
    await db
      .deleteFrom("EManager_Reviewer_Assigned")
      .where((eb) => 
        eb.and([
            eb("EManager_Reviewer_Assigned.submission_id", "=", validatedQueryObject.submission_id),
            eb("EManager_Reviewer_Assigned.reviewer_id", "=", validatedQueryObject.reviewer_id),
        ])
      )
      .execute();
    const result = await db
        .selectFrom("EManager_Reviewer_Assigned")
        .select(({ ref }) => [sql`count(${ref("submission_id")})`.as("count")])
        .groupBy("EManager_Reviewer_Assigned.submission_id")
        .where("EManager_Reviewer_Assigned.submission_id", "=", validatedQueryObject.submission_id)
        .execute();
    if (result.length > 0 && result[0].count == 0) {
        await db
            .updateTable("EManager_Submission")
            .set("EManager_Submission.status", "Submitted")
            .set("EManager_Submission.status_date", new Date())
            .where("EManager_Submission.submission_id", "=", validatedQueryObject.submission_id)
            .execute();
    }
    return res.status(204).json({ message: "successfully removed" });
  } catch (err) {
    console.error(err);
    if (err instanceof z.ZodError) {
      return res.status(400).json({ message: "body has wrong type" });
    } else {
      return res.status(500).json({ message: "internal server error" });
    }
  }
});

export default reviewerRouter;
