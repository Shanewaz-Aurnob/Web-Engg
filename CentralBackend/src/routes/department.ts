import express from "express";
import { SelectQueryBuilder } from "kysely";
import { z } from "zod";
import db, { Database, TableName } from "../database";
import { addFiltration } from "../helper/addFiltration";
import { paginatedResults } from "../helper/paginatedResults";
const departmentRouter = express.Router();

// Get single department
departmentRouter.get("/:id", async (req, res) => {
  try {
    const department_id = z.coerce.number().parse(req.params.id);

    const data = await db
      .selectFrom("Department")
      .selectAll()
      .where("Department.department_id", "=", department_id)
      .executeTakeFirst();

    if (!data) {
      return res.status(404).json({
        message: "Department with id " + department_id + " not found",
      });
    }

    return res.status(200).json(data);
  } catch (error) {
    if (error instanceof z.ZodError) {
      return res.status(400).json({
        name: "Invalid data type.",
        message: JSON.parse(error.message),
      });
    }

    return res.status(500).json({ message: "Internal server error", error });
  }
});

// Get all departments
departmentRouter.get("/", async (req, res) => {
  try {
    var query = db
      .selectFrom("Department")
      .innerJoin(
        "University",
        "Department.university_id",
        "University.university_id",
      )
      .selectAll();

    addFiltration(
      "Department",
      query as SelectQueryBuilder<Database, TableName, {}>,
      req,
    ) as any;

    paginatedResults(
      query as SelectQueryBuilder<Database, TableName, {}>,
      req,
      res,
    );
  } catch (error) {
    return res.status(500).json({ message: "Internal server error", error });
  }
});

export default departmentRouter;
