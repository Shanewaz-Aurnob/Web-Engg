import { Request } from "express";

type ConsProps = {
  department_name?: string;
  university_id?: number;
  faculty?: string;
  undergrad_semester_no?: number;
  grad_semester_no?: number;
  department_abbrev?: string;
};

export class DepartmentFilter {
  department_name?: string;
  university_id?: number;
  faculty?: string;
  undergrad_semester_no?: number;
  grad_semester_no?: number;
  department_abbrev?: string;

  constructor({
    department_name,
    university_id,
    faculty,
    undergrad_semester_no,
    grad_semester_no,
    department_abbrev,
  }: ConsProps) {
    this.department_abbrev = department_abbrev;
    this.department_name = department_name;
    this.faculty = faculty;
    this.grad_semester_no = grad_semester_no;
    this.undergrad_semester_no = undergrad_semester_no;
    this.university_id = university_id;
  }

  static fromRequest = (req: Request) => {
    return new DepartmentFilter({
      department_abbrev: req.query.department_abbrev as string | undefined,
      department_name: req.query.department_name as string | undefined,
      faculty: req.query.faculty as string | undefined,
      grad_semester_no: req.query.grad_semester_no
        ? Number(req.query.grad_semester_no)
        : undefined,
      undergrad_semester_no: req.query.undergrad_semester_no
        ? Number(req.query.undergrad_semester_no)
        : undefined,
      university_id: req.query.university_id
        ? Number(req.query.university_id)
        : undefined,
    });
  };
}
