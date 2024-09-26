import express from "express";
import { SelectQueryBuilder } from "kysely";
import { z } from "zod";
import db, { Database, TableName } from "../../database";
import { addFiltration } from "../../helper/addFiltration";
import { paginatedResults } from "../../helper/paginatedResults";
import { verifySession } from "../../middlewares/verifySession";
import {
  PermissionRequest,
  Role,
  checkPermissions,
} from "../../middlewares/checkPermissions";

const examActivityFactorsRouter = express.Router();

const checkCec = async (req: PermissionRequest, res: express.Response) => {
  const session_id = req.session?.session_id as string;
  const isCec = await db
    .selectFrom("Auth_Session")
    .innerJoin("Teacher", "Auth_Session.user_id", "Teacher.user_id")
    .innerJoin(
      "Exam_Committee",
      "Teacher.teacher_id",
      "Exam_Committee.teacher_id",
    )
    .where("Auth_Session.session_id", "=", session_id)
    .where("Exam_Committee.role", "=", "Chairman")
    .select("Exam_Committee.teacher_id")
    .executeTakeFirst();
  return isCec;
};

examActivityFactorsRouter.get(
  "/",
  verifySession,
  checkPermissions,
  async (req: PermissionRequest, res) => {
    try {
      const cecId = await checkCec(req, res);
      if (!cecId) {
        return res.status(403).json({
          message: "You don't have enough permissions to access this document.",
        });
      }
      try {
        var query = db.selectFrom("Exam_Activity_Factors").selectAll();
        query = addFiltration(
          "Exam_Activity_Factors",
          query as SelectQueryBuilder<Database, TableName, {}>,
          req,
        ) as any;
        paginatedResults(query, req, res);
      } catch (err) {
        console.log(err);
        res.status(500).json({ message: "Internal server error", err });
      }
    } catch (err) {
      console.log(err);
      res.status(500).json({ message: "Internal server error", err });
    }
  },
);

examActivityFactorsRouter.post(
  "/",
  verifySession,
  checkPermissions,
  async (req: PermissionRequest, res) => {
    try {
      const cecId = await checkCec(req, res);
      if (!cecId) {
        return res.status(403).json({
          message: "You don't have enough permissions to access this document.",
        });
      }

      const examActivityFactorsBody = z
        .object({
          activity_id: z.number(),
          factor: z.string(),
          quantity: z.number(),
        })
        .parse(req.body);

      const query = await db
        .insertInto("Exam_Activity_Factors")
        .values({
          activity_id: examActivityFactorsBody.activity_id,
          factor: examActivityFactorsBody.factor,
          quantity: examActivityFactorsBody.quantity,
        })
        .execute();

      res.status(200).json({
        message: "Exam Activity factors added successfully.",
        data: query,
      });
    } catch (err) {
      res.status(500).json({ message: "Internal server error", err });
    }
  },
);

export default examActivityFactorsRouter;
