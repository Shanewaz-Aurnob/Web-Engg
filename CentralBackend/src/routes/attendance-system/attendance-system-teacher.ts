import express from "express";
import { z } from "zod";
import db, { Database, TableName } from "../../database";
import { addFiltration } from "../../helper/addFiltration";
import { SelectQueryBuilder } from "kysely";
import { paginatedResults } from "../../helper/paginatedResults";

const attendanceSystemTeacherRouter = express.Router();

attendanceSystemTeacherRouter.get("/", async (req, res) => {
    try {
        const teacherId=12345679;

        var query = db
        .selectFrom('Course_Teacher')
        .innerJoin('Courses_in_Semester', 'Courses_in_Semester.course_id', 'Course_Teacher.course_id')
        .innerJoin('Academic_Session', 'Academic_Session.academic_session_id', 'Course_Teacher.academic_session_id')
        .innerJoin('Course', 'Course.course_id', 'Course_Teacher.course_id')
        .innerJoin('Program', 'Academic_Session.program_id', 'Program.program_id')
        .selectAll()
        .where('Course_Teacher.teacher_id', '=', teacherId);
        

        paginatedResults(query, req, res);
      }
       catch (error) {
        res.status(500).json({ message: "Internal server error", error });
      }
  });

  const createClassReqBody = z.object({
    course_id: z.number(),
    session: z.string(),
    class_startTime: z.string().time(),
    duration: z.number(),
    secret_code: z.string(),
    class_startDate: z.string().date()
  });
  
  attendanceSystemTeacherRouter.post("/create-session", async (req, res) => {
    try {
      const { course_id, session, class_startTime, duration, secret_code, class_startDate } = createClassReqBody.parse(req.body);
  
        await db
          .insertInto("Create_Class")
          .values({
            course_id: course_id,
            session: session,
            class_startTime: class_startTime,
            duration: duration,
            secret_code: secret_code,
            class_startDate: class_startDate
        })
        .executeTakeFirst();
  
        
  
      // Return the session id
      res.status(200).send({
        message: "Data Inserted Successfully in Create_Class Table.",
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

  
  

  export default attendanceSystemTeacherRouter;