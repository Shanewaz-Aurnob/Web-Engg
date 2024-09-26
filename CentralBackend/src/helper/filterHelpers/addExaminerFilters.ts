import { Request } from "express";
import { SelectQueryBuilder } from "kysely";
import { Database } from "../../database";
import { z } from "zod";

export function addExaminerFilters(
  req: Request,
  query: SelectQueryBuilder<Database, "Examiner", {}>,
) {
  if (req.query.set && z.enum(["A", "B"]).safeParse(req.query.set).success) {
    query = query.where("Examiner.set", "=", req.query.set as "A" | "B");
  }

  if (
    req.query.teacher_id &&
    z.coerce.number().safeParse(req.query.teacher_id).success
  ) {
    query = query.where(
      "Examiner.teacher_id",
      "=",
      z.coerce.number().parse(req.query.teacher_id),
    );
  }

  if (
    req.query.course_id &&
    z.coerce.number().safeParse(req.query.course_id).success
  ) {
    query = query.where(
      "Examiner.course_id",
      "=",
      z.coerce.number().parse(req.query.course_id),
    );
  }

  if (
    req.query.exam_id &&
    z.coerce.number().safeParse(req.query.exam_id).success
  ) {
    query = query.where(
      "Examiner.exam_id",
      "=",
      z.coerce.number().parse(req.query.exam_id),
    );
  }

  if (
    req.query.is_submitted &&
    z.coerce.number().safeParse(req.query.is_submitted).success
  ) {
    query = query.where(
      "Examiner.is_submitted",
      "=",
      z.coerce.number().parse(req.query.is_submitted),
    );
  }

  return query;
}
