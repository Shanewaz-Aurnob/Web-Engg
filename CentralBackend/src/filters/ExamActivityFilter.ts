import { Request } from "express";

type ConstructorProps = {
    rule_id?: number;
    bill_sector_id?: number;
    exam_activity_type_id?: number;
    quantity_initial?: number,
    quantity_final?: number;
    exam_bill?: number;
    min_exam_bill?: number;
    factor?:string;
    valid_from?: Date | null;
  };

  export class ExamActivityFilter {
    rule_id?: number;
    bill_sector_id?: number;
    exam_activity_type_id?: number;
    quantity_initial?: number;
    quantity_final?: number;
    exam_bill?: number;
    min_exam_bill?: number;
    factor?:string;
    valid_from?: Date | null;
    constructor({
        rule_id,
        bill_sector_id,
        exam_activity_type_id,
        quantity_initial,
        quantity_final,
        exam_bill,
        min_exam_bill,
        factor,
        valid_from
      }: ConstructorProps) {
        this.rule_id = rule_id;
        this.bill_sector_id = bill_sector_id;
        this.exam_activity_type_id = exam_activity_type_id;
        this.quantity_initial = quantity_initial;
        this.quantity_final = quantity_final;
        this.exam_bill = exam_bill;
        this.min_exam_bill = min_exam_bill;
        this.factor = factor;
        this.valid_from = valid_from;
      }
      static fromRequest(req: Request): ExamActivityFilter {
        return new ExamActivityFilter({
            rule_id: req.query.rule_id as number | undefined,
            bill_sector_id: req.query.bill_sector_id as number | undefined,
            exam_activity_type_id: req.query.exam_activity_type_id as number | undefined,
            quantity_initial: req.query.quantity_initial as number | undefined,
            quantity_final: req.query.quantity_final as number | undefined,
            exam_bill: req.query.exam_bill as number | undefined,
            min_exam_bill: req.query.min_exam_bill as number | undefined,
            factor: req.query.factor as string | undefined,
            valid_from: req.query.valid_from as Date | null | undefined
        });
      };
  }