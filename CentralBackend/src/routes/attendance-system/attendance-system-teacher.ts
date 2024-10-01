import express from "express";
import { z } from "zod";
import db, { Database, TableName } from "../../database";
import { addFiltration } from "../../helper/addFiltration";
import { SelectQueryBuilder } from "kysely";
import { paginatedResults } from "../../helper/paginatedResults";

const attendanceSystemTeacherRouter = express.Router();

attendanceSystemTeacherRouter.get("/", async (req, res) => {
    try {
        const teacherId=5008;

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
    academic_session_id: z.number(),
    class_startTime: z.string().time(),
    duration: z.number(),
    secret_code: z.string(),
    class_startDate: z.string().date(),
    class_endTime: z.string().time(),
    teacher_id: z.number()
  });
  
  attendanceSystemTeacherRouter.post("/create-session", async (req, res) => {
    try {
      // Parse the incoming request body
      const { course_id, academic_session_id, class_startTime, duration, secret_code, class_startDate, class_endTime, teacher_id } = createClassReqBody.parse(req.body);
  
      // Insert the data into the Create_Class table
      const insertResult = await db
        .insertInto("Create_Class")
        .values({
          course_id: course_id,
          academic_session_id: academic_session_id,
          class_startTime: class_startTime,
          duration: duration,
          secret_code: secret_code,
          class_startDate: class_startDate,
          class_endTime: class_endTime,
          teacher_id: teacher_id
        })
        .executeTakeFirstOrThrow(); // Ensure the insert succeeds, throws if it doesn't
  
      // Assuming `session_id` is an auto-incremented field and is unique
      const insertedRow = await db
        .selectFrom("Create_Class")
        .selectAll()
        .where("course_id", "=", course_id)
        .where("class_startDate", "=", class_startDate)
        .where("teacher_id", "=", teacher_id)
        .executeTakeFirstOrThrow(); // Fetch the inserted row using unique columns
  
      // Return the inserted row as the response
      res.status(200).send({
        message: "Data Inserted Successfully in Create_Class Table.",
        data: insertedRow
      });
    } catch (error) {
      let typeError: z.ZodError | undefined;
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
  
  

  attendanceSystemTeacherRouter.get("/class", async (req, res) => {
    // Extract query string parameters from the request
  const academic_sessionValue = Number(req.query.academic_session_id as string);
  const currentDateValue = req.query.currentDate as string;
  const currentTimeValue = req.query.currentTime as string;

  // Validate the query parameters
  if (!academic_sessionValue || !currentDateValue || !currentTimeValue) {
    return res.status(400).send('Missing required query parameters');
  }
    try {
      // Execute the Kysely query using the extracted values
      const result = await db
        .selectFrom('Create_Class')
        .selectAll()
        .where('Create_Class.academic_session_id', '=', academic_sessionValue)
        .where('Create_Class.class_startDate', '=', currentDateValue)
        .where('Create_Class.class_endTime', '>=', currentTimeValue)
        .execute();
  
      // Send the query result as the response
      res.json(result);
    } catch (error) {
      console.error('Error executing query:', error);
      res.status(500).send('Server error');
    }
  });

  attendanceSystemTeacherRouter.get("/students-by-acc-id", async (req, res) => {
    // Extract query string parameters from the request
  const academic_sessionValue = Number(req.query.academic_session_id as string);
  

  // Validate the query parameters
  if (!academic_sessionValue ) {
    return res.status(400).send('Missing required query parameters');
  }
    try {
      // Execute the Kysely query using the extracted values
      const result = await db
      .selectFrom('Student')
      .selectAll()
      .where('Student.academic_session_id', '=', academic_sessionValue)
      .execute();
  
      // Send the query result as the response
      res.json(result);
    } catch (error) {
      console.error('Error executing query:', error);
      res.status(500).send('Server error');
    }
  });

  attendanceSystemTeacherRouter.post("/add-students", async (req, res) => {
    try {
      const { course_id, academic_session_id, class_startTime, duration, secret_code, class_startDate, class_endTime , teacher_id} = createClassReqBody.parse(req.body);
  
        await db
          .insertInto("Create_Class")
          .values({
            course_id: course_id,
            academic_session_id:academic_session_id,
            class_startTime: class_startTime,
            duration: duration,
            secret_code: secret_code,
            class_startDate: class_startDate,
            class_endTime: class_endTime,
            teacher_id: teacher_id
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


  attendanceSystemTeacherRouter.post("/create-attendance", async (req, res) => {
    try {
      // Parse the incoming JSON array (from your example)
      const students = req.body; // Assuming the request body contains the JSON array


  
      // Define session_id, date, and status for the attendance
      const session_id = Number(req.query.session_id as string); // Example session_id
      const date = req.query.currentDate as string;;  // Example date
      const status = "Absent";  // Example status
  
      // Loop through each student and insert attendance records
      const insertPromises = students.map(async (student: any) => {
        const { student_id, user_id } = student;
        return db
          .insertInto("Student_Attendance")
          .values({
            session_id: session_id,
            user_id: user_id,
            student_id: student_id,
            date: date,
            status: status
          })
          .executeTakeFirst();
      });
  
      // Wait for all insertions to complete
      await Promise.all(insertPromises);
  
      // Send success response
      res.status(200).send({
        message: "Attendance records inserted successfully."
      });
    } catch (error) {
      res.status(400).json({ message: "Failed to insert attendance records", error });
    }
  });
  


  
  

  export default attendanceSystemTeacherRouter;