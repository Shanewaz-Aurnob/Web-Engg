import { Request } from "express";

type ConstructorProps = {
  academic_session?: string;
  department_id?: number;
  hall_id?: number;
  program_id?: number;
  user_id?: string;
};
export class StudentFilter {
  academic_session?: string;
  department_id?: number;
  hall_id?: number;
  program_id?: number;
  user_id?: string;

  constructor({
    academic_session,
    department_id,
    hall_id,
    program_id,
    user_id,
  }: ConstructorProps) {
    this.academic_session = academic_session;
    this.department_id = department_id;
    this.hall_id = hall_id;
    this.program_id = program_id;
    this.user_id = user_id;
  }

  static fromRequest(req: Request): StudentFilter {
    return new StudentFilter({
      academic_session: req.query.academic_session as string,
      department_id: req.query.department_id as number | undefined,
      hall_id: req.query.hall_id as number | undefined,
      program_id: req.query.program_id as number | undefined,
      user_id: req.query.user_id as string | undefined,
    });
  }
}
