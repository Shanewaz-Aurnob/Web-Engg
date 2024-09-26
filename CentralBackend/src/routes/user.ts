import express, { Request, Response } from "express";
const userRouter = express.Router();
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

// Get user information according to user's role
userRouter.get(
  "/",
  verifySession,
  checkPermissions,
  async (req: PermissionRequest, res: Response) => {
    const uid = req.session?.user_id ?? "";
    if (req.role === Role.Student) {
      const data = await db
        .selectFrom("Student")
        .where("Student.user_id", "=", uid)
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
      if (data) {
        data.password = "";
      }

      return res.status(200).json(data);
    }

    var query = db.selectFrom("User").where("User.user_id", "=", uid);
    if (req.role === Role.Teacher) {
      query = query.innerJoin("Teacher", "Teacher.user_id", "User.user_id");
    }

    const rolesQuery = db
      .selectFrom("Roles")
      .where("Roles.user_id", "=", uid)
      .selectAll();

    const data = await query.selectAll().executeTakeFirst();
    data!.password = "";
    const roles = await rolesQuery.execute();
    return res.status(200).json({ ...data, roles });
  },
);

export default userRouter;
