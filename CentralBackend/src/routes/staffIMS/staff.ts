import express from "express";
import { z } from "zod";
import db from "../../database";
import { addFiltration } from "../../helper/addFiltration";
import { paginatedResults } from "../../helper/paginatedResults";
import { sql } from "kysely";

const staffRouter = express.Router();
staffRouter.get("/search", async (req, res) => {
  try {
    const search_query = z.string().optional().parse(req.query.q);
    const role_query = z.string().optional().parse(req.query.role);
    const user_id_query = z.string().optional().parse(req.query.user_id);
    const factor_query = z.string().optional().parse(req.query.department);
    const email_query = z.string().optional().parse(req.query.email);
    const first_name_query = z.string().optional().parse(req.query.first_name);
    const last_name_query = z.string().optional().parse(req.query.last_name);

    // Initial base query
    let query = db
      .selectFrom("Roles")
      .selectAll()
      .innerJoin("User", "User.user_id", "Roles.user_id");

    // Add conditions dynamically based on provided query parameters
    if (search_query) {
      query = query.where(eb => 
        eb('Roles.role', 'like', `%${search_query}%`)
        .or('Roles.factor', 'like', `%${search_query}%`)
        .or('Roles.user_id', 'like', `%${search_query}%`)
        .or('User.email', 'like', `%${search_query}%`)
        .or('User.first_name', 'like', `%${search_query}%`)
        .or('User.last_name', 'like', `%${search_query}%`)
        .or(sql`CONCAT(User.first_name, ' ', User.last_name)`, 'like', `%${search_query}%`)
        .or(sql`CONCAT(Roles.role, ' ', Roles.factor)`, 'like', `%${search_query}%`)
      );
    }

    if(user_id_query){
      query = query.where('Roles.user_id', 'like', `%${user_id_query}%`);
    }
    if (role_query) {
      query = query.where('Roles.role', 'like', `%${role_query}%`);
    }

    if (factor_query) {
      query = query.where('Roles.factor', 'like', `%${factor_query}%`);
    }

    if (email_query) {
      query = query.where('User.email', 'like', `%${email_query}%`);
    }

    if (first_name_query) {
      query = query.where('User.first_name', 'like', `%${first_name_query}%`);
    }

    if (last_name_query) {
      query = query.where('User.last_name', 'like', `%${last_name_query}%`);
    }

    // Execute the query and return paginated results
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

staffRouter.get("/", async (req, res) => {
  try {
    let query = db
      .selectFrom("Roles")
      .innerJoin("User", "User.user_id", "Roles.user_id").selectAll()
      // .select(["Roles.role", "Roles.factor", "User.user_id", "User.email",
      //   "User.first_name","User.first_name_bn", "User.last_name","User.last_name_bn",
      //   "User.profile_image_id","Roles.start_date", "Roles.end_date",
      //   "User.sign_id","User.dob","User.password","User.present_address_id",
      //   "User.permanent_address_id","User.religion","User.ethnicity",
      //   "User.blood_group","User.phone","User.gender","User.nationality"])
      .where("Roles.role", "not like", "%professor%");

    // Apply additional filtrations if needed
    query = addFiltration("Roles", query, req);
    query = addFiltration("User", query, req);

    query = query.innerJoin("Image", "Image.image_id", "User.profile_image_id").select(["Image.image_path as profile_image","Image.image_type as image_format"]);
    query = query.innerJoin("University", (join) => {
      return join.on(sql`University.university_id = Roles.university_id`);
    }).select(["University.university_abbr as university_abbr", "University.university_name as university_name"]);

    // Execute the query and return paginated resultsinnerJoin
    paginatedResults(query, req, res);
  } catch (error) {
    res.status(500).json({ message: "Internal server error", error });
  }
});

  staffRouter.get("/:id", async (req, res) => {
    try {
      const user_id = z.coerce.string().parse(req.params.id);
  
      const data = await db
        .selectFrom("Roles")
        .leftJoin("User", "User.user_id", "Roles.user_id")
        .where("Roles.user_id", "=", user_id)
        .selectAll()
        .executeTakeFirst();
        const profile_image_id = data?.profile_image_id ? z.coerce.number().parse(data?.profile_image_id) : null;
        let profile_image_path = null;
  
        if (profile_image_id !== null) {
          profile_image_path = await db
        .selectFrom("Image")
        .where("Image.image_id", "=", profile_image_id)
        .selectAll()
        .executeTakeFirst();
      }    if (!data) {
        return res.status(404).json({
          message: "Staff with user ID " + user_id + " not found",
        });
      }
  
      res.status(200).json(data);
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
  staffRouter.get("/department/:department", async (req, res) => {
    try {
      const factor = z.string().parse(req.params.department);
  
      let query = db
        .selectFrom("Roles")
        .innerJoin("User", "User.user_id", "Roles.user_id")
        .selectAll()
        .where("Roles.factor", "=", factor)
        .where("Roles.role", "not like", "%professor%");
      
      query = query.innerJoin("Image", "Image.image_id", "User.profile_image_id").select(["Image.image_path as profile_image","Image.image_type as image_format"]);
 
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
 
  export default staffRouter;
        