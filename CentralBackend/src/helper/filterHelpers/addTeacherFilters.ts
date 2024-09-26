import { SelectQueryBuilder } from "kysely";
import { Database, TableName } from "../../database";
import { TeacherFilter } from "../../filters/teacherFilter";
import { Request } from "express";
import { z } from "zod";

export function addTeacherFilters(
  req: Request,
  query: SelectQueryBuilder<Database, "Teacher", {}>,
) {
  if (req.query.user_id && z.string().safeParse(req.query.user_id).success) {
    query = query.where("Teacher.user_id", "=", req.query.user_id as string);
  }
  if (
    req.query.area_of_interest &&
    z.string().safeParse(req.query.area_of_interest).success
  ) {
    query = query.where(
      "Teacher.area_of_interest",
      "=",
      req.query.area_of_interest as string,
    );
  }
  if (
    req.query.department_id &&
    z.coerce.number().safeParse(req.query.department_id).success
  ) {
    query = query.where(
      "Teacher.department_id",
      "=",
      z.coerce.number().parse(req.query.department_id),
    );
  }
  if (
    req.query.designation &&
    z.string().safeParse(req.query.designation).success
  ) {
    query = query.where(
      "Teacher.designation",
      "=",
      req.query.designation as string,
    );
  }
  if (req.query.title && z.string().safeParse(req.query.title).success) {
    query = query.where("Teacher.title", "=", req.query.title as string);
  }

  return query;
}
