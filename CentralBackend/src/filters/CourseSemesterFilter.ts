import { Request } from "express";

type ConstructorProps = {
  course_id?: number;
  academic_session_id?: number;
};
export class CourseSemesterFilter {
    course_id?: number;
    academic_session_id?: number;

  constructor({
    course_id,academic_session_id
  }: ConstructorProps) {
    this.course_id=course_id;
    this.academic_session_id=academic_session_id;
  }

  static fromRequest(req: Request): CourseSemesterFilter {
    return new CourseSemesterFilter({
      course_id: req.query.course_id as number | undefined,
      academic_session_id: req.query.academic_session_id as number | undefined
    });
  }
}
