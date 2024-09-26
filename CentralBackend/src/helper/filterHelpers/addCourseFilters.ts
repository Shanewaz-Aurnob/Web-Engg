import { SelectQueryBuilder } from "kysely";
import { Database, TableName } from "../../database";
import { AddressFilter } from "../../filters/AddressFilter";
import { Request } from "express";
import { z } from "zod";
import { zCoercedEnum } from "../../types/coreredEnum";

enum CourseType {
  "Lab",
  "Project",
  "Theory",
  "Thesis",
  "Viva",
}
export const CourseTypeEnum = zCoercedEnum(CourseType);

export function addCourseFilters(
  req: Request,
  query: SelectQueryBuilder<Database, "Course", {}>,
) {
  if (
    req.query.department_id &&
    z.coerce.number().safeParse(req.query.department_id).success
  ) {
    query = query.where(
      "Course.department_id",
      "=",
      z.coerce.number().parse(req.query.department_id),
    );
  }
  if (
    req.query.course_code &&
    z.string().safeParse(req.query.course_code).success
  ) {
    query = query.where(
      "Course.course_code",
      "=",
      z.string().parse(req.query.course_code),
    );
  }
  if (
    req.query.course_title &&
    z.string().safeParse(req.query.course_title).success
  ) {
    query = query.where(
      "Course.course_title",
      "=",
      z.string().parse(req.query.course_title),
    );
  }
  if (
    req.query.credit &&
    z.coerce.number().safeParse(req.query.credit).success
  ) {
    query = query.where(
      "Course.credit",
      "=",
      z.coerce.number().parse(req.query.credit),
    );
  }
  if (
    req.query.course_type &&
    CourseTypeEnum.safeParse(req.query.course_type).success
  ) {
    query = query.where(
      "Course.course_type",
      "=",
      req.query.course_type as any,
    );
  }
  if (
    req.query.exam_minutes &&
    z.coerce.number().safeParse(req.query.exam_minutes).success
  ) {
    query = query.where(
      "Course.exam_minutes",
      "=",
      z.coerce.number().parse(req.query.exam_minutes),
    );
  }
  if (
    req.query.course_id &&
    z.coerce.number().safeParse(req.query.course_id).success
  ) { 
    query = query.where(
      "Course.course_id",
      "=",
      z.coerce.number().parse(req.query.course_id),
    );
  }
  return query;
}
