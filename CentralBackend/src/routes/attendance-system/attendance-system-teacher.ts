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


  
  

  export default attendanceSystemTeacherRouter;