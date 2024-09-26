import express from "express";
import { z } from "zod";
import db, { Database, TableName } from "../database";
import { addFiltration } from "../helper/addFiltration";
import { SelectQueryBuilder } from "kysely";
import { paginatedResults } from "../helper/paginatedResults";

const otherLeaveApplicationRouter = express.Router();

otherLeaveApplicationRouter.get("/", async (req, res) => {
    try {
        var query = db
        .selectFrom("Other_Leave_Application")
        .selectAll();
        
        query = addFiltration("Other_Leave_Application", query as SelectQueryBuilder<Database, TableName, {}>,req) as any;

        paginatedResults(query, req, res);
      }
       catch (error) {
        res.status(500).json({ message: "Internal server error", error });
      }
  });



  const otherLeaveReqBody = z.object({
    applicant_id: z.string(),
    attachments: z.string().nullable(),
    designation: z.string(),
    duration: z.number(),
    final_application: z.string().nullable(),
    leave_ground: z.string().nullable(),
    leave_start_date: z.string().transform((val) => new Date(val)),
    my_application_chairman: z.string().nullable(),
    nature_of_leave: z.string(),
    salary_acknowledgement: z.number().nullable(),
    signature: z.string().nullable(),
    station_leaving_permission: z.string().nullable(),
  });
  
  otherLeaveApplicationRouter.post("/add", async (req, res) => {
    try {
      const { applicant_id,
        attachments,
        designation,
        duration,
        final_application,
        leave_ground,
        leave_start_date,
        my_application_chairman,
        nature_of_leave,
        salary_acknowledgement,
        signature,
        station_leaving_permission } = otherLeaveReqBody.parse(req.body);
  
        await db
          .insertInto("Other_Leave_Application")
          .values({
            applicant_id: applicant_id,
        attachments: attachments,
        designation: designation,
        duration : duration,
        final_application: final_application,
        leave_ground: leave_ground,
        leave_start_date: leave_start_date,
        my_application_chairman: my_application_chairman,
        nature_of_leave: nature_of_leave,
        salary_acknowledgement: salary_acknowledgement,
        signature: signature,
        station_leaving_permission: station_leaving_permission     
        })
        .executeTakeFirst();
  
        
  
      // Return the session id
      res.status(200).send({
        message: "Data Inserted Successfully in Other_Leave_Application Table.",
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

  export default otherLeaveApplicationRouter;