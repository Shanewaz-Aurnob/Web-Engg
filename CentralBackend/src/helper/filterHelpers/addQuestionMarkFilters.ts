import { Request } from "express";
import { SelectQueryBuilder } from "kysely";
import { Database } from "../../database";
import { z } from "zod";

export function addQuestionMarkFilters(
  req: Request,
  query: SelectQueryBuilder<Database, "Question_Mark", {}>,
) {
  if (req.query.set && z.enum(["A", "B"]).safeParse(req.query.set).success) {
    query = query.where("Question_Mark.set", "=", req.query.set as "A" | "B");
  }

  if (
    req.query.exam_id &&
    z.coerce.number().safeParse(req.query.exam_id).success
  ) {
    query = query.where(
      "Question_Mark.exam_id",
      "=",
      z.coerce.number().parse(req.query.exam_id),
    );
  }

  if (
    req.query.course_id &&
    z.coerce.number().safeParse(req.query.course_id).success
  ) {
    query = query.where(
      "Question_Mark.course_id",
      "=",
      z.coerce.number().parse(req.query.course_id),
    );
  }

  if (
    req.query.paper_code &&
    z.coerce.number().safeParse(req.query.paper_code).success
  ) {
    query = query.where(
      "Question_Mark.paper_code",
      "=",
      z.coerce.number().parse(req.query.paper_code),
    );
  }

  if (req.query.q_no && z.string().safeParse(req.query.q_no).success) {
    query = query.where(
      "Question_Mark.q_no",
      "=",
      z.string().parse(req.query.q_no),
    );
  }

  return query;
}
