import { Request } from "express";
import { SelectQueryBuilder } from "kysely";
import { z } from "zod";
import { Database } from "../../database";

export function addEvaluatesActivityFilters(
  req: Request,
  query: SelectQueryBuilder<Database, "Evaluates_Activity", {}>,
) {
  if (
    req.query.exam_activity_type_id &&
    z.coerce.number().safeParse(req.query.exam_activity_type_id).success
  ) {
    query = query.where(
      "Evaluates_Activity.exam_activity_type_id",
      "=",
      z.coerce.number().parse(req.query.exam_activity_type_id),
    );
  }
  if (
    req.query.academic_session_id &&
    z.coerce.number().safeParse(req.query.academic_session_id).success
  ) {
    query = query.where(
      "Evaluates_Activity.academic_session_id",
      "=",
      z.coerce.number().parse(req.query.academic_session_id),
    );
  }
  if (
    req.query.teacher_id &&
    z.coerce.number().safeParse(req.query.teacher_id).success
  ) {
    query = query.where(
      "Evaluates_Activity.teacher_id",
      "=",
      z.coerce.number().parse(req.query.teacher_id),
    );
  }
  if (
    req.query.bill_sector_id &&
    z.coerce.number().safeParse(req.query.bill_sector_id).success
  ) {
    query = query.where(
      "Evaluates_Activity.bill_sector_id",
      "=",
      z.coerce.number().parse(req.query.bill_sector_id),
    );
  }
  if (
    req.query.course_id &&
    z.coerce.number().safeParse(req.query.course_id).success
  ) {
    query = query.where(
      "Evaluates_Activity.course_id",
      "=",
      z.coerce.number().parse(req.query.course_id),
    );
  }
  if(
    req.query.department_id &&
    z.coerce.number().safeParse(req.query.department_id).success
  ){
    query = query.where(
      "Evaluates_Activity.department_id",
      "=",
      z.coerce.number().parse(req.query.department_id),
    );
  }
  if (
    req.query.exam_id &&
    z.coerce.number().safeParse(req.query.exam_id).success
  ) {
    query = query.where(
      "Evaluates_Activity.exam_id",
      "=",
      z.coerce.number().parse(req.query.exam_id),
    );
  }
  if (
    req.query.department_id &&
    z.coerce.number().safeParse(req.query.department_id).success
  ) {
    query = query.where(
      "Evaluates_Activity.department_id",
      "=",
      z.coerce.number().parse(req.query.department_id),
    );
  }
  if(
    req.query.last_modified &&
    z.coerce.string().safeParse(req.query.last_modified).success
  ) {
    query = query.where(
      "Evaluates_Activity.last_modified",
      "=",
      z.coerce.date().parse(req.query.last_modified),
    );
  }
  return query;
}