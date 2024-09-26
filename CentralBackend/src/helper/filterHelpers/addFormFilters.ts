import { SelectQueryBuilder } from "kysely";
import { Database } from "../../database";
import { FormFilter } from "../../filters/FormFilter";
import { Request } from "express";
import { z } from "zod";

export function addFormFilters(
  req: Request,
  query: SelectQueryBuilder<Database, "Form", {}>,
) {
  if (
    req.query.current_address_id &&
    z.coerce.number().safeParse(req.query.current_address_id).success
  ) {
    query = query.where(
      "current_address_id",
      "=",
      z.coerce.number().parse(req.query.current_address_id),
    );
  }

  if (
    req.query.permanent_address_id &&
    z.coerce.number().safeParse(req.query.permanent_address_id).success
  ) {
    query = query.where(
      "permanent_address_id",
      "=",
      z.coerce.number().parse(req.query.permanent_address_id),
    );
  }

  if (
    req.query.student_id &&
    z.coerce.number().safeParse(req.query.student_id).success
  ) {
    query = query.where(
      "student_id",
      "=",
      z.coerce.number().parse(req.query.student_id),
    );
  }
  const statEnum = z.enum(["Improvement", "Regular", "Irregular"]);
  if (
    req.query.student_status &&
    statEnum.safeParse(req.query.student_status).success
  ) {
    query = query.where(
      "student_status",
      "=",
      statEnum.parse(req.query.student_status),
    );
  }

  return query;
}
