import express from "express";
import db from "../../database";
import { z } from "zod";

const roleRouter = express.Router();

const roleGetQuerySchema = z.object({
  user_id: z.string(),
  isAuthor: z
    .string()
    .toLowerCase()
    .transform((val) => val == "true")
    .optional(),
  isEditor: z
    .string()
    .toLowerCase()
    .transform((val) => val == "true")
    .optional(),
  isReviewer: z
    .string()
    .toLowerCase()
    .transform((val) => val == "true")
    .optional(),
});


// /api/editorial-manager/role?user_id=?&isAuthor=?&isEditor=?&isReviewer=?
roleRouter.get("/", async (req, res) => {
  try {
    const validatedQueryObject = roleGetQuerySchema.parse(req.query);
    const roles = await db
      .selectFrom("Teacher")
      .innerJoin("Roles", "Roles.user_id", "Teacher.user_id")
      .distinct()
      .select([
          "Roles.role"
      ])
      .where("Roles.user_id", "=", validatedQueryObject.user_id)
      .execute();
    
    const ret = {
      isAuthor: false,
      isEditor: false,
      isReviewer: false,
    };

    ret.isAuthor = roles.find(role => role.role === "Author") !== undefined;

    if (validatedQueryObject.isEditor !== undefined) {
        ret.isEditor = roles.find(role => role.role === "Editor") !== undefined;
    }

    if (validatedQueryObject.isReviewer !== undefined) {
        ret.isReviewer = roles.find(role => role.role === "Reviewer") !== undefined;
    }

    return res.status(200).json({ ...ret });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: "internal server error" });
  }
});

export default roleRouter;

