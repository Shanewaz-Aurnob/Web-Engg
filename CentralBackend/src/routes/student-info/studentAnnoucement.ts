import express from "express";
import { date, z } from "zod";
import db from "../../database";

const studentAnnouncementSubmissionRouter = express.Router();


const announcementSubmissionPostSchema = z.object({
    academic_session_id: z.coerce.number(),
    announcement: z.coerce.string(),
    date: z.coerce.date(),
    student_id: z.coerce.number(),
});

// /api/student-info/announcement/
studentAnnouncementSubmissionRouter.post("/", async (req, res) => {
    try {
        const validatedQueryObject = announcementSubmissionPostSchema.parse(req.body); 

        const {
            student_id, 
            date
        } = validatedQueryObject;

        await db
        .insertInto("Student_Announcement")
        .values({ ...validatedQueryObject })
        .execute(); 
        
        const result = await db
            .selectFrom("Student_Announcement")
            .where("Student_Announcement.student_id", "=", student_id)
            .where("Student_Announcement.date", "=", date)
            // .orderBy("Student_Announcement.announcement_id", "desc")
            .select("Student_Announcement.announcement_id")
            .execute();

        return res.status(200).json({
            message: "announcement successfully made", 
            announcement_id: `${result[0].announcement_id}`, 
        });
    } catch (err) {
        console.error(err);
        if (err instanceof z.ZodError) {
            return res.status(400).json({ message: "body object has wrong type" });
        } else {
            return res.status(500).json({ message: `internal server error` });
        }
    }
});

const announcementSubmissionGetSchema = z.object({
    announcement_id: z.coerce.number().optional(),
    student_id: z.coerce.number().optional(),
    date: z.coerce.date().optional(), 
});

// /api/student-info/announcement/?student_id={...}&date={...}&announcement_id={...}
studentAnnouncementSubmissionRouter.get("/", async (req, res) => { 
    try {
        const validatedQueryObject = announcementSubmissionGetSchema.parse(req.query);
        const {
            announcement_id,
            student_id,
            date
        } = validatedQueryObject;

        let query = db
            .selectFrom("Student_Announcement")
            .selectAll();

        if (announcement_id) { 
            query = query.where("Student_Announcement.announcement_id", "=", announcement_id);
        }
        if (student_id) { 
            query = query.where("Student_Announcement.student_id", "=", student_id);
        }

        // need fixing here...
        if (date) { 
            
            query = query.where("Student_Announcement.date", "=", date);
        }
        
        return res.status(200).json(await query.execute());
    } catch (err) {
        console.error(err);
        if (err instanceof z.ZodError) {
            return res.status(400).json({ message: "unknown search parameter" });
        } else {
            return res.status(500).json({ message: `internal server error` });
        }
    }
})


export default studentAnnouncementSubmissionRouter;

