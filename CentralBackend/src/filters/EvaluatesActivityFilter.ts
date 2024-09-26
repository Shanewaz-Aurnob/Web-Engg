import { Request } from "express";

type ConstructorProps = {
    activity_id?: number;
    exam_activity_type_id?: number;
    academic_session_id?: number;
    teacher_id?: number;
    bill_sector_id?: number;
    course_id?: number;
    department_id?: number;
    exam_id?: number;
    last_modified?: Date;
  };

  export class CourseActivityFilter {
    activity_id?: number;
    exam_activity_type_id?: number;
    academic_session_id?: number;
    teacher_id?: number;
    bill_sector_id?: number;
    course_id?: number;
    department_id?: number;
    exam_id?: number;
    last_modified?: Date;
    constructor({
        activity_id,
        exam_activity_type_id,
        academic_session_id,
        teacher_id,
        bill_sector_id,
        course_id,
        department_id,
        exam_id,
        last_modified,
      }: ConstructorProps) {
        this.activity_id = activity_id;
        this.exam_activity_type_id = exam_activity_type_id;
        this.academic_session_id = academic_session_id;
        this.teacher_id = teacher_id;
        this.bill_sector_id = bill_sector_id;
        this.course_id = course_id;
        this.department_id = department_id;
        this.exam_id = exam_id;
        this.last_modified = last_modified;
      }
      static fromRequest(req: Request): CourseActivityFilter {
        return new CourseActivityFilter({
            activity_id: req.query.activity_id as number | undefined,
            exam_activity_type_id: req.query.exam_activity_type_id as number | undefined,
            academic_session_id: req.query.academic_session_id as number | undefined,
            teacher_id: req.query.teacher_id as number | undefined,
            bill_sector_id: req.query.bill_sector_id as number | undefined,
            course_id: req.query.course_id as number | undefined,
            department_id: req.query.department_id as number | undefined,
            exam_id: req.query.exam_id as number | undefined,
            last_modified: req.query.last_modified as Date | undefined,
        });
      };
  }