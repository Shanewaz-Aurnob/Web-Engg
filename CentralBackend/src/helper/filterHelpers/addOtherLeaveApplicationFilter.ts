import { SelectQueryBuilder } from "kysely";
import { Database, TableName } from "../../database";
import { Request } from "express";
import { z } from "zod";

export function addOtherLeaveApplicationFilter(
  req: Request,
  query: SelectQueryBuilder<Database, "Other_Leave_Application", {}>,
) {
  if (
    req.query.leave_id &&
    z.coerce.number().safeParse(req.query.leave_id).success
  ) {
    query = query.where(
      "Other_Leave_Application.leave_id",
      "=",
      z.coerce.number().parse(req.query.leave_id),
    );
  }
  if (
    req.query.applicant_id &&
    z.coerce.string().safeParse(req.query.applicant_id).success
  ) {
    query = query.where(
      "Other_Leave_Application.applicant_id",
      "=",
      z.coerce.string().parse(req.query.applicant_id),
    );
  }
  

  return query;
}
