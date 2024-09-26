import { SelectQueryBuilder } from "kysely";
import { Database, TableName } from "../../database";
import { Request } from "express";
import { z } from "zod";

export function addUniversityFilters(
  req: Request,
  query: SelectQueryBuilder<Database, "University", {}>,
) {
  if (
    req.query.university_id &&
    z.coerce.number().safeParse(req.query.university_id).success
  ) {
    query = query.where(
      "University.university_id",
      "=",
      z.coerce.number().parse(req.query.university_id),
    );
  }

  if (
    req.query.university_name &&
    z.string().safeParse(req.query.university_name).success
  ) {
    query = query.where(
      "University.university_name",
      "=",
      req.query.university_name as string,
    );
  }

  if (
    req.query.university_abbr &&
    z.string().safeParse(req.query.university_abbr).success
  ) {
    query = query.where(
      "University.university_abbr",
      "=",
      req.query.university_abbr as string,
    );
  }
  return query;
}
