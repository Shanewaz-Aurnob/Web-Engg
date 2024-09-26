import express from "express";
import { z } from "zod";
import db from "../../database";
import { sql } from "kysely";

const countRouter = express.Router();

const submissionStatisticsGetQuerySchema = z.object({
  author_id: z.coerce.number().optional(),
  pending: z
    .string()
    .toLowerCase()
    .transform((val) => val == "true")
    .optional(),
  accepted: z
    .string()
    .toLowerCase()
    .transform((val) => val == "true")
    .optional(),
  year: z.coerce.number().optional(),
});

// /api/editorial-manager/count?
countRouter.get("/", async (req, res) => {
  try {
    const validatedQueryObject = submissionStatisticsGetQuerySchema.parse(
      req.query,
    );
    const { author_id, pending, accepted, year } = validatedQueryObject;

    let query = db
      .selectFrom("EManager_Submission")
      .select(({ ref }) => [sql`count(${ref("submission_id")})`.as("count")])
      // .groupBy("author_id")
      .orderBy([
        "EManager_Submission.status_date desc",
        "EManager_Submission.submission_date desc",
      ]);

    if (author_id) {
      query = query.where("EManager_Submission.author_id", "=", author_id);
    }

    if (pending !== undefined) {
      query = query.where(
        "EManager_Submission.status",
        pending ? "not in" : "in",
        ["Accepted", "Rejected"],
      );
    }

    if (accepted !== undefined) {
      query = query.where(
        "EManager_Submission.status",
        accepted ? "=" : "!=",
        "Accepted",
      );
    }

    if (year) {
      query = query.where(
        sql`YEAR(EManager_Submission.submission_date)`,
        "=",
        year,
      );
    }

    const result = await query.execute();
    return res.status(200).json({ ...result[0] });
  } catch (err) {
    console.error(err);
    if (err instanceof z.ZodError) {
      return res.status(400).json({ message: "query object has wrong type" });
    } else {
      return res.status(500).json({ message: `internal server error` });
    }
  }
});

export default countRouter;
