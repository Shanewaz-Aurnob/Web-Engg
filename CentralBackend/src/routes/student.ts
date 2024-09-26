import express, { Request, Response } from "express";
const studentRouter = express.Router();
import db, { Database, TableName } from "../database";
import { paginatedResults } from "../helper/paginatedResults";
import { z } from "zod";
import { verifySession } from "../middlewares/verifySession";
import {
  PermissionRequest,
  Role,
  checkPermissions,
} from "../middlewares/checkPermissions";
import { getStudentInfo } from "../middlewares/getStudentInfo";
import { getStudents } from "../middlewares/getStudents";
import { addFiltration } from "../helper/addFiltration";
import { SelectQueryBuilder } from "kysely";

// If the requesting user is a student, return their infromation,
// If the requesting user is a teacher or a staff, return all students
studentRouter.get(
  "/",
  verifySession,
  checkPermissions,
  getStudentInfo,
  getStudents,
  async (req, res) => {
    try {
      var query = db
        .selectFrom("Student")
        .innerJoin("User", "Student.user_id", "User.user_id")
        .selectAll();

      query = addFiltration("Student", query, req) as any;
      query = addFiltration("User", query as any, req) as any;

      paginatedResults(query, req, res);
    } catch (error) {
      console.log(error);
      res.status(500).json({ message: "Internal server error", error });
    }
  },
);

studentRouter.get(
  "/:id",
  verifySession,
  checkPermissions,
  async (req: PermissionRequest, res: Response) => {
    try {
      const student_id = z.coerce.number().parse(req.params.id);
      const sid = await db
        .selectFrom("Student")
        .where("Student.user_id", "=", req.session?.user_id!)
        .select("student_id")
        .executeTakeFirst();

      var flag =
        sid?.student_id === student_id ||
        req.role === Role.Teacher ||
        req.role === Role.Staff;
      if (!flag) {
        return res.status(403).json({
          message: "You don't have enough permissions to access this document.",
        });
      }

      const data = await db
        .selectFrom("Student")
        .where("Student.student_id", "=", student_id)
        .innerJoin("User", "Student.user_id", "User.user_id")
        .innerJoin(
          "Department",
          "Department.department_id",
          "Student.department_id",
        )
        .leftJoin(
          "Academic_Session",
          "Academic_Session.academic_session_id",
          "Student.academic_session_id",
        )
        .leftJoin("Hall", "Hall.hall_id", "Student.hall_id")
        .selectAll()
        .executeTakeFirst();

      if (!data) {
        return res.status(404).json({
          message: "Student with id " + student_id + " not found",
        });
      }

      data.password = "";

      var addressQuery = db.selectFrom("Address").selectAll();
      const permanentAddress = await addressQuery
        .where("Address.address_id", "=", data.permanent_address_id ?? 0)
        .executeTakeFirst();
      const presentAddress = await addressQuery
        .where("Address.address_id", "=", data.present_address_id ?? 0)
        .executeTakeFirst();
      const guardiansAddress = await addressQuery
        .where("Address.address_id", "=", data.guardian_address_id ?? 0)
        .executeTakeFirst();

      return res.status(200).json({
        ...data,
        permanent_address: permanentAddress,
        present_address: presentAddress,
        guardians_address: guardiansAddress,
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

export default studentRouter;
