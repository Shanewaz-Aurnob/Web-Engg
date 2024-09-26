import { NextFunction, Request, Response } from "express";
import { z } from "zod";
import db from "../database";
import { SessionRequest } from "./verifySession";

const authHeader = z.string();

export enum Role {
  Teacher = "Teacher",
  Student = "Student",
  Staff = "Staff",
}
export interface PermissionRequest extends SessionRequest {
  role?: Role;
  uid?: number | string;
}

export async function checkPermissions(
  req: PermissionRequest,
  res: Response,
  next: NextFunction,
) {
  try {
    const uid = req.session!.user_id;

    // Check if the user is a teacher
    const isTeacher = await db
      .selectFrom("Teacher")
      .where("user_id", "=", uid)
      .select("Teacher.teacher_id")
      .executeTakeFirst();

    if (isTeacher) {
      req.role = Role.Teacher;
      req.uid = isTeacher.teacher_id ?? 0;
      return next();
    }

    // Check if the user is a staff
    const isStaff = await db
      .selectFrom("Roles")
      .where("user_id", "=", uid)
      .select("Roles.user_id")
      .executeTakeFirst();

    if (isStaff) {
      req.role = Role.Staff;
      req.uid = isStaff.user_id;
      return next();
    }

    // Check if the user is a student
    const isStudent = await db
      .selectFrom("Student")
      .where("user_id", "=", uid)
      .select("Student.student_id")
      .executeTakeFirst();

    if (isStudent) {
      req.role = Role.Student;
      req.uid = isStudent.student_id;
      return next();
    }

    return res
      .status(403)
      .json({ message: "You do not have permission to access this." });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return res.status(403).json({
        message: "Invalid token",
        error: JSON.parse((error as z.ZodError).message),
      });
    }
  }
}
