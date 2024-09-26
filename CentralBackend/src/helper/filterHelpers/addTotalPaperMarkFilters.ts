import { Request } from "express";
import { SelectQueryBuilder } from "kysely";
import { Database } from "../../database";
import { z } from "zod";

export function addTotalPaperMarkFilters(
  req: Request,
  query: SelectQueryBuilder<Database, "Total_Paper_Mark", {}>,
) {
  if (req.query.set && z.enum(["A", "B"]).safeParse(req.query.set).success) {
    query = query.where(
      "Total_Paper_Mark.set",
      "=",
      req.query.set as "A" | "B",
    );
  }

  if (
    req.query.exam_id &&
    z.coerce.number().safeParse(req.query.exam_id).success
  ) {
    query = query.where(
      "Total_Paper_Mark.exam_id",
      "=",
      z.coerce.number().parse(req.query.exam_id),
    );
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
  }

  if (
    req.query.paper_code &&
    z.coerce.number().safeParse(req.query.paper_code).success
  ) {
    query = query.where(
      "Total_Paper_Mark.paper_code",
      "=",
      z.coerce.number().parse(req.query.paper_code),
    );
  }

  if (
    req.query.student_id &&
    z.coerce.number().safeParse(req.query.student_id).success
  ) {
    query = query.where(
      "Total_Paper_Mark.student_id",
      "=",
      z.coerce.number().parse(req.query.student_id),
    );
  }

  return query;
}
