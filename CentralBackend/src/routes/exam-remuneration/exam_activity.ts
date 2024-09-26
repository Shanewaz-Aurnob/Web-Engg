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

const examActivityRouter = express.Router();

// get request
examActivityRouter.get(
  "/",
  verifySession,
  checkPermissions,
  async (req: PermissionRequest, res) => {
    try {
      // check if the user is chairman
      const session_id = req.session?.session_id as string;
      console.log(session_id);
      const chairman = await db
        .selectFrom("Auth_Session")
        .innerJoin("Roles", "Auth_Session.user_id", "Roles.user_id")
        .where("Auth_Session.session_id", "=", session_id)
        .where("Roles.role", "=", "chairman")
        .select(["Auth_Session.user_id", "Roles.start_date", "Roles.end_date"])
        .executeTakeFirst();
      console.log(chairman);

      if (!chairman) {
        return res.status(403).json({
          message: "You don't have enough permissions to access this document.",
        });
      }
      // get exam activity data
      try {
        var query = db.selectFrom("Exam_Activity").selectAll();
        query = addFiltration(
          "Exam_Activity",
          query as SelectQueryBuilder<Database, TableName, {}>,
          req,
        ) as any;
        paginatedResults(query, req, res);
      } catch (error) {
        console.log(error);
        res.status(500).json({ message: "Internal server error", error });
      }
    } catch (error) {
      console.log(error);
      res.status(500).json({ message: "Internal server error", error });
    }
  },
);

// post request
examActivityRouter.post(
  "/",
  verifySession,
  checkPermissions,
  async (req: PermissionRequest, res) => {
    try {
      // check if the user is chairman
      const session_id = req.session?.session_id as string;
      const chairman = await db
        .selectFrom("Auth_Session")
        .innerJoin("Roles", "Auth_Session.user_id", "Roles.user_id")
        .where("Auth_Session.session_id", "=", session_id)
        .where("Roles.role", "=", "chairman")
        .select(["Auth_Session.user_id", "Roles.start_date", "Roles.end_date"])
        .executeTakeFirst();

      if (!chairman) {
        return res.status(403).json({
          message: "You don't have enough permissions to edit this document.",
        });
      }

      //add exam activity data
      const examActivityInfo = z.object({
        bill_sector_id: z.number(),
        exam_activity_type_id: z.number(),
        quantity_initial: z.number(),
        quantity_final: z.number(),
        exam_bill: z.number(),
        min_exam_bill: z.number(),
        factor: z.string(),
        valid_from: z.date(),
      });

      const {
        bill_sector_id,
        exam_activity_type_id,
        quantity_initial,
        quantity_final,
        exam_bill,
        min_exam_bill,
        factor,
        valid_from,
      } = examActivityInfo.parse(req.body);

      await db
        .insertInto("Exam_Activity")
        .values({
          bill_sector_id,
          exam_activity_type_id,
          quantity_initial,
          quantity_final,
          exam_bill,
          min_exam_bill,
          factor,
          valid_from,
        })
        .execute();

      return res.status(200).json({
        message: "Exam activity data added successfully",
      });
    } catch (error) {
      console.log(error);
      res.status(500).json({ message: "Internal server error", error });
    }
  },
);

// put request
examActivityRouter.put(
  "/",
  verifySession,
  checkPermissions,
  async (req: PermissionRequest, res) => {
    try {
      // check if the user is chairman
      const session_id = req.session?.session_id as string;
      const chairman = await db
        .selectFrom("Auth_Session")
        .innerJoin("Roles", "Auth_Session.user_id", "Roles.user_id")
        .where("Auth_Session.session_id", "=", session_id)
        .where("Roles.role", "=", "chairman")
        .select(["Auth_Session.user_id", "Roles.start_date", "Roles.end_date"])
        .executeTakeFirst();

      if (!chairman) {
        return res.status(403).json({
          message: "You don't have enough permissions to edit this document.",
        });
      }
      // update exam activity data
      const examActivityInfo = z.object({
        rule_id: z.number(),
        bill_sector_id: z.number(),
        exam_activity_type_id: z.number(),
        quantity_initial: z.number(),
        quantity_final: z.number(),
        exam_bill: z.number(),
        min_exam_bill: z.number(),
        factor: z.string(),
        valid_from: z.date(),
      });

      const {
        rule_id,
        bill_sector_id,
        exam_activity_type_id,
        quantity_initial,
        quantity_final,
        exam_bill,
        min_exam_bill,
        factor,
        valid_from,
      } = examActivityInfo.parse(req.body);

      await db
        .updateTable("Exam_Activity")
        .set({
          bill_sector_id,
          exam_activity_type_id,
          quantity_initial,
          quantity_final,
          exam_bill,
          min_exam_bill,
          factor,
          valid_from,
        }).where("rule_id", "=", rule_id)
        .execute();

      return res.status(200).json({
        message: "Exam activity data updated successfully",
      });
    } catch (error) {
      console.log(error);
      res.status(500).json({ message: "Internal server error", error });
    }
  },
);

export default examActivityRouter;
