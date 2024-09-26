import { SelectQueryBuilder } from "kysely";
import { Database, TableName } from "../../database";
import { examCommitteeFilter } from "../../filters/examCommitteeFilter";
import { Request } from "express";
import { z } from "zod";

const ExamCommitteeRoleEnum = z.enum(["Chairman", "Member", "Tabulator"]);
export function addExamCommitteeFilter(
  req: Request,
  //   studentFilter: StudentFilter,
  query: SelectQueryBuilder<Database, TableName, {}>,
) {
  if (
    req.query.exam_id &&
    z.coerce.number().safeParse(req.query.exam_id).success
  ) {
    query = query.where(
      "Exam_Committee.exam_id",
      "=",
      z.coerce.number().parse(req.query.exam_id),
    );
  }
  if (
    req.query.teacher_id &&
    z.coerce.number().safeParse(req.query.teacher_id).success
  ) {
    query = query.where(
      "Exam_Committee.teacher_id",
      "=",
      z.coerce.number().parse(req.query.teacher_id),
    );
  }
  if (
    req.query.role &&
    ExamCommitteeRoleEnum.safeParse(req.query.role).success
  ) {
    query = query.where(
      "Exam_Committee.role",
      "=",
      ExamCommitteeRoleEnum.parse(req.query.role),
    );
  }
  if (
    req.query.formatted_date &&
    z.date().safeParse(req.query.formatted_date).success
  ) {
    query = query.where(
      "Exam_Committee.formation_date",
      "=",
      z.date().parse(req.query.formatted_date),
    );
  }

  return query;
}
