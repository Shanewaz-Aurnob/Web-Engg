import { Request } from "express";

type ConstructorProps = {
    academic_session_id?: number;
    department_id?: number;
    exam_session?: string,
    exam_id?: number;
    is_result_submitted?: number;
    exam_name?: string;
    exam_start_date?:Date;
    exam_end_date?:Date;
    exam_centre?:string;
    result_submit_date?: Date;
  };

  export class ExamFilter {
    academic_session_id?: number;
    department_id?: number;
    exam_session?: string;
    exam_id?: number;
    is_result_submitted?: number;
    exam_name?: string;
    exam_start_date?:Date;
    exam_end_date?:Date;
    exam_centre?:string;
    result_submit_date?: Date;
    constructor({
        academic_session_id,
        department_id,
        exam_session,
        exam_id,
        is_result_submitted,
        exam_name,
        exam_start_date,
        exam_end_date,
        exam_centre,
        result_submit_date,
      }: ConstructorProps) {
        this.exam_centre = exam_centre;
        this.exam_end_date = exam_end_date;
        this.exam_start_date = exam_start_date;
        this.exam_name = exam_name;
        this.is_result_submitted = is_result_submitted;
        this.exam_id= exam_id;
        this.exam_session= exam_session;
        this.department_id = department_id,
        this.academic_session_id = academic_session_id;
        this.result_submit_date = result_submit_date;
      }
      static fromRequest(req: Request): ExamFilter {
        return new ExamFilter({
            academic_session_id: req.query.academic_session_id as number | undefined,
            department_id: req.query.department_id as number | undefined,
            exam_id: req.query.exam_id as number | undefined,
            exam_session: req.query.exam_session as string | undefined,
            is_result_submitted: req.query.is_result_submitted as number | undefined,
            exam_start_date: req.query.exam_start_date as Date | undefined,
            exam_end_date: req.query.exam_end_date as Date | undefined,
            result_submit_date: req.query.result_submit_date as Date | undefined,
            exam_centre: req.query.exam_centre as string | undefined,
            exam_name: req.query.exam_hall as string | undefined,
        });
      };
  }