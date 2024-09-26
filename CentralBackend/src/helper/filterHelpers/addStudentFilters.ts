import { SelectQueryBuilder } from "kysely";
import { Database, TableName } from "../../database";
import { StudentFilter } from "../../filters/studentFilter";
import { Request } from "express";
import { z } from "zod";

export function addStudentFilter(
  req: Request,
  query: SelectQueryBuilder<Database, "Student", {}>,
) {
  if (req.query.user_id && z.string().safeParse(req.query.user_id).success) {
    query = query.where("Student.user_id", "=", req.query.user_id as string);
  }
  if (
    req.query.program_id &&
    z.coerce.number().safeParse(req.query.program_id).success
  ) {
    query = query.where(
      "Student.program_id",
      "=",
      z.coerce.number().parse(req.query.program_id),
    );
  }
  if (
    req.query.academic_session_id &&
    z.coerce.number().safeParse(req.query.academic_session_id).success
  ) {
    query = query.where(
      "Student.academic_session_id",
      "=",
      z.coerce.number().parse(req.query.academic_session_id),
    );
  }
  if (
    req.query.hall_id &&
    z.coerce.number().safeParse(req.query.hall_id).success
  ) {
    query = query.where(
      "Student.hall_id",
      "=",
      z.coerce.number().parse(req.query.hall_id),
    );
  }
  if (
    req.query.department_id &&
    z.coerce.number().safeParse(req.query.department_id).success
  ) {
    query = query.where(
      "Student.department_id",
      "=",
      z.coerce.number().parse(req.query.department_id),
    );
  }

  return query;
}
