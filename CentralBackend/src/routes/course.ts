import express, { Request, Response } from "express";
const courseRouter = express.Router();
import db, { Database, TableName } from "../database";
import { z } from "zod";
import { addFiltration } from "../helper/addFiltration";
import { paginatedResults } from "../helper/paginatedResults";
import { verifySession } from "../middlewares/verifySession";
import {
  PermissionRequest,
  Role,
  checkPermissions,
} from "../middlewares/checkPermissions";
import { CourseTypeEnum } from "../helper/filterHelpers/addCourseFilters";
import { sql } from "kysely";

courseRouter.get("/:id", async (req, res) => {
  try {
    const course_id = z.coerce.number().parse(req.params.id);
    const data = await db
      .selectFrom("Course")
      .selectAll()
      .where("Course.course_id", "=", course_id)
      .executeTakeFirst();

    if (!data) {
      return res
        .status(404)
        .json({ message: "Course with id" + course_id + " not found" });
    }

    // Get department info
    const dept = await db
      .selectFrom("Department")
      .selectAll()
      .where("Department.department_id", "=", data.department_id)
      .executeTakeFirst();

    return res.status(200).json({ ...data, department: dept });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return res.status(400).json({
        name: "Invalid data type.",
        message: JSON.parse(error.message),
      });
    }

    return res.status(500).json({ message: "Internal server error", error });
  }
});

const CourseUpdateReqBody = z.object({
  department_id: z.number().optional(),
  course_code: z.string().optional(),
  course_title: z.string().optional(),
  credit: z.number().optional(),
  course_type: CourseTypeEnum.optional(),
  exam_minutes: z.number().optional(),
});

courseRouter.put(
  "/:id",
  verifySession,
  checkPermissions,
  async (req: PermissionRequest, res) => {
    // TODO: Only allow staff that have ennough privilege here
    if (req.role != Role.Staff) {
      return res.status(403).json({
        message: "You don't have enough permissions to access this document.",
      });
    }

    try {
      const course_id = z.coerce.number().parse(req.params.id);
      const courseInfo = CourseUpdateReqBody.parse(req.body);
      const has_update = Object.keys(courseInfo).length > 0;

      if (!has_update) {
        return res.status(400).json({
          name: "Invalid update.",
          message: "Nothing to update.",
        });
      }

      var query = db
        .updateTable("Course")
        .where("Course.course_id", "=", course_id);

      if (courseInfo.department_id) {
        query = query.set({ department_id: courseInfo.department_id });
      }

      if (courseInfo.course_code) {
        query = query.set({ course_code: courseInfo.course_code });
      }

      if (courseInfo.course_title) {
        query = query.set({ course_title: courseInfo.course_title });
      }

      if (courseInfo.credit) {
        query = query.set({ credit: courseInfo.credit });
      }

      if (courseInfo.course_type) {
        query = query.set({
          course_type: courseInfo.course_type.toString() as
            | "Lab"
            | "Project"
            | "Theory"
            | "Thesis"
            | "Viva"
            | null,
        });
      }

      if (courseInfo.exam_minutes) {
        query = query.set({ exam_minutes: courseInfo.exam_minutes });
      }

      await query.execute();

      return res.status(200).json({ message: "Course updated successfully." });
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({
          name: "Invalid data type.",
          message: JSON.parse(error.message),
        });
      }
      return res.status(500).json({ message: "Internal server error", error });
    }
  },
);

courseRouter.get("/", async (req, res) => {
  try {
    var query = db.selectFrom("Course").selectAll();
    query = addFiltration("Course", query, req);
    paginatedResults(query as any, req, res);
  } catch (error) {
    return res.status(500).json({ message: "Internal server error", error });
  }
});

const CourseReqBody = z.object({
  department_id: z.number(),
  course_code: z.string(),
  course_title: z.string(),
  credit: z.number(),
  course_type: CourseTypeEnum,
  exam_minutes: z.number(),
});

courseRouter.post(
  "/",
  verifySession,
  checkPermissions,
  async (req: PermissionRequest, res) => {
    // TODO: Only allow staff that have ennough privilege here
    if (req.role != Role.Staff) {
      return res.status(403).json({
        message: "You don't have enough permissions to access this document.",
      });
    }

    try {
      const courseInfo = CourseReqBody.parse(req.body);

      await db
        .insertInto("Course")
        .values({
          course_code: courseInfo.course_code,
          course_title: courseInfo.course_title,
          credit: courseInfo.credit,
          course_type: courseInfo.course_type.toString() as
            | "Lab"
            | "Project"
            | "Theory"
            | "Thesis"
            | "Viva"
            | null,
          exam_minutes: courseInfo.exam_minutes,
          department_id: courseInfo.exam_minutes,
        })
        .execute();

      const data = await db
        .selectFrom("Course")
        .select(sql`LAST_INSERT_ID()`.as("course_id"))
        .executeTakeFirst();

      if (!data) {
        return res.status(500).json({ message: "Internal server error" });
      }

      return res.status(200).json({
        course_id: data.course_id,
        message: "Course created successfully",
      });
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({
          name: "Invalid data type.",
          message: JSON.parse(error.message),
        });
      }

      return res.status(500).json({ message: "Internal server error", error });
    }
  },
);

export default courseRouter;
