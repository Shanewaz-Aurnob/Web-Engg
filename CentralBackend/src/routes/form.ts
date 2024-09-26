import express from "express";
import { verifySession } from "../middlewares/verifySession";
import {
  PermissionRequest,
  Role,
  checkPermissions,
} from "../middlewares/checkPermissions";
import db from "../database";
import { z } from "zod";
import { sql } from "kysely";
import { paginatedResults } from "../helper/paginatedResults";
import { addFiltration } from "../helper/addFiltration";
const formRouter = express.Router();

// Get information about a specific form
formRouter.get(
  "/:id",
  verifySession,
  checkPermissions,
  async (req: PermissionRequest, res) => {
    const form_id = z.coerce.number().parse(req.params.id);

    if (req.role == Role.Student) {
      try {
        const student_id = z.number().parse(req.uid);

        const form = await db
          .selectFrom("Form")
          .where("Form.form_id", "=", form_id)
          .where("Form.student_id", "=", student_id)
          .selectAll()
          .executeTakeFirst();

        if (!form) {
          return res.status(404).json({
            message: "Form with id " + form_id + " not found",
          });
        }

        // Get evaulations of the form
        const { evaluation, courses } = await getFormData(form_id);

        return res.status(200).json({ ...form, evaluation, courses });
      } catch (error) {
        if (error instanceof z.ZodError) {
          return res.status(400).json({
            name: "Invalid data type.",
            message: JSON.parse(error.message),
          });
        }

        return res.status(400).json({ message: "Invalid request body", error });
      }
    }

    if (req.role == Role.Teacher || req.role == Role.Staff) {
      try {
        const form = await db
          .selectFrom("Form")
          .where("Form.form_id", "=", form_id)
          .selectAll()
          .executeTakeFirst();

        if (!form) {
          return res.status(404).json({
            message: "Form with id " + form_id + " not found",
          });
        }

        const { evaluation, courses } = await getFormData(form_id);

        return res.status(200).json({ ...form, evaluation, courses });
      } catch (error) {
        if (error instanceof z.ZodError) {
          return res.status(400).json({
            name: "Invalid data type.",
            message: JSON.parse(error.message),
          });
        }

        return res.status(400).json({ message: "Invalid request body", error });
      }
    }

    return res.status(403).json({
      message: "You don't have permission to access this document.",
    });
  },
);

formRouter.put(
  "/approve/:id",
  verifySession,
  checkPermissions,
  async (req: PermissionRequest, res) => {
    const form_id = z.coerce.number().parse(req.params.id);
    const evaluator_id = z.string().parse(req.session?.user_id);

    if (req.role != Role.Teacher && req.role != Role.Staff) {
      return res.status(403).json({
        message: "You don't have permission to access this document.",
      });
    }

    try {
      const form = await db
        .selectFrom("Form")
        .where("Form.form_id", "=", form_id)
        .select("Form.clearance_level")
        .executeTakeFirst();

      if (!form) {
        return res.status(404).json({
          message: "Form with id " + form_id + " not found",
        });
      }

      if (!form.clearance_level || form.clearance_level < 1) {
        return res.status(400).json({
          message: "Form with id " + form_id + " has been rejected",
        });
      }

      const now = new Date();

      await db
        .updateTable("Form")
        .set("Form.clearance_level", form.clearance_level + 1)
        .where("Form.form_id", "=", form_id)
        .execute();

      await db
        .updateTable("Form_Evaluation")
        .set("Form_Evaluation.end_time", now)
        .where("Form_Evaluation.end_time", "is", null)
        .execute();

      await db
        .insertInto("Form_Evaluation")
        .values({
          form_id: form_id,
          start_time: now,
          end_time: null,
          evaluator_id: evaluator_id,
        })
        .execute();

      return res.status(200).json({
        message: "Form #" + form_id + " approved successfully",
      });
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({
          name: "Invalid data type.",
          message: JSON.parse(error.message),
        });
      }

      return res.status(400).json({ message: "Invalid request body", error });
    }
  },
);

formRouter.put(
  "/reject/:id",
  verifySession,
  checkPermissions,
  async (req: PermissionRequest, res) => {
    const form_id = z.coerce.number().parse(req.params.id);
    const evaulator_id = z.string().parse(req.session?.user_id);

    if (req.role != Role.Teacher && req.role != Role.Staff) {
      return res.status(403).json({
        message: "You don't have permission to access this document.",
      });
    }

    try {
      const form = await db
        .selectFrom("Form")
        .where("Form.form_id", "=", form_id)
        .select("Form.clearance_level")
        .executeTakeFirst();

      if (!form) {
        return res.status(404).json({
          message: "Form with id " + form_id + " not found",
        });
      }

      if (form.clearance_level == 0) {
        return res.status(400).json({
          message: "Form #" + form_id + " is already rejected",
        });
      }

      const now = new Date();

      await db
        .updateTable("Form")
        .set("Form.clearance_level", 0)
        .where("Form.form_id", "=", form_id)
        .execute();

      await db
        .updateTable("Form_Evaluation")
        .set("Form_Evaluation.end_time", now)
        .set("Form_Evaluation.evaluator_id", evaulator_id)
        .where("Form_Evaluation.end_time", "is", null)
        .execute();

      return res.status(200).json({
        message: "Form #" + form_id + " rejected successfully",
      });
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({
          name: "Invalid data type.",
          message: JSON.parse(error.message),
        });
      }

      return res.status(400).json({ message: "Invalid request body", error });
    }
  },
);

const InsertFormBody = z.object({
  current_address_id: z.number(),
  courses: z.number().array().nonempty(),
  permanent_address_id: z.number().nullable().optional(),
  previous_charges: z.string().nullable().optional(),
  description_of_other_programs: z.string().nullable().optional(),
  student_status: z.enum(["Irregular", "Improvement", "Regular"]).optional(),
  exam_id: z.number().optional(),
});

formRouter.post(
  "/",
  verifySession,
  checkPermissions,
  async (req: PermissionRequest, res) => {
    if (req.role == Role.Student) {
      // Let them create a new form
      try {
        const student_id = z.number().parse(req.uid);

        const {
          courses,
          current_address_id,
          permanent_address_id,
          previous_charges,
          description_of_other_programs,
          student_status,
          exam_id,
        } = InsertFormBody.parse(req.body);

        await db
          .insertInto("Form")
          .values({
            clearance_level: 1,
            current_address_id: current_address_id,
            description_of_other_programs: description_of_other_programs,
            form_submission_time: new Date(),
            permanent_address_id: permanent_address_id ?? current_address_id,
            previous_charges: previous_charges,
            student_id: student_id,
            student_status,
            exam_id,
          })
          .execute();

        const row = await db
          .selectFrom("Form")
          .select(sql<string>`LAST_INSERT_ID()`.as("form_id"))
          .executeTakeFirst();

        if (!row) {
          return res.status(500).json({
            message: "Failed to create form",
          });
        }

        // Add form courses
        const form_id = z.coerce.number().parse(row.form_id);

        await db
          .insertInto("Form_Courses")
          .values(
            courses.map((course_id) => {
              return {
                form_id,
                course_id,
              };
            }),
          )
          .execute();

        return res.status(200).json({
          message: "Form created successfully",
          form_id: row.form_id,
        });
      } catch (error) {
        if (error instanceof z.ZodError) {
          return res.status(400).json({
            name: "Invalid data type.",
            message: JSON.parse(error.message),
          });
        }

        return res.status(400).json({ message: "Invalid request body", error });
      }
    } else {
      return res.status(403).json({
        message: "You don't have permission to create a form.",
      });
    }
  },
);

formRouter.get(
  "/",
  verifySession,
  checkPermissions,
  async (req: PermissionRequest, res) => {
    if (req.role == Role.Student) {
      // Get all forms of the student
      try {
        const student_id = z.number().parse(req.uid);

        var forms = db
          .selectFrom("Form")
          .where("Form.student_id", "=", student_id)
          .orderBy("Form.form_id", "desc")
          .selectAll();

        forms = addFiltration("Form", forms, req) as any;

        return await paginatedResults(forms, req, res);
      } catch (error) {
        if (error instanceof z.ZodError) {
          return res.status(400).json({
            name: "Invalid data type.",
            message: JSON.parse(error.message),
          });
        }

        return res.status(400).json({ message: "Invalid request body", error });
      }
    }

    if (req.role == Role.Teacher) {
      // Get all forms of all students of the same department
      const deptInfo = await db
        .selectFrom("Teacher")
        .where("Teacher.user_id", "=", req.session?.user_id!)
        .select(["department_id"])
        .executeTakeFirst();

      var deptForms = db
        .selectFrom("Form")
        .innerJoin("Student", "Student.student_id", "Form.student_id")
        .where("Student.department_id", "=", deptInfo?.department_id!)
        .orderBy("Form.form_id", "desc")
        .selectAll();

      deptForms = addFiltration("Form", deptForms, req);
      deptForms = addFiltration("Student", deptForms, req);
      // forms = addFiltration("Form", forms, req) as any;

      return await paginatedResults(deptForms, req, res);
    }

    if (req.role == Role.Staff) {
      // Get all forms of all students
      var forms = db
        .selectFrom("Form")
        .orderBy("Form.form_id", "desc")
        .selectAll();

      forms = addFiltration("Form", forms, req) as any;

      return await paginatedResults(forms, req, res);
    }

    return res.sendStatus(403);
  },
);

export default formRouter;
async function getFormData(form_id: number) {
  const evaluation = await db
    .selectFrom("Form_Evaluation")
    .where("Form_Evaluation.form_id", "=", form_id)
    .selectAll()
    .orderBy("Form_Evaluation.start_time", "desc")
    .execute();

  // Get courses of the form
  const courses = await db
    .selectFrom("Form_Courses")
    .where("Form_Courses.form_id", "=", form_id)
    .innerJoin("Course", "Form_Courses.course_id", "Course.course_id")
    // .innerJoin(
    //   "Courses_in_Semester",
    //   "Course.course_id",
    //   "Courses_in_Semester.course_id",
    // )
    // .innerJoin(
    //   "Academic_Session",
    //   "Courses_in_Semester.academic_session_id",
    //   "Academic_Session.academic_session_id",
    // )
    .selectAll()
    .execute();
  return { evaluation, courses };
}
