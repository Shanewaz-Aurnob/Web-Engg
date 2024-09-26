import express from "express";
import { z } from "zod";
import db, { Database, TableName } from "../../database";

const studentCourseSemsterRouter = express.Router();

const studentCourseSemesterGetSchema = z.object({
  academic_session_id: z.coerce.number(),
});

// /api/student-info/course-semester?academic_session_id={...}

studentCourseSemsterRouter.get("/", async (req, res) => {
  try {
    const { academic_session_id } = studentCourseSemesterGetSchema.parse(
      req.query,
    );
    const query = db
      .selectFrom("Courses_in_Semester")
      .where(
        "Courses_in_Semester.academic_session_id",
        "=",
        academic_session_id,
      )
      .innerJoin("Course", "Courses_in_Semester.course_id", "Course.course_id")
      .innerJoin(
        "Academic_Session",
        "Academic_Session.academic_session_id",
        "Courses_in_Semester.academic_session_id",
      )
      .innerJoin("Course_Teacher", (join) =>
        join
          .onRef("Course_Teacher.course_id", "=", "Course.course_id")
          .onRef(
            "Course_Teacher.academic_session_id",
            "=",
            "Academic_Session.academic_session_id",
          ),
      )
      .innerJoin("Teacher", "Course_Teacher.teacher_id", "Teacher.teacher_id")
      .innerJoin(
        // don't know how to get teacher's info without
        "User", // User table
        "Teacher.user_id",
        "User.user_id",
      )
      .select([
        "Course.course_code",
        "Course.course_id",
        "Course.course_title",
        "Course.course_type",
        "Course.credit",
        "Course.department_id",
        "Course.exam_minutes",
        "Courses_in_Semester.academic_session_id",
        "Courses_in_Semester.catm_submit_date",
        "Courses_in_Semester.is_catm_submitted",
        "Courses_in_Semester.result_status",
        "Courses_in_Semester.result_submit_date",
        "Courses_in_Semester.is_decoded",
        "Teacher.department_id",
        "Teacher.teacher_id",
        "Teacher.title",
        "Teacher.designation",
        "Teacher.area_of_interest",
        "User.email",
        "User.first_name",
        "User.last_name",
        "User.first_name_bn",
        "User.last_name_bn",
        "User.phone",
        "User.profile_image_id",
      ]);
    const data = await query.execute();
    return res.status(200).json(data);
  } catch (error) {
    if (error instanceof z.ZodError) {
      return res.status(400).json({
        name: "Invalid academic session id",
        message: JSON.parse(error.message),
      });
    }

    return res.status(500).json({ message: "Internal server error", error });
  }
});

export default studentCourseSemsterRouter;
