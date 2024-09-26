import { Request } from "express";
import { SelectQueryBuilder } from "kysely";
import { z } from "zod";
import { Database } from "../../database";

export function addExamActivityFactorsFilters(
    req: Request,
    query: SelectQueryBuilder<Database, "Exam_Activity_Factors", {}>,

){
    if(req.query.id && z.coerce.number().safeParse(req.query.id).success){
        query = query.where("Exam_Activity_Factors.id", "=", z.coerce.number().parse(req.query.id))
    }
    if(req.query.activity_id && z.coerce.number().safeParse(req.query.activity_id).success){
        query = query.where("Exam_Activity_Factors.activity_id", "=", z.coerce.number().parse(req.query.activity_id))
    }
    if(req.query.factor && z.string().safeParse(req.query.factor).success){
        query = query.where("Exam_Activity_Factors.factor", "=", req.query.factor as string)
    }
    if(req.query.quantity && z.coerce.number().safeParse(req.query.quantity).success){
        query = query.where("Exam_Activity_Factors.quantity", "=", z.coerce.number().parse(req.query.quantity))
    }
    return query;
}
