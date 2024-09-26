import express from "express";
import { z } from "zod";
import db from "../../database";

const studentResultRouter = express.Router();

const studentResultGetQuerySchema = z.object({
    academic_session_id: z.coerce.number(),
    student_id: z.coerce.number(), 
});

// /api/student-info/result?academic_session_id={...}&student_id={...}

studentResultRouter.get("/", async (req, res) => {
    try {
        const {
            academic_session_id,
            student_id
        } = studentResultGetQuerySchema.parse(req.query);;

        
        const query = db
            .selectFrom("Exam")
            .innerJoin(
                "Marksheet",
                "Exam.exam_id",
                "Marksheet.exam_id"
            )
            .innerJoin(
                "Course",
                "Course.course_id",
                "Marksheet.course_id"
            )
            .where(
                "Exam.academic_session_id",
                "=",
                academic_session_id
            )
            .where(
                "Marksheet.student_id",
                "=",
                student_id
            )
            .selectAll(); 

        return res.status(200).json(await query.execute());
    } catch (err) {
        console.error(err);
        if (err instanceof z.ZodError) {
            return res.status(400).json({ message: "unknown search parameter" });
        } else {
            return res.status(500).json({ message: `internal server error` });
        }
    }
});



export default studentResultRouter;
