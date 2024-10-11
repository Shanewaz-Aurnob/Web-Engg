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
        .innerJoin('Courses_in_Semester', (join) => 
        join
        .onRef("Courses_in_Semester.academic_session_id", "=", "Course_Teacher.academic_session_id")
        .onRef("Courses_in_Semester.course_id", "=", "Course_Teacher.course_id")
        )
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
        console.log(result)
  
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
      const status = "A";  // Example status
  
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
  
  attendanceSystemTeacherRouter.get("/get-attendance", async (req, res) => {
    try {
      // Parse the query parameters
      const course_id = Number(req.query.course_id as string);
      const academic_session_id = Number(req.query.academic_session_id as string);
  
      // Find the session IDs for the given course code and academic session
      const sessions = await db
        .selectFrom("Create_Class")
        .select(["session_id", "class_startDate"])
        .where("course_id", "=", course_id)
        .where("academic_session_id", "=", academic_session_id)
        .execute();
  
      // Extract session IDs and dates
      const sessionIds = sessions.map(session => session.session_id);

      if(sessionIds.length == 0) return res.json([]);
      console.log(sessionIds);
  
      // Get student attendance for those sessions
      const attendanceRecords = await db
        .selectFrom("Student_Attendance")
        .select(["student_id", "session_id", "date", "status"])
        .where("session_id", "in", sessionIds)
        .execute();
  
      // Organize the response by session_id and date
      const attendanceMap: Record<number, { session_id: number, date: string, students: { id: number, status: string | null }[] }[]> = {};
  
      attendanceRecords.forEach(record => {
        // Convert date to string in the format "YYYY-MM-DD"
        const dateStr = typeof record.date === 'string'
          ? record.date
          : record.date.toISOString().split('T')[0]; 
  
        // Check if session_id exists in the attendanceMap
        if (!attendanceMap[record.session_id]) {
          attendanceMap[record.session_id] = [];
        }
  
        // Check if the specific date exists for the current session_id
        let dateEntry = attendanceMap[record.session_id].find(entry => entry.date === dateStr);
  
        // If no dateEntry for this session_id and date, create it
        if (!dateEntry) {
          dateEntry = {
            session_id: record.session_id,
            date: dateStr,
            students: []
          };
          attendanceMap[record.session_id].push(dateEntry);
        }
  
        // Add the student's attendance to the students array
        dateEntry.students.push({
          id: record.student_id,
          status: record.status
        });
      });
  
      // Send success response with attendance data
      res.status(200).send(attendanceMap);
    } catch (error) {
      // Handle errors and send failure response
      res.status(400).json({ message: "Failed to retrieve attendance records", error });
    }
  });
  
  attendanceSystemTeacherRouter.patch("/update-attendance", async (req, res) => {
    try {
      // Extract parameters from the request body
      const { student_id, session_id } = req.body;
  
      // Validate required fields
      if (!student_id || !session_id) {
        return res.status(400).send('Missing required fields: student_id and session_id');
      }
  
      // Update the status in the Student_Attendance table
      const result = await db
        .updateTable("Student_Attendance")
        .set({ status: "P" }) // Set the status to "P"
        .where('student_id', '=', student_id)
        .where('session_id', '=', session_id)
        .executeTakeFirst();
  
      // Check if the update was successful by converting bigint to number
      if (Number(result.numUpdatedRows) === 0) {
        return res.status(404).send('Attendance record not found');
      }
  
      // Send success response
      res.status(200).send({
        message: "Attendance status updated successfully."
      });
    } catch (error) {
      console.error('Error updating attendance:', error);
      res.status(500).send('Server error');
    }
  });
  
  type responseType = {
    total_held_class: number;
    attended_classes: number;
    course_id: number;
    course_code: string;
    course_title: string;
    course_type: "Lab" | "Project" | "Theory" | "Thesis" | "Viva" | null;
    credit: number;
    department_id: number;
    exam_minutes: number;
  }

  
  const semesterResult = z.object({
    student_id: z.coerce.number(),
    academic_session_id: z.coerce.number()
})


attendanceSystemTeacherRouter.get("/courses", async (req, res) => {
  try {
      const { student_id, academic_session_id } = semesterResult.parse(req.query);
      
      const courses = await db
          .selectFrom("Course_Teacher")
          .distinct()
          .where("Course_Teacher.academic_session_id", "=", academic_session_id)
          .select(["Course_Teacher.course_id as course_id"])
          .execute();
      
      const response = await Promise.all(courses.map(async (course) => {
          const courseDetails = await db
              .selectFrom("Course")
              .where("course_id", "=", course.course_id)
              .selectAll()
              .executeTakeFirstOrThrow();

          const sessionsObj = await db
              .selectFrom("Create_Class")
              .where("academic_session_id", "=", academic_session_id)
              .where("course_id", "=", course.course_id)
              .select("session_id")
              .execute();

          const sessions = sessionsObj.map(session => session.session_id);
          
          const student_attended = await db
              .selectFrom("Student_Attendance")
              .where("session_id", "in", sessions)
              .where("student_id", "=", student_id)
              .where('status', "=", "P")
              .selectAll()
              .execute();

          return {
              total_held_class: sessionsObj.length,
              attended_classes: student_attended.length,
              ...courseDetails
          };
      }));
      
      res.status(200).json(response);
  } catch (error) {
      if (error instanceof z.ZodError) {
          return res.status(400).json({ name: "Invalid academic session id", message: JSON.parse(error.message) });
      }
      return res.status(500).json({ message: "Internal server error", error });
  }
});

attendanceSystemTeacherRouter.get("/student-info", async (req, res) => {
         try {
    const student_id = Number(req.query.student_id as string);

    const query = await db
      .selectFrom("Student")
      .where("Student.student_id", "=", student_id)
      .innerJoin("User", "User.user_id", "Student.user_id")
      .innerJoin(
        "Academic_Session",
        "Academic_Session.academic_session_id",
        "Student.academic_session_id"
      )
      .selectAll()
      .execute();

    return res.status(200).json(query[0]);
  } catch (error) {
    if (error instanceof z.ZodError) {
      return res.status(400).json({
        name: "Invalid student id",
        message: JSON.parse(error.message),
      });
    }
    return res.status(500).json({ message: "Internal server error", error });
  }
});

  

  export default attendanceSystemTeacherRouter;
