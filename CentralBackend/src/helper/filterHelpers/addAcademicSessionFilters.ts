import { Request } from "express";
import { SelectQueryBuilder } from "kysely";
import { Database } from "../../database";
import { z } from "zod";

export function addAcademicSessionFilters(
  req: Request,
  query: SelectQueryBuilder<Database, "Academic_Session", {}>,
) {
  if (
    req.query.academic_session_id &&
    z.coerce.number().safeParse(req.query.academic_session_id).success
  ) {
    query = query.where(
      "Academic_Session.academic_session_id",
      "=",
      z.coerce.number().parse(req.query.academic_session_id),
    );
  }

  if (req.query.session && z.string().safeParse(req.query.session).success) {
    query = query.where(
      "Academic_Session.session",
      "=",
      req.query.session as string,
    );
  }

  if (
    req.query.semester &&
    z.coerce.number().safeParse(req.query.semester).success
  ) {
    query = query.where(
      "Academic_Session.semester",
      "=",
      z.coerce.number().parse(req.query.semester),
    );
  }

  if (
    req.query.program_id &&
    z.coerce.number().safeParse(req.query.program_id).success
  ) {
    query = query.where(
      "Academic_Session.program_id",
      "=",
      z.coerce.number().parse(req.query.program_id),
    );
  }

  return query;
}
