import express from "express";
import { z } from "zod";
import db from "../../database";

const studentHistoryRouter = express.Router();

const studentHistoryGetQuerySchema = z.object({
    academic_session_id: z.coerce.number(),
});

// /api/student-info/history?academic_session_id={...}

studentHistoryRouter.get("/", async (req, res) => {
    try {
        const validatedQueryObject = studentHistoryGetQuerySchema.parse(req.query);
        const { 
            academic_session_id
         } = validatedQueryObject;

        const baseAcademicSession = academic_session_id.toString().slice(0, 4);
        const query = db
            .selectFrom("Academic_Session")
            .innerJoin(
                "Program",
                "Academic_Session.program_id",
                "Program.program_id"
            )
            .innerJoin(
                "Student_Program",
                "Program.program_id",
                "Student_Program.student_program_id"
            )
            .where("Academic_Session.session", "like", `${baseAcademicSession}%`)
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



export default studentHistoryRouter;
