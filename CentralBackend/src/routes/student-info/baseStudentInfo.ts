import express from "express";
import { z } from "zod";
import db from "../../database";

const studentInfoRouter = express.Router();

const studentInfoGetQuerySchema = z.object({
    session_id: z.coerce.string(),
});

// ?session_id={...}

studentInfoRouter.get("/", async (req, res) => {
    try {
        const {
            session_id
        } = studentInfoGetQuerySchema.parse(req.query);


        const student = await db
            .selectFrom("Auth_Session")
            .innerJoin(
                "User", 
                "Auth_Session.user_id", 
                "User.user_id"
            )
            .innerJoin(
                "Student",
                "User.user_id",
                "Student.user_id"
            )
            .innerJoin(
                "Hall", 
                "Student.hall_id", 
                "Hall.hall_id"
            )
            .innerJoin(
                "Department",
                "Student.department_id",
                "Department.department_id"
            )
            .innerJoin(
                "University",
                "Department.university_id",
                "University.university_id"
            )
            .where(
                "Auth_Session.session_id",
                "=",
                session_id
            )
            .selectAll()
            .executeTakeFirst();
        
        if (!student) { 
            return res.status(403).json({ message: "Invalid credentials" });
        }
        student.password = "";
        
        return res.status(200).json(student);
    } catch (err) {
        console.error(err);
        if (err instanceof z.ZodError) {
            return res.status(400).json({ message: "unknown search parameter" });
        } else {
            return res.status(500).json({ message: `internal server error` });
        }
    }
});



export default studentInfoRouter;
