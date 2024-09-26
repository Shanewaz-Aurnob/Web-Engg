import { SelectQueryBuilder } from "kysely";
import { Database } from "../../database";
import { FormEvaluationFilter } from "../../filters/FormEvaluationFilter";
import { Request } from "express";
import { z } from "zod";

export function addFormEvaluationFilters(
  req: Request,
  query: SelectQueryBuilder<Database, "Form_Evaluation", {}>,
) {
  if (
    req.query.evaluator_id &&
    z.string().safeParse(req.query.evaluator_id).success
  ) {
    query.where("evaluator_id", "=", req.query.evaluator_id as string);
  }

  return query;
}
