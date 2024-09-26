import { Request } from "express";

type ConstructorProps = {
  evaluator_id?: string;
};

export class FormEvaluationFilter {
  evaluator_id?: string;

  constructor({
    evaluator_id
  }: ConstructorProps) {
    this.evaluator_id = evaluator_id;
  }

  static fromRequest = (req: Request): FormEvaluationFilter => {
    const evaluator_id: string | undefined = req.query.evaluator_id as string | undefined;

    return new FormEvaluationFilter({
      evaluator_id
    });
  };
}
