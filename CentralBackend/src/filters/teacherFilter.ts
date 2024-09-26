import { Request } from "express";

type ConstructorProps = {
  area_of_interest?: string;
  department_id?: number;
  designation?: string;
  title?: string;
  user_id?: string;
};

export class TeacherFilter {
  area_of_interest?: string;
  department_id?: number;
  designation?: string;
  title?: string;
  user_id?: string;

  constructor({
    area_of_interest,
    department_id,
    designation,
    title,
    user_id,
  }: ConstructorProps) {
    this.area_of_interest = area_of_interest;
    this.department_id = department_id;
    this.designation = designation;
    this.title = title;
    this.user_id = user_id;
  }

  static fromRequest(req: Request): TeacherFilter {
    return new TeacherFilter({
      area_of_interest: req.query.area_of_interest as string | undefined,
      department_id: req.query.department_id as number | undefined,
      designation: req.query.designation as string | undefined,
      title: req.query.title as string | undefined,
      user_id: req.query.user_id as string | undefined,
    });
  }
}
