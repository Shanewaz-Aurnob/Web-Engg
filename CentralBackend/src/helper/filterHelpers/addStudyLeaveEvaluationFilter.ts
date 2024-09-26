import { SelectQueryBuilder } from "kysely";
import { Database, TableName } from "../../database";
import { Request } from "express";
import { z } from "zod";

export function addStudyLeaveEvaluationFilter(
  req: Request,
  query: SelectQueryBuilder<Database, "Study_Leave_Evaluation", {}>,
) {
  if (
    req.query.evaluation_type &&
    z.coerce.string().safeParse(req.query.evaluation_type).success
  ) {
    query = query.where(
      "Study_Leave_Evaluation.evaluation_type",
      "=",
      z.coerce.string().parse(req.query.evaluation_type),
    );
  }
  if (
    req.query.le_status &&
    z.coerce.string().safeParse(req.query.le_status).success
  ) {
    query = query.where(
      "Study_Leave_Evaluation.le_status",
      "=",
      z.coerce.string().parse(req.query.le_status),
    );
  }
  if (
    req.query.leave_id &&
    z.coerce.number().safeParse(req.query.leave_id).success
  ) {
    query = query.where(
      "Study_Leave_Evaluation.leave_id",
      "=",
      z.coerce.number().parse(req.query.leave_id),
    );
  }
  if (
    req.query.applicant_id &&
    z.coerce.string().safeParse(req.query.applicant_id).success
  ) {
    query = query.where(
      "Study_Leave_Evaluation.applicant_id",
      "=",
      z.coerce.string().parse(req.query.applicant_id),
    );
  }
  

  return query;
}
