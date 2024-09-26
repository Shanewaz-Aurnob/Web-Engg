import { Request } from "express";
import { SelectQueryBuilder } from "kysely";
import { z } from "zod";
import { Database } from "../../database";

export function addDepartmentFilters(
  req: Request,
  query: SelectQueryBuilder<Database, "Department", {}>,
) {
  if (
    req.query.department_abbrev &&
    z.string().safeParse(req.query.abbrev).success
  ) {
    query = query.where(
      "Department.department_abbr",
      "=",
      req.query.department_abbrev as string,
    );
  }

  if (
    req.query.department_name &&
    z.string().safeParse(req.query.department_name).success
  ) {
    query = query.where(
      "Department.department_name",
      "=",
      req.query.department_name as string,
    );
  }

  if (req.query.faculty && z.string().safeParse(req.query.faculty).success) {
    query = query.where("Department.faculty", "=", req.query.faculty as string);
  }

  if (
    req.query.grad_semester_no &&
    z.coerce.number().safeParse(req.query.grad_semester_no).success
  ) {
    query = query.where(
      "Department.grad_semester_no",
      "=",
      z.coerce.number().parse(req.query.grad_semester_no),
    );
  }

  if (
    req.query.undergrad_semester_no &&
    z.coerce.number().safeParse(req.query.undergrad_semester_no).success
  ) {
    query = query.where(
      "Department.undergrad_semester_no",
      "=",
      z.coerce.number().parse(req.query.undergrad_semester_no),
    );
  }

  if (
    req.query.university_id &&
    z.coerce.number().safeParse(req.query.university_id).success
  ) {
    query = query.where(
      "Department.university_id",
      "=",
      z.coerce.number().parse(req.query.university_id),
    );
  }
  return query;
}
