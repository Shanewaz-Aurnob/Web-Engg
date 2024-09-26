import { Request } from "express";

type ConsProps = {
    course_id?: number;
    department_id?: number;
    course_code?: string ;
    course_title?: string;
    credit?: number;
    course_type?: string;
    exam_minutes?: number;
};

export class CourseFilter {
    course_id?: number;
    department_id?: number;
    course_code?: string ;
    course_title?: string ;
    credit?: number;
    course_type?: string ;
    exam_minutes?: number;

    constructor({
        course_id,
        department_id,
        course_code,
        course_title,
        credit,
        course_type,
        exam_minutes
    }: ConsProps) {
        this.course_id = course_id;
        this.department_id = department_id;
        this.course_code = course_code;
        this.course_title = course_title;
        this.credit = credit;
        this.course_type = course_type;
        this.exam_minutes = exam_minutes;
    }

    static fromRequest = (req: Request) => {
        const course_id = req.query.course_id ? Number(req.query.course_id) : undefined;
        const department_id = req.query.department_id ? Number(req.query.department_id) : undefined;
        const credit = req.query.credit ? Number(req.query.credit) : undefined;
        const exam_minutes = req.query.exam_minutes ? Number(req.query.exam_minutes) : undefined;
    
        return new CourseFilter({
            course_id,
            department_id,
            course_code: req.query.course_code as string,
            course_title: req.query.course_title as string,
            credit,
            course_type: req.query.course_type as string,
            exam_minutes,
        });
    };
}    