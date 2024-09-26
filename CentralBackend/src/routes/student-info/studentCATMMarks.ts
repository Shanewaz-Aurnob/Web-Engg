import express from "express";
import { z } from "zod";
import db from "../../database";
import { addFiltration } from "../../helper/addFiltration";

const studentCATMMarksRouter = express.Router();



// /api/student-info/catm-marks?student_id={...}&course_id={...}
studentCATMMarksRouter.get("/", async (req, res) => {

    try {

        let query = db
            .selectFrom("Catm_Mark")
            .innerJoin(
                "Student",
                "Student.student_id",
                "Catm_Mark.student_id"
            )
            .innerJoin(
                "Course",
                "Course.course_id",
                "Catm_Mark.course_id"
            )
            .innerJoin(
                "Total_Paper_Mark",
                (join) =>
                    join
                        .onRef(
                            "Total_Paper_Mark.course_id",
                            "=",
                            "Course.course_id"
                        )
                        .onRef(
                            "Total_Paper_Mark.exam_id",
                            "=",
                            "Catm_Mark.exam_id"
                        )
                        .onRef(
                            "Total_Paper_Mark.student_id",
                            "=",
                            "Student.student_id"
                        )
            )
        query = addFiltration("Course", query, req);
        query = addFiltration("Student", query, req);

        const data = await query.selectAll().execute();

        res.status(200).json(data);

    } catch (error) {
        if (error instanceof z.ZodError) {
            return res.status(400).json({
                name: "Invalid fields",
                message: JSON.parse(error.message),
            });
        }

        return res.status(500).json({ message: "Internal server error", error });
    }
})

export default studentCATMMarksRouter;