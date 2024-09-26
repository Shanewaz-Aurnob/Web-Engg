import { Request } from "express";

type ConstructorProps = {
    id ?: number;
    activity_id ?: number;
    factor ?: string;
    quantity ?: number;
};

export class ExamActivityFactorsFilter{
    id ?: number;
    activity_id ?: number;
    factor ?: string;
    quantity ?: number;

    constructor({
        id,
        activity_id,
        factor,
        quantity,
    }: ConstructorProps){
        this.id = id;
        this.activity_id = activity_id;
        this.factor = factor;
        this.quantity = quantity;
    }

    static fromRequest(req: Request): ExamActivityFactorsFilter{
        return new ExamActivityFactorsFilter({
            id: req.query.id as number | undefined,
            activity_id: req.query.activity_id as number | undefined,
            factor: req.query.factor as string | undefined,
            quantity: req.query.quantity as number | undefined,
    });
    }
}