import { SelectQueryBuilder } from "kysely";
import { Database, TableName } from "../../database";
import { CourseSemesterFilter } from "../../filters/CourseSemesterFilter";
import { Request } from "express";
import { z } from "zod";

export function addCourseSemesterFilter(
  req: Request,
  query: SelectQueryBuilder<Database, "Courses_in_Semester", {}>,
) {
  if (
    req.query.course_id &&
    z.coerce.number().safeParse(req.query.course_id).success
  ) {
    query = query.where(
      "Courses_in_Semester.course_id",
      "=",
      z.coerce.number().parse(req.query.course_id),
    );
  }
  if (
    req.query.academic_session_id &&
    z.coerce.number().safeParse(req.query.academic_session_id).success
  ) {
    query = query.where(
      "Courses_in_Semester.academic_session_id",
      "=",
      z.coerce.number().parse(req.query.academic_session_id),
    );
  }

  if (
    req.query.is_catm_submitted &&
    z.coerce.number().safeParse(req.query.is_catm_submitted).success
  ) {
    query = query.where(
      "Courses_in_Semester.is_catm_submitted",
      "=",
      z.coerce.number().parse(req.query.is_catm_submitted),
    );
  }

  return query;
}
