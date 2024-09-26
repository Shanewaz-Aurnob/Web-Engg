import { Request } from "express";

type ConstructorProps = {
  formatted_date?: Date;
  role?: "CHAIRMAN" | "MEMBER" | "TABULATOR";
  teacher_id?: number;
  exam_id?: number;
};
export class examCommitteeFilter {
    formatted_date?: Date;
    role?: "CHAIRMAN" | "MEMBER" | "TABULATOR";
    teacher_id?: number;
    exam_id?: number;

  constructor({
    formatted_date,
    role,
    teacher_id,
    exam_id,
  }: ConstructorProps) {
    this.formatted_date = formatted_date;
    this.role = role;
    this.teacher_id = teacher_id;
    this.exam_id = exam_id;
  }

  static fromRequest(req: Request): examCommitteeFilter {
    return new examCommitteeFilter({
      formatted_date: req.query.formatted_date as Date | undefined,
      role: req.query.role as "CHAIRMAN" | "MEMBER" | "TABULATOR" | undefined,
      teacher_id: req.query.teacher_id as number | undefined,
      exam_id: req.query.program_id as number | undefined,
    });
  }
}
