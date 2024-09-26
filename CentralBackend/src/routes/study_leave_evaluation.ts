import express from "express";
import { z } from "zod";
import db, { Database, TableName } from "../database";
import { addFiltration } from "../helper/addFiltration";
import { SelectQueryBuilder } from "kysely";
import { paginatedResults } from "../helper/paginatedResults";

const studyLeaveEvaluationRouter = express.Router();

studyLeaveEvaluationRouter.get("/", async (req, res) => {
    try {
        var query = db
        .selectFrom("Study_Leave_Evaluation")
        .selectAll();
        
        query = addFiltration("Study_Leave_Evaluation", query as SelectQueryBuilder<Database, TableName, {}>,req) as any;

        paginatedResults(query, req, res);
      }
       catch (error) {
        res.status(500).json({ message: "Internal server error", error });
      }
  });

  const studyLeaveEvaluatesReqBody = z.object({
    applicant_id: z.string(),
    evaluation_type: z.string(),
    le_comment: z.string().nullable(),
    le_evaluation_time: z.string().transform((val) => new Date(val)),
    le_status: z.string(),
    leave_id: z.number(),
  });
  
  studyLeaveEvaluationRouter.post("/add", async (req, res) => {
    try {
      const { applicant_id,
        evaluation_type,
        le_comment,
        le_evaluation_time,
        le_status,
        leave_id } = studyLeaveEvaluatesReqBody.parse(req.body);
  
        await db
          .insertInto("Study_Leave_Evaluation")
          .values({
            applicant_id: applicant_id,
            evaluation_type: evaluation_type,
            le_comment: le_comment,
            le_evaluation_time: le_evaluation_time,
            le_status: le_status,
            leave_id: leave_id    
        })
        .executeTakeFirst();
  
        
  
      
      res.status(200).send({
        message: "Data Inserted Successfully in Study_Leave_Evaluation Table.",
      });
    } catch (error) {
      var typeError: z.ZodError | undefined;
      if (error instanceof z.ZodError) {
        typeError = error as z.ZodError;
        return res.status(400).json({
          name: "Invalid data type.",
          message: JSON.parse(typeError.message),
        });
      }
      return res.status(400).json({ message: "Invalid request body", error });
    }
  });

  studyLeaveEvaluationRouter.put('/update',async (req, res)=>{
    const { applicant_id,
        evaluation_type,
        le_comment,
        le_evaluation_time,
        le_status,
        leave_id } = studyLeaveEvaluatesReqBody.parse(req.body);
    try{
        await db
            .updateTable('Study_Leave_Evaluation')
            .set({
                le_status:le_status,
                le_comment: le_comment,
                le_evaluation_time: le_evaluation_time
            })
            .where('Study_Leave_Evaluation.evaluation_type','=',evaluation_type)
            .where('Study_Leave_Evaluation.leave_id','=',leave_id)
            .where('Study_Leave_Evaluation.applicant_id','=',applicant_id)
        .executeTakeFirst();

        res.status(200).send({
            message: "Data Updated Successfully in Study_Leave_Evaluation Table.",
          });

    } catch(error){
        var typeError: z.ZodError | undefined;
      if (error instanceof z.ZodError) {
        typeError = error as z.ZodError;
        return res.status(400).json({
          name: "Invalid data type.",
          message: JSON.parse(typeError.message),
        });
      }
      return res.status(400).json({ message: "Invalid request body", error });

    }

  });

  export default studyLeaveEvaluationRouter;