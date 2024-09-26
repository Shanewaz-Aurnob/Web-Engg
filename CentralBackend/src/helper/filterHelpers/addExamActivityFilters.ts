import { Request } from "express";
import { SelectQueryBuilder } from "kysely";
import { z } from "zod";
import { Database } from "../../database";

export function addExamActivityFilters(

    req: Request,
    query: SelectQueryBuilder<Database, "Exam_Activity", {}>,
){
    if(req.query.rule_id && z.coerce.number().safeParse(req.query.id).success){
        query = query.where("Exam_Activity.rule_id", "=", z.coerce.number().parse(req.query.rule_id))
    }

    if(req.query.exam_activity_type_id && z.coerce.number().safeParse(req.query.exam_activity_type_id).success){
        query = query.where("Exam_Activity.exam_activity_type_id", "=", z.coerce.number().parse(req.query.exam_activity_type_id))
    }
    if(req.query.bill_sector_id && z.coerce.number().safeParse(req.query.bill_sector_id).success){
        query = query.where("Exam_Activity.bill_sector_id", "=", z.coerce.number().parse(req.query.bill_sector_id))
    }
    if(req.query.quantity_initial && z.coerce.number().safeParse(req.query.quantity_initial).success){
        query = query.where("Exam_Activity.quantity_initial", "=", z.coerce.number().parse(req.query.quantity_initial))
    }
    if(req.query.quantity_final && z.coerce.number().safeParse(req.query.quantity_final).success){
        query = query.where("Exam_Activity.quantity_final", "=", z.coerce.number().parse(req.query.quantity_final))
    }
    if(req.query.exam_bill && z.coerce.number().safeParse(req.query.exam_id).success){
        query = query.where("Exam_Activity.exam_bill", "=", z.coerce.number().parse(req.query.exam_bill))
    }
    if(req.query.min_exam_bill && z.coerce.number().safeParse(req.query.min_exam_bill).success){
        query = query.where("Exam_Activity.min_exam_bill", "=", z.coerce.number().parse(req.query.min_exam_bill))
    }
    if(req.query.factor && z.string().safeParse(req.query.factor).success){
        query = query.where("Exam_Activity.factor", "=", req.query.factor as string)
    }
    if(req.query.valid_from && z.date().safeParse(req.query.valid_from).success){
        query = query.where("Exam_Activity.valid_from", "=", z.date().parse(req.query.valid_from))
    }

    return query;
}