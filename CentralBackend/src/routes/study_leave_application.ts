import express from "express";
import { z } from "zod";
import db, { Database, TableName } from "../database";
import { addFiltration } from "../helper/addFiltration";
import { SelectQueryBuilder } from "kysely";
import { paginatedResults } from "../helper/paginatedResults";

const studyLeaveApplicationRouter = express.Router();

studyLeaveApplicationRouter.get("/", async (req, res) => {
    try {
        var query = db
        .selectFrom("Study_Leave_Application")
        .selectAll();
        
        query = addFiltration("Study_Leave_Application", query as SelectQueryBuilder<Database, TableName, {}>,req) as any;

        paginatedResults(query, req, res);
      }
       catch (error) {
        res.status(500).json({ message: "Internal server error", error });
      }
  });




  const studyLeaveReqBody = z.object({
    applicant_id: z.string(),
    applied_date: z.string().transform((val) => new Date(val)),
    attachments: z.string().nullable(),
    department: z.string(),
    designation: z.string(),
    destination: z.string(),
    destination_country: z.string(),
    duration: z.number(),
    final_application: z.string().nullable(),
    financial_source: z.string(),
    joining_date:z.string().transform((val) => new Date(val)),
    leave_start_date:z.string().transform((val) => new Date(val)),
    my_application_chairman: z.string().nullable(),
    my_application_registrar: z.string().nullable(),
    name_of_program: z.string(),
    program_start_date: z.string().transform((val) => new Date(val)),
    signature: z.string().nullable(),
  });
  
  studyLeaveApplicationRouter.post("/add", async (req, res) => {
    try {
      const { applicant_id,
        applied_date,
        attachments,
        department,
        designation,
        destination,
        destination_country,
        duration,
        final_application,
        financial_source,
        joining_date,
        leave_start_date,
        my_application_chairman,
        my_application_registrar,
        name_of_program,
        program_start_date,
        signature } = studyLeaveReqBody.parse(req.body);
  
        await db
          .insertInto("Study_Leave_Application")
          .values({
            applicant_id: applicant_id,
            applied_date: applied_date,
            attachments: attachments,
            department: department,
            designation: designation,
            destination: destination,
            destination_country:destination_country,
            duration: duration,
            final_application: final_application,
            financial_source: financial_source,
            joining_date:joining_date,
            leave_start_date: leave_start_date,
            my_application_chairman: my_application_chairman,
            my_application_registrar: my_application_registrar,
            name_of_program: name_of_program,
            program_start_date: program_start_date,
            signature: signature
        })
        .executeTakeFirst();
  
        
  
      // Return the session id
      res.status(200).send({
        message: "Data Inserted Successfully in Study_Leave_Application Table.",
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

  export default studyLeaveApplicationRouter;