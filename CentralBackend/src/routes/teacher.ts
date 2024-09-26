import express, { Response } from "express";
import { z } from "zod";
import db from "../database";
import { addFiltration } from "../helper/addFiltration";
import { paginatedResults } from "../helper/paginatedResults";
import { sql } from "kysely";
import { verifySession } from "../middlewares/verifySession";
import {
  checkPermissions,
  PermissionRequest,
  Role,
} from "../middlewares/checkPermissions";
const teacherRouter = express.Router();

teacherRouter.get("/search", async (req, res) => {
  try {
    const search_query = z.string().parse(req.query.q);

    // Wild card search
    const query = db
      .selectFrom("Teacher")
      .selectAll()
      .innerJoin("User", "User.user_id", "Teacher.user_id")
      .where((eb) =>
        eb("User.first_name", "like", `%${search_query}%`)
          .or("User.last_name", "like", `%${search_query}%`)
          .or("User.email", "like", `%${search_query}%`)
          .or(
            sql`CONCAT(User.first_name, ' ', User.last_name)`,
            "like",
            `%${search_query}%`,
          ),
      );

    paginatedResults(query, req, res);
  } catch (error) {
    if (error instanceof z.ZodError) {
      return res.status(400).json({
        name: "Invalid data type.",
        message: JSON.parse(error.message),
      });
    }
    res.status(500).json({ message: "Internal server error", error });
  }
});

teacherRouter.get("/", async (req, res) => {
  var query = db
    .selectFrom("Teacher")
    .innerJoin("User", "User.user_id", "Teacher.user_id")
    .selectAll();

  query = addFiltration("Teacher", query, req);
  query = addFiltration("User", query, req);

  paginatedResults(query, req, res);
});

teacherRouter.get("/:id", async (req: PermissionRequest, res: Response) => {
  try {
    const teacher_id = z.coerce.number().parse(req.params.id);

    // console.log(teacher_id);

    const data = await db
      .selectFrom("Teacher")
      .innerJoin("User", "User.user_id", "Teacher.user_id")
      .where("Teacher.teacher_id", "=", teacher_id)
      .selectAll()
      .executeTakeFirst();

    const user_id = z.coerce.string().parse(data?.user_id);
    const education = await db
      .selectFrom("Education")
      .where("Education.user_id", "=", user_id)
      .selectAll()
      .execute();

    const professionalExperience = await db
      .selectFrom("Professional_experinece")
      .where("Professional_experinece.teacher_id", "=", teacher_id)
      .selectAll()
      .execute();

    const administrativeExperience = await db
      .selectFrom("Administrative_experinece")
      .where("Administrative_experinece.teacher_id", "=", teacher_id)
      .selectAll()
      .execute();

    const scholarshipAndFellowship = await db
      .selectFrom("Scholarship_and_fellowship")
      .where("Scholarship_and_fellowship.teacher_id", "=", teacher_id)
      .selectAll()
      .execute();

    const accomplishment = await db
      .selectFrom("Accomplishment")
      .where("Accomplishment.teacher_id", "=", teacher_id)
      .selectAll()
      .execute();

    const trainingAndCertification = await db
      .selectFrom("Training_and_certification")
      .where("Training_and_certification.teacher_id", "=", teacher_id)
      .selectAll()
      .execute();

    const journal = await db
      .selectFrom("Journal")
      .where("Journal.teacher_id", "=", teacher_id)
      .selectAll()
      .execute();

    const publication = await db
      .selectFrom("Publication")
      .where("Publication.teacher_id", "=", teacher_id)
      .selectAll()
      .execute();

    const award = await db
      .selectFrom("Award")
      .where("Award.teacher_id", "=", teacher_id)
      .selectAll()
      .execute();

    const profile_image_id = data?.profile_image_id
      ? z.coerce.number().parse(data?.profile_image_id)
      : null;
    let profile_image_path = null;

    if (profile_image_id !== null) {
      profile_image_path = await db
        .selectFrom("Image")
        .where("Image.image_id", "=", profile_image_id)
        .selectAll()
        .executeTakeFirst();
    }

    if (!data) {
      return res.status(404).json({
        message: "Teacher with id " + teacher_id + " not found",
      });
    }

    res.status(200).json({
      personal_info: data,
      education: education,
      professional_experience: professionalExperience,
      administrative_experience: administrativeExperience,
      scholarship_and_fellowship: scholarshipAndFellowship,
      accomplishment: accomplishment,
      training_and_certification: trainingAndCertification,
      journal: journal,
      publication: publication,
      award: award,
      profile_image: profile_image_path,
    });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return res.status(400).json({
        name: "Invalid data type.",
        message: JSON.parse(error.message),
      });
    }
    res.status(500).json({ message: "Internal server error", error });
  }
});

const EducationReqBody = z.object({
  education_country: z.string(),
  education_from_year: z.string(),
  education_institution: z.string(),
  education_title: z.string(),
  education_to_year: z.string(),
});

teacherRouter.post(
  "/addEducation/:id",
  verifySession,
  checkPermissions,
  async (req: PermissionRequest, res: Response) => {
    if (req.role != Role.Teacher && req.role != Role.Staff) {
      return res.status(403).json({
        message: "You don't have enough permissions to access this document.",
      });
    }
    try {
      const id = z.coerce.string().parse(req.params.id);

      const {
        education_country,
        education_from_year,
        education_institution,
        education_title,
        education_to_year,
      } = EducationReqBody.parse(req.body);
      // console.log(id);

      await db
        .insertInto("Education")
        .values({
          education_country: education_country,
          education_from_year: education_from_year,
          education_institution: education_institution,
          education_title: education_title,
          education_to_year: education_to_year,
          user_id: id,
        })
        .execute();
      res.status(200).json({
        message: "Data inserted Successfully in Education Table.",
        status: "success",
      });
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({
          name: "Invalid data type.",
          message: JSON.parse(error.message),
        });
      }
      res.status(500).json({ message: "Internal server error", error });
    }
  },
);

teacherRouter.put(
  "/updateEducation/:id",
  verifySession,
  checkPermissions,
  async (req: PermissionRequest, res: Response) => {
    if (req.role != Role.Teacher && req.role != Role.Staff) {
      return res.status(403).json({
        message: "You don't have enough permissions to access this document.",
      });
    }
    try {
      const id = z.coerce.string().parse(req.params.id);

      const {
        education_country,
        education_from_year,
        education_institution,
        education_title,
        education_to_year,
      } = EducationReqBody.parse(req.body);
      // console.log(id);
      await db
        .updateTable("Education")
        .set({
          education_country: education_country,
          education_from_year: education_from_year,
          education_institution: education_institution,
          education_title: education_title,
          education_to_year: education_to_year,
        })
        .where("Education.user_id", "=", id)
        .where("Education.education_title", "=", education_title)
        .where("Education.education_from_year", "=", education_from_year)
        .execute();
      res.status(200).json({
        message: "Data updated Successfully in Education Table.",
        status: "success",
      });
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({
          name: "Invalid data type.",
          message: JSON.parse(error.message),
        });
      }
      res.status(500).json({ message: "Internal server error", error });
    }
  },
);

teacherRouter.delete(
  "/deleteEducation",
  verifySession,
  checkPermissions,
  async (req: PermissionRequest, res: Response) => {
    if (req.role != Role.Teacher && req.role != Role.Staff) {
      return res.status(403).json({
        message: "You don't have enough permissions to access this document.",
      });
    }
    try {
      const user_id = z.coerce.string().parse(req.query.id);
      const education_title = z.coerce
        .string()
        .parse(req.query.title);
      const education_from_year = z.coerce
        .string()
        .parse(req.query.year);

      const [result] = await db
        .deleteFrom("Education")
        .where("Education.user_id", "=", user_id)
        .where("Education.education_title", "=", education_title)
        .where("Education.education_from_year", "=", education_from_year)
        .execute();

      if (result.numDeletedRows === BigInt(0)) {
        return res.status(404).json({
          message: "No matching record found for deletion.",
          status: "error",
        });
      }

      res.status(200).json({
        message: "Record deleted successfully from Education table.",
        status: "success",
      });
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({
          name: "Invalid data type.",
          message: JSON.parse(error.message),
        });
      }
      res.status(500).json({ message: "Internal server error", error });
    }
  },
);

const ProfessionalExperienceReqBody = z.object({
  professional_experience_country: z.string(),
  professional_experience_description: z.string(),
  professional_experience_institution: z.string(),
  professional_experience_title: z.string(),
  professional_experience_year: z.string(),
});

teacherRouter.post(
  "/addProfessionalExperience/:id",
  verifySession,
  checkPermissions,
  async (req: PermissionRequest, res: Response) => {
    if (req.role != Role.Teacher && req.role != Role.Staff) {
      return res.status(403).json({
        message: "You don't have enough permissions to access this document.",
      });
    }
    try {
      const teacher_id = z.coerce.number().parse(req.params.id);

      const {
        professional_experience_country,
        professional_experience_description,
        professional_experience_institution,
        professional_experience_title,
        professional_experience_year,
      } = ProfessionalExperienceReqBody.parse(req.body);

      await db
        .insertInto("Professional_experinece")
        .values({
          professional_experience_country: professional_experience_country,
          professional_experience_description:
            professional_experience_description,
          professional_experience_institution:
            professional_experience_institution,
          professional_experience_title: professional_experience_title,
          professional_experience_year: professional_experience_year,
          teacher_id: teacher_id,
        })
        .execute();

      res.status(200).json({
        message: "Data inserted Successfully in Professional Experience Table.",
        status: "success",
      });
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({
          name: "Invalid data type.",
          message: JSON.parse(error.message),
        });
      }
      res.status(500).json({ message: "Internal server error", error });
    }
  },
);

teacherRouter.put(
  "/updateProfessionalExperience/:id",
  verifySession,
  checkPermissions,
  async (req: PermissionRequest, res: Response) => {
    if (req.role != Role.Teacher && req.role != Role.Staff) {
      return res.status(403).json({
        message: "You don't have enough permissions to access this document.",
      });
    }
    try {
      const teacher_id = z.coerce.number().parse(req.params.id);

      const {
        professional_experience_country,
        professional_experience_description,
        professional_experience_institution,
        professional_experience_title,
        professional_experience_year,
      } = ProfessionalExperienceReqBody.parse(req.body);

      await db
        .updateTable("Professional_experinece")
        .set({
          professional_experience_country: professional_experience_country,
          professional_experience_description:
            professional_experience_description,
          professional_experience_institution:
            professional_experience_institution,
          professional_experience_title: professional_experience_title,
          professional_experience_year: professional_experience_year,
        })
        .where("Professional_experinece.teacher_id", "=", teacher_id)
        .where(
          "professional_experience_title",
          "=",
          professional_experience_title,
        )
        .where(
          "professional_experience_year",
          "=",
          professional_experience_year,
        )
        .execute();

      res.status(200).json({
        message: "Data updated Successfully in Professional Experience Table.",
        status: "success",
      });
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({
          name: "Invalid data type.",
          message: JSON.parse(error.message),
        });
      }
      res.status(500).json({ message: "Internal server error", error });
    }
  },
);

teacherRouter.delete(
  "/deleteProfessionalExperience",
  verifySession,
  checkPermissions,
  async (req: PermissionRequest, res: Response) => {
    if (req.role != Role.Teacher && req.role != Role.Staff) {
      return res.status(403).json({
        message: "You don't have enough permissions to access this document.",
      });
    }
    try {
      const teacher_id = z.coerce.number().parse(req.query.id);
      const professional_experience_title = z.coerce
        .string()
        .parse(req.query.title);
      const professional_experience_year = z.coerce
        .string()
        .parse(req.query.year);

      const [result] = await db
        .deleteFrom("Professional_experinece")
        .where("Professional_experinece.teacher_id", "=", teacher_id)
        .where(
          "Professional_experinece.professional_experience_title",
          "=",
          professional_experience_title,
        )
        .where(
          "Professional_experinece.professional_experience_year",
          "=",
          professional_experience_year,
        )
        .execute();

      if (result.numDeletedRows === BigInt(0)) {
        // No matching row found
        return res.status(404).json({
          message: "No matching record found for deletion.",
          status: "error",
        });
      }
      res.status(200).json({
        message: "Record deleted successfully from Education table.",
        status: "success",
      });
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({
          name: "Invalid data type.",
          message: JSON.parse(error.message),
        });
      }
      res.status(500).json({ message: "Internal server error", error });
    }
  },
);

const AdministrativeExperienceReqBody = z.object({
  administrative_experinece_description: z.string(),
  administrative_experinece_institution: z.string(),
  administrative_experinece_title: z.string(),
  administrative_experinece_year: z.string(),
});

teacherRouter.post(
  "/addAdministrativeExperience/:id",
  verifySession,
  checkPermissions,
  async (req: PermissionRequest, res: Response) => {
    if (req.role != Role.Teacher && req.role != Role.Staff) {
      return res.status(403).json({
        message: "You don't have enough permissions to access this document.",
      });
    }
    try {
      const teacher_id = z.coerce.number().parse(req.params.id);

      const {
        administrative_experinece_description,
        administrative_experinece_institution,
        administrative_experinece_title,
        administrative_experinece_year,
      } = AdministrativeExperienceReqBody.parse(req.body);

      await db
        .insertInto("Administrative_experinece")
        .values({
          administrative_experinece_description:
            administrative_experinece_description,
          administrative_experinece_institution:
            administrative_experinece_institution,
          administrative_experinece_title: administrative_experinece_title,
          administrative_experinece_year: administrative_experinece_year,
          teacher_id: teacher_id,
        })
        .execute();

      res.status(200).json({
        message:
          "Data inserted Successfully in Administrative Experience Table.",
        status: "success",
      });
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({
          name: "Invalid data type.",
          message: JSON.parse(error.message),
        });
      }
      res.status(500).json({ message: "Internal server error", error });
    }
  },
);

teacherRouter.put(
  "/updateAdministrativeExperience/:id",
  verifySession,
  checkPermissions,
  async (req: PermissionRequest, res: Response) => {
    if (req.role != Role.Teacher && req.role != Role.Staff) {
      return res.status(403).json({
        message: "You don't have enough permissions to access this document.",
      });
    }
    try {
      const teacher_id = z.coerce.number().parse(req.params.id);

      const {
        administrative_experinece_description,
        administrative_experinece_institution,
        administrative_experinece_title,
        administrative_experinece_year,
      } = AdministrativeExperienceReqBody.parse(req.body);

      await db
        .updateTable("Administrative_experinece")
        .set({
          administrative_experinece_description:
            administrative_experinece_description,
          administrative_experinece_institution:
            administrative_experinece_institution,
          administrative_experinece_title: administrative_experinece_title,
          administrative_experinece_year: administrative_experinece_year,
        })
        .where("Administrative_experinece.teacher_id", "=", teacher_id)
        .where(
          "Administrative_experinece.administrative_experinece_title",
          "=",
          administrative_experinece_title,
        )
        .where(
          "Administrative_experinece.administrative_experinece_year",
          "=",
          administrative_experinece_year,
        )
        .execute();

      res.status(200).json({
        message:
          "Data updated Successfully in Administrative Experience Table.",
        status: "success",
      });
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({
          name: "Invalid data type.",
          message: JSON.parse(error.message),
        });
      }
      res.status(500).json({ message: "Internal server error", error });
    }
  },
);

teacherRouter.delete(
  "/deleteAdministrativeExperience",
  verifySession,
  checkPermissions,
  async (req: PermissionRequest, res: Response) => {
    if (req.role != Role.Teacher && req.role != Role.Staff) {
      return res.status(403).json({
        message: "You don't have enough permissions to access this document.",
      });
    }
    try {
      const teacher_id = z.coerce.number().parse(req.query.id);
      const administrative_experinece_title = z.coerce
        .string()
        .parse(req.query.title);
      const administrative_experinece_year = z.coerce
        .string()
        .parse(req.query.year);
      const [result] = await db
        .deleteFrom("Administrative_experinece")
        .where("Administrative_experinece.teacher_id", "=", teacher_id)
        .where(
          "Administrative_experinece.administrative_experinece_title",
          "=",
          administrative_experinece_title,
        )
        .where(
          "Administrative_experinece.administrative_experinece_year",
          "=",
          administrative_experinece_year,
        )
        .execute();
      if (result.numDeletedRows === BigInt(0)) {
        // No matching row found
        return res.status(404).json({
          message: "No matching record found for deletion.",
          status: "error",
        });
      }

      res.status(200).json({
        message:
          "Data deleted Successfully in Administrative Experience Table.",
        status: "success",
      });
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({
          name: "Invalid data type.",
          message: JSON.parse(error.message),
        });
      }
      res.status(500).json({ message: "Internal server error", error });
    }
  },
);

const ScholarshipAndFellowshipReqBody = z.object({
  scholarship_country: z.string(),
  scholarship_degree: z.string(),
  scholarship_from_year: z.string(),
  scholarship_institution: z.string(),
  scholarship_title: z.string(),
  scholarship_to_year: z.string(),
});

teacherRouter.post(
  "/addScholarshipAndFellowship/:id",
  verifySession,
  checkPermissions,
  async (req: PermissionRequest, res: Response) => {
    if (req.role != Role.Teacher && req.role != Role.Staff) {
      return res.status(403).json({
        message: "You don't have enough permissions to access this document.",
      });
    }
    try {
      const teacher_id = z.coerce.number().parse(req.params.id);

      const {
        scholarship_country,
        scholarship_degree,
        scholarship_from_year,
        scholarship_institution,
        scholarship_title,
        scholarship_to_year,
      } = ScholarshipAndFellowshipReqBody.parse(req.body);

      await db
        .insertInto("Scholarship_and_fellowship")
        .values({
          scholarship_country: scholarship_country,
          scholarship_degree: scholarship_degree,
          scholarship_from_year: scholarship_from_year,
          scholarship_institution: scholarship_institution,
          scholarship_title: scholarship_title,
          scholarship_to_year: scholarship_to_year,
          teacher_id: teacher_id,
        })
        .execute();

      res.status(200).json({
        message:
          "Data inserted Successfully in Scholarship and fellowship Table.",
        status: "success",
      });
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({
          name: "Invalid data type.",
          message: JSON.parse(error.message),
        });
      }
      res.status(500).json({ message: "Internal server error", error });
    }
  },
);

teacherRouter.put(
  "/updateScholarshipAndFellowship/:id",
  verifySession,
  checkPermissions,
  async (req: PermissionRequest, res: Response) => {
    if (req.role != Role.Teacher && req.role != Role.Staff) {
      return res.status(403).json({
        message: "You don't have enough permissions to access this document.",
      });
    }
    try {
      const teacher_id = z.coerce.number().parse(req.params.id);

      const {
        scholarship_country,
        scholarship_degree,
        scholarship_from_year,
        scholarship_institution,
        scholarship_title,
        scholarship_to_year,
      } = ScholarshipAndFellowshipReqBody.parse(req.body);

      await db
        .updateTable("Scholarship_and_fellowship")
        .set({
          scholarship_country: scholarship_country,
          scholarship_degree: scholarship_degree,
          scholarship_from_year: scholarship_from_year,
          scholarship_institution: scholarship_institution,
          scholarship_title: scholarship_title,
          scholarship_to_year: scholarship_to_year,
        })
        .where('Scholarship_and_fellowship.teacher_id', '=', teacher_id)
        .where('Scholarship_and_fellowship.scholarship_title', '=', scholarship_title)
        .where('Scholarship_and_fellowship.scholarship_from_year', '=', scholarship_from_year)
        .execute();

      res.status(200).json({
        message:
          "Data updated Successfully in Scholarship and fellowship Table.",
        status: "success",
      });
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({
          name: "Invalid data type.",
          message: JSON.parse(error.message),
        });
      }
      res.status(500).json({ message: "Internal server error", error });
    }
  },
);

teacherRouter.delete(
  "/deleteScholarshipAndFellowship",
  verifySession,
  checkPermissions,
  async (req: PermissionRequest, res: Response) => {
    if (req.role != Role.Teacher && req.role != Role.Staff) {
      return res.status(403).json({
        message: "You don't have enough permissions to access this document.",
      });
    }
    try {
      const teacher_id = z.coerce.number().parse(req.query.id);
      const scholarship_title = z.coerce.string().parse(req.query.title)
      const scholarship_from_year = z.coerce.string().parse(req.query.year)
      
      const [result] = await db
        .deleteFrom("Scholarship_and_fellowship")
        .where('Scholarship_and_fellowship.teacher_id', '=', teacher_id)
        .where('Scholarship_and_fellowship.scholarship_title', '=', scholarship_title)
        .where('Scholarship_and_fellowship.scholarship_from_year', '=', scholarship_from_year)
        .execute();
        if (result.numDeletedRows === BigInt(0)) {
          return res.status(404).json({
            message: "No matching record found for deletion.",
            status: "error",
          });
        }  
      res.status(200).json({
        message:"Data deleted Successfully in Scholarship and fellowship Table.",
        status: "success",
      });
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({
          name: "Invalid data type.",
          message: JSON.parse(error.message),
        });
      }
      res.status(500).json({ message: "Internal server error", error });
    }
  },
);

const AccomplishmentReqBody = z.object({
  acomplishment_field: z.string(),
  acomplishment_organization: z.string(),
  acomplishment_title: z.string(),
  acomplishment_year: z.string(),
});

teacherRouter.post(
  "/addAccomplishment/:id",
  verifySession,
  checkPermissions,
  async (req: PermissionRequest, res: Response) => {
    if (req.role != Role.Teacher && req.role != Role.Staff) {
      return res.status(403).json({
        message: "You don't have enough permissions to access this document.",
      });
    }
    try {
      const teacher_id = z.coerce.number().parse(req.params.id);

      const {
        acomplishment_field,
        acomplishment_organization,
        acomplishment_title,
        acomplishment_year,
      } = AccomplishmentReqBody.parse(req.body);

      await db
        .insertInto("Accomplishment")
        .values({
          acomplishment_field: acomplishment_field,
          acomplishment_organization: acomplishment_organization,
          acomplishment_title: acomplishment_title,
          acomplishment_year: acomplishment_year,
          teacher_id: teacher_id,
        })
        .execute();
      res.status(200).json({
        message: "Data inserted Successfully in Accomplishment Table.",
        status: "success",
      });
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({
          name: "Invalid data type.",
          message: JSON.parse(error.message),
        });
      }
      res.status(500).json({ message: "Internal server error", error });
    }
  },
);

teacherRouter.put(
  "/updateAccomplishment/:id",
  verifySession,
  checkPermissions,
  async (req: PermissionRequest, res: Response) => {
    if (req.role != Role.Teacher && req.role != Role.Staff) {
      return res.status(403).json({
        message: "You don't have enough permissions to access this document.",
      });
    }
    try {
      const teacher_id = z.coerce.number().parse(req.params.id);

      const {
        acomplishment_field,
        acomplishment_organization,
        acomplishment_title,
        acomplishment_year,
      } = AccomplishmentReqBody.parse(req.body);

      await db
        .updateTable("Accomplishment")
        .set({
          acomplishment_field: acomplishment_field,
          acomplishment_organization: acomplishment_organization,
          acomplishment_title: acomplishment_title,
          acomplishment_year: acomplishment_year,
        })
        .where('Accomplishment.teacher_id', '=', teacher_id)
        .where('Accomplishment.acomplishment_title', '=', acomplishment_title)
        .execute();
      res.status(200).json({
        message: "Data updated Successfully in Accomplishment Table.",
        status: "success",
      });
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({
          name: "Invalid data type.",
          message: JSON.parse(error.message),
        });
      }
      res.status(500).json({ message: "Internal server error", error });
    }
  },
);

teacherRouter.delete(
  "/deleteAccomplishment",
  verifySession,
  checkPermissions,
  async (req: PermissionRequest, res: Response) => {
    if (req.role != Role.Teacher && req.role != Role.Staff) {
      return res.status(403).json({
        message: "You don't have enough permissions to access this document.",
      });
    }
    try {
      const teacher_id = z.coerce.number().parse(req.query.id);
      const acomplishment_title = z.coerce.string().parse(req.query.title)

      const [result] = await db
        .deleteFrom("Accomplishment")
        .where('Accomplishment.teacher_id', '=', teacher_id)
        .where('Accomplishment.acomplishment_title', '=', acomplishment_title)
        .execute();
        if (result.numDeletedRows === BigInt(0)) {
          return res.status(404).json({
            message: "No matching record found for deletion.",
            status: "error",
          });
        }
      res.status(200).json({
        message: "Data deleted Successfully in Accomplishment Table.",
        status: "success",
      });
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({
          name: "Invalid data type.",
          message: JSON.parse(error.message),
        });
      }
      res.status(500).json({ message: "Internal server error", error });
    }
  },
);
const TrainingAndCertificationReqBody = z.object({
  training_duration: z.string(),
  training_field: z.string(),
  training_title: z.string(),
  training_year: z.string(),
});

teacherRouter.post(
  "/addTrainingAndCertification/:id",
  verifySession,
  checkPermissions,
  async (req: PermissionRequest, res: Response) => {
    if (req.role != Role.Teacher && req.role != Role.Staff) {
      return res.status(403).json({
        message: "You don't have enough permissions to access this document.",
      });
    }
    try {
      const teacher_id = z.coerce.number().parse(req.params.id);

      const {
        training_duration,
        training_field,
        training_title,
        training_year,
      } = TrainingAndCertificationReqBody.parse(req.body);

      await db
        .insertInto("Training_and_certification")
        .values({
          training_duration: training_duration,
          training_field: training_field,
          training_title: training_title,
          training_year: training_year,
          teacher_id: teacher_id,
        })
        .execute();

      res.status(200).json({
        message:
          "Data inserted Successfully in Training and Certification Table.",
        status: "success",
      });
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({
          name: "Invalid data type.",
          message: JSON.parse(error.message),
        });
      }
      res.status(500).json({ message: "Internal server error", error });
    }
  },
);

teacherRouter.put(
  "/updateTrainingAndCertification/:id",
  verifySession,
  checkPermissions,
  async (req: PermissionRequest, res: Response) => {
    if (req.role != Role.Teacher && req.role != Role.Staff) {
      return res.status(403).json({
        message: "You don't have enough permissions to access this document.",
      });
    }
    try {
      const teacher_id = z.coerce.number().parse(req.params.id);

      const {
        training_duration,
        training_field,
        training_title,
        training_year,
      } = TrainingAndCertificationReqBody.parse(req.body);

      await db
        .updateTable("Training_and_certification")
        .set({
          training_duration: training_duration,
          training_field: training_field,
          training_title: training_title,
          training_year: training_year,
        })
        .where('Training_and_certification.teacher_id', '=', teacher_id)
        .where('Training_and_certification.training_title', '=', training_title)
        .where('Training_and_certification.training_year', '=', training_year)
        .execute();

      res.status(200).json({
        message:
          "Data updated Successfully in Training and Certification Table.",
        status: "success",
      });
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({
          name: "Invalid data type.",
          message: JSON.parse(error.message),
        });
      }
      res.status(500).json({ message: "Internal server error", error });
    }
  },
);
teacherRouter.delete(
  "/deleteTrainingAndCertification",
  verifySession,
  checkPermissions,
  async (req: PermissionRequest, res: Response) => {
    if (req.role != Role.Teacher && req.role != Role.Staff) {
      return res.status(403).json({
        message: "You don't have enough permissions to access this document.",
      });
    }
    try {
      const teacher_id = z.coerce.number().parse(req.query.id);
      const training_title = z.coerce.string().parse(req.query.title)
      const training_year = z.coerce.string().parse(req.query.year)
      const [result] = await db
        .deleteFrom("Training_and_certification")
        .where('Training_and_certification.teacher_id', '=', teacher_id)
        .where('Training_and_certification.training_title', '=', training_title)
        .where('Training_and_certification.training_year', '=', training_year)
        .execute();

        if (result.numDeletedRows === BigInt(0)) {
          return res.status(404).json({
            message: "No matching record found for deletion.",
            status: "error",
          });
        }
  
      res.status(200).json({
        message:"Data deleted Successfully in Training and Certification Table.",
        status: "success",
      });
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({
          name: "Invalid data type.",
          message: JSON.parse(error.message),
        });
      }
      res.status(500).json({ message: "Internal server error", error });
    }
  },
);

const JournalSchema = z.object({
  journal_title: z.string(),
  journal_type: z.string(),
  journal_year: z.string(),
});

teacherRouter.post(
  "/addJournal/:id",
  verifySession,
  checkPermissions,
  async (req: PermissionRequest, res: Response) => {
    if (req.role != Role.Teacher && req.role != Role.Staff) {
      return res.status(403).json({
        message: "You don't have enough permissions to access this document.",
      });
    }
    try {
      const teacher_id = z.coerce.number().parse(req.params.id);
      const { journal_title, journal_type, journal_year } = JournalSchema.parse(
        req.body,
      );
      await db
        .insertInto("Journal")
        .values({
          journal_title: journal_title,
          journal_type: journal_type,
          journal_year: journal_year,
          teacher_id: teacher_id,
        })
        .execute();

      res.status(200).json({
        message: "Data inserted Successfully in Journal Table.",
        status: "success",
      });
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({
          name: "Invalid data type.",
          message: JSON.parse(error.message),
        });
      }
      res.status(500).json({ message: "Internal server error", error });
    }
  },
);

teacherRouter.put(
  "/updateJournal/:id",
  verifySession,
  checkPermissions,
  async (req: PermissionRequest, res: Response) => {
    if (req.role != Role.Teacher && req.role != Role.Staff) {
      return res.status(403).json({
        message: "You don't have enough permissions to access this document.",
      });
    }
    try {
      const teacher_id = z.coerce.number().parse(req.params.id);
      const { journal_title, journal_type, journal_year } = JournalSchema.parse(
        req.body,
      );
      await db
        .updateTable("Journal")
        .set({
          journal_title: journal_title,
          journal_type: journal_type,
          journal_year: journal_year,
        })
        .where('Journal.teacher_id', '=', teacher_id)
        .where('Journal.journal_type', '=', journal_title)
        .where('Journal.journal_year', '=', journal_year)
        .execute();

      res.status(200).json({
        message: "Data updated Successfully in Journal Table.",
        status: "success",
      });
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({
          name: "Invalid data type.",
          message: JSON.parse(error.message),
        });
      }
      res.status(500).json({ message: "Internal server error", error });
    }
  },
);
teacherRouter.delete(
  "/deleteJournal",
  verifySession,
  checkPermissions,
  async (req: PermissionRequest, res: Response) => {
    if (req.role != Role.Teacher && req.role != Role.Staff) {
      return res.status(403).json({
        message: "You don't have enough permissions to access this document.",
      });
    }
    try {
      const teacher_id = z.coerce.number().parse(req.query.id);
      const journal_title = z.coerce.string().parse(req.query.title)
      const journal_year = z.coerce.string().parse(req.query.year)
      
        const [result] = await db
        .deleteFrom("Journal")
        .where('Journal.teacher_id', '=', teacher_id)
        .where('Journal.journal_type', '=', journal_title)
        .where('Journal.journal_year', '=', journal_year)
        .execute();
        if (result.numDeletedRows === BigInt(0)) {
          return res.status(404).json({
            message: "No matching record found for deletion.",
            status: "error",
          });
        }
      res.status(200).json({
        message: "Data deleted Successfully in Journal Table.",
        status: "success",
      });
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({
          name: "Invalid data type.",
          message: JSON.parse(error.message),
        });
      }
      res.status(500).json({ message: "Internal server error", error });
    }
  },
);

const PublicationReqBody = z.object({
  publication_description: z.string(),
  publication_field: z.string(),
  publication_title: z.string(),
  publication_year: z.string(),
});

teacherRouter.post(
  "/addPublication/:id",
  verifySession,
  checkPermissions,
  async (req: PermissionRequest, res: Response) => {
    if (req.role != Role.Teacher && req.role != Role.Staff) {
      return res.status(403).json({
        message: "You don't have enough permissions to access this document.",
      });
    }
    try {
      const teacher_id = z.coerce.number().parse(req.params.id);
      const {
        publication_description,
        publication_field,
        publication_title,
        publication_year,
      } = PublicationReqBody.parse(req.body);

      await db
        .insertInto("Publication")
        .values({
          publication_description: publication_description,
          publication_field: publication_field,
          publication_title: publication_title,
          publication_year: publication_year,
          teacher_id: teacher_id,
        })
        .execute();

      res.status(200).json({
        message: "Data inserted Successfully in Publication Table.",
        status: "success",
      });
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({
          name: "Invalid data type.",
          message: JSON.parse(error.message),
        });
      }
      res.status(500).json({ message: "Internal server error", error });
    }
  },
);

teacherRouter.put(
  "/updatePublication/:id",
  verifySession,
  checkPermissions,
  async (req: PermissionRequest, res: Response) => {
    if (req.role != Role.Teacher && req.role != Role.Staff) {
      return res.status(403).json({
        message: "You don't have enough permissions to access this document.",
      });
    }
    try {
      const teacher_id = z.coerce.number().parse(req.params.id);
      const {
        publication_description,
        publication_field,
        publication_title,
        publication_year,
      } = PublicationReqBody.parse(req.body);

      await db
        .updateTable("Publication")
        .set({
          publication_description: publication_description,
          publication_field: publication_field,
          publication_title: publication_title,
          publication_year: publication_year,
        })
        .where('Publication.teacher_id', '=', teacher_id)
        .where('Publication.publication_title', '=', publication_title)
        .where('Publication.publication_year', '=', publication_year)
        .execute();

      res.status(200).json({
        message: "Data Updated Successfully in Publication Table.",
        status: "success",
      });
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({
          name: "Invalid data type.",
          message: JSON.parse(error.message),
        });
      }
      res.status(500).json({ message: "Internal server error", error });
    }
  },
);
teacherRouter.delete(
  "/deletePublication",
  verifySession,
  checkPermissions,
  async (req: PermissionRequest, res: Response) => {
    if (req.role != Role.Teacher && req.role != Role.Staff) {
      return res.status(403).json({
        message: "You don't have enough permissions to access this document.",
      });
    }
    try {
      const teacher_id = z.coerce.number().parse(req.query.id);
      const publication_title = z.coerce.string().parse(req.query.title)
      const publication_year = z.coerce.string().parse(req.query.year)
      const [result] = await db
        .deleteFrom("Publication")
        .where('Publication.teacher_id', '=', teacher_id)
        .where('Publication.publication_title', '=', publication_title)
        .where('Publication.publication_year', '=', publication_year)
        .execute();
        if (result.numDeletedRows === BigInt(0)) {
          return res.status(404).json({
            message: "No matching record found for deletion.",
            status: "error",
          });
        }

      res.status(200).json({
        message: "Data deleted Successfully in Publication Table.",
        status: "success",
      });
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({
          name: "Invalid data type.",
          message: JSON.parse(error.message),
        });
      }
      res.status(500).json({ message: "Internal server error", error });
    }
  },
);

const AwardReqBody = z.object({
  award_country: z.string(),
  award_institution: z.string(),
  award_title: z.string(),
  award_year: z.string(),
});

teacherRouter.post(
  "/addAward/:id",
  verifySession,
  checkPermissions,
  async (req: PermissionRequest, res: Response) => {
    if (req.role != Role.Teacher && req.role != Role.Staff) {
      return res.status(403).json({
        message: "You don't have enough permissions to access this document.",
      });
    }
    try {
      const teacher_id = z.coerce.number().parse(req.params.id);

      const { award_country, award_institution, award_title, award_year } =
        AwardReqBody.parse(req.body);

      await db
        .insertInto("Award")
        .values({
          award_country: award_country,
          award_institution: award_institution,
          award_title: award_title,
          award_year: award_year,
          teacher_id: teacher_id,
        })
        .execute();
      res.status(200).json({
        message: "Data inserted Successfully in Award Table.",
        status: "success",
      });
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({
          name: "Invalid data type.",
          message: JSON.parse(error.message),
        });
      }
      res.status(500).json({ message: "Internal server error", error });
    }
  },
);

teacherRouter.put(
  "/updateAward/:id",
  verifySession,
  checkPermissions,
  async (req: PermissionRequest, res: Response) => {
    if (req.role != Role.Teacher && req.role != Role.Staff) {
      return res.status(403).json({
        message: "You don't have enough permissions to access this document.",
      });
    }
    try {
      const teacher_id = z.coerce.number().parse(req.params.id);

      const { award_country, award_institution, award_title, award_year } =
        AwardReqBody.parse(req.body);

      await db
        .updateTable("Award")
        .set({
          award_country: award_country,
          award_institution: award_institution,
          award_title: award_title,
          award_year: award_year,
        })
        .where('Award.teacher_id', '=', teacher_id)
        .where('Award.award_title', '=', award_title)
        .where('Award.award_year', '=', award_year)
        .execute();
      res.status(200).json({
        message: "Data Updated Successfully in Award Table.",
        status: "success",
      });
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({
          name: "Invalid data type.",
          message: JSON.parse(error.message),
        });
      }
      res.status(500).json({ message: "Internal server error", error });
    }
  },
);

teacherRouter.delete(
  "/deleteAward",
  verifySession,
  checkPermissions,
  async (req: PermissionRequest, res: Response) => {
    if (req.role != Role.Teacher && req.role != Role.Staff) {
      return res.status(403).json({
        message: "You don't have enough permissions to access this document.",
      });
    }
    try {
      const teacher_id = z.coerce.number().parse(req.query.id);
      const award_title = z.coerce.string().parse(req.query.title)
      const award_year = z.coerce.string().parse(req.query.year)
      
      const [result] = await db
        .deleteFrom("Award")
        .where('Award.teacher_id', '=', teacher_id)
        .where('Award.award_title', '=', award_title)
        .where('Award.award_year', '=', award_year)
        .execute();

        if (result.numDeletedRows === BigInt(0)) {
          return res.status(404).json({
            message: "No matching record found for deletion.",
            status: "error",
          });
        }
      res.status(200).json({
        message: "Data deleted Successfully in Award Table.",
        status: "success",
      });
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({
          name: "Invalid data type.",
          message: JSON.parse(error.message),
        });
      }
      res.status(500).json({ message: "Internal server error", error });
    }
  },
);

export default teacherRouter;
