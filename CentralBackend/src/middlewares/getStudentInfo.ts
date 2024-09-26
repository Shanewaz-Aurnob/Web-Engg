import { NextFunction, Response } from "express";
import { PermissionRequest, Role } from "./checkPermissions";
import db from "../database";
import { z } from "zod";

export async function getStudentInfo(req: PermissionRequest, res: Response, next: NextFunction) {
    if(req.role !== Role.Student) {
        return next()
    }

    try {
        const sid = z.coerce.number().parse(req.uid)

        const student = await db.selectFrom("Student")
        .where("Student.student_id", "=", sid)
        .innerJoin("User", "Student.user_id", "User.user_id")
        .selectAll()
        .executeTakeFirst();
        if(!student) {
            return res.status(404).json({ message: "Student not found" })
        }

        student.password = "";
        return res.status(200).json(student)
    } catch(error) {
        if(error instanceof z.ZodError) {
            return res.status(400).json({
                name: "Invalid data type.",
                message: JSON.parse(error.message),
            })
        }

        return res.status(400).json({ message: "Invalid request body", error })
    }
}