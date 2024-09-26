import { SelectQueryBuilder } from "kysely";
import { Database, TableName } from "../../database";
import { ExamFilter } from "../../filters/ExamFilter";
import { Request } from "express";
import { z } from "zod";

export function addExamFilters(
  req: Request,
  query: SelectQueryBuilder<Database, "Exam", {}>,
) {
  if (
    req.query.exam_id &&
    z.coerce.number().safeParse(req.query.exam_id).success
  ) {
    query = query.where(
      "Exam.exam_id",
      "=",
      z.coerce.number().parse(req.query.exam_id),
    );
  }
  if (
    req.query.academic_session_id &&
    z.coerce.number().safeParse(req.query.academic_session_id).success
  ) {
    query = query.where(
      "Exam.academic_session_id",
      "=",
      z.coerce.number().parse(req.query.academic_session_id),
    );
  }
  if (
    req.query.department_id &&
    z.coerce.number().safeParse(req.query.department_id).success
  ) {
    query = query.where(
      "Exam.department_id",
      "=",
      z.coerce.number().parse(req.query.department_id),
    );
  }
  if (
    req.query.exam_centre &&
    z.string().safeParse(req.query.exam_centre).success
  ) {
    query = query.where(
      "Exam.exam_centre",
      "=",
      req.query.exam_centre as string,
    );
  }
  if (
    req.query.exam_name &&
    z.string().safeParse(req.query.exam_name).success
  ) {
    query = query.where("Exam.exam_name", "=", req.query.exam_name as string);
  }
  if (
    req.query.exam_session &&
    z.string().safeParse(req.query.exam_session).success
  ) {
    query = query.where(
      "Exam.exam_session",
      "=",
      req.query.exam_session as string,
    );
  }
  if (
    req.query.exam_start_date &&
    z.date().safeParse(req.query.exam_start_date).success
  ) {
    query = query.where(
      "Exam.exam_start_date",
      "=",
      z.date().parse(req.query.exam_start_date),
    );
  }
  if (
    req.query.exam_end_date &&
    z.date().safeParse(req.query.exam_end_date).success
  ) {
    query = query.where(
      "Exam.exam_end_date",
      "=",
      z.date().parse(req.query.exam_end_date),
    );
  }
  if (
    req.query.is_result_submitted &&
    z.coerce.number().safeParse(req.query.is_result_submitted).success
  ) {
    query = query.where(
      "Exam.is_result_submitted",
      "=",
      z.coerce.number().parse(req.query.is_result_submitted),
    );
  }
  if (
    req.query.result_submit_date &&
    z.date().safeParse(req.query.result_submit_date).success
  ) {
    query = query.where(
      "Exam.result_submit_date",
      "=",
      z.date().parse(req.query.result_submit_date),
    );
  }

  if (
    req.query.committee_created &&
    z.coerce.number().safeParse(req.query.committee_created).success
  ) {
    query = query.where(
      "Exam.committee_created",
      "=",
      z.coerce.number().parse(req.query.committee_created),
    );
  }

  return query;
}
