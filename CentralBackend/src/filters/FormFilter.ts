import { Request } from "express";

type ConstructorProps = {
  student_id?: number;
  current_address_id?: number;
  permanent_address_id?: number;
};

export class FormFilter {
  student_id?: number;
  current_address_id?: number;
  permanent_address_id?: number;

  constructor({
    student_id,
    current_address_id,
    permanent_address_id,
  }: ConstructorProps) {
    this.student_id = student_id;
    this.current_address_id = current_address_id;
    this.permanent_address_id = permanent_address_id;
  }

  static fromRequest = (req: Request): FormFilter => {
    const student_id: number | undefined = req.query.student_id ? Number(req.query.student_id) : undefined;
    const current_address_id: number | undefined = req.query.current_address_id ? Number(req.query.current_address_id) : undefined;
    const permanent_address_id: number | undefined = req.query.permanent_address_id ? Number(req.query.permanent_address_id) : undefined;

    return new FormFilter({
      student_id,
      current_address_id,
      permanent_address_id
    });
  };
}
