import express from "express";
import { SelectQueryBuilder, sql } from "kysely";
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

const evaluatesActivityRouter = express.Router();

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

evaluatesActivityRouter.get(
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
        const query = await db
          .selectFrom("Exam_Committee")
          .innerJoin("Exam", "Exam_Committee.exam_id", "Exam.exam_id")
          .where("Exam_Committee.teacher_id", "=", cecId.teacher_id)
          .selectAll()
          .execute();

        res.status(200).send({
          exam_data: query,
        });
      } catch (err) {
        console.log(err);
        res
          .status(500)
          .json({ message: "No such course activity exists", err });
      }
    } catch (err) {
      console.log(err);
      res.status(500).json({ message: "Internal server error", err });
    }
  },
);

evaluatesActivityRouter.get(
  "/:exam_id",
  verifySession,
  checkPermissions,
  async (req: PermissionRequest, res) => {
    try {
      const exam_id = z.coerce.number().parse(req.params.exam_id);
      const cecId = await checkCec(req, res);

      if (!cecId) {
        return res.status(403).json({
          message: "You don't have enough permissions to access this document.",
        });
      }

      try {
        // get course activity data for a specific exam id
        var activityQueryData = await db
        .with('cte', (qb) =>
          qb
            .selectFrom('Evaluates_Activity')
            .innerJoin('Exam_Activity', (join) =>
              join.onRef('Evaluates_Activity.exam_activity_type_id', '=', 'Exam_Activity.exam_activity_type_id')
            )
            .innerJoin('Exam', (join) =>
              join.onRef('Exam.exam_id', '=', 'Evaluates_Activity.exam_id')
            )
            .innerJoin('Academic_Session', (join) =>
              join.onRef('Evaluates_Activity.academic_session_id', '=', 'Academic_Session.academic_session_id')
            )
            .innerJoin('Bill_Sectors', (join) =>
              join.onRef('Evaluates_Activity.bill_sector_id', '=', 'Bill_Sectors.bill_sector_id')
            )
            .where('Evaluates_Activity.exam_id', '=', exam_id)
            .select([
              'Academic_Session.academic_session_id',
              'Academic_Session.session',
              'Academic_Session.semester',
              'Evaluates_Activity.activity_id',
              'Evaluates_Activity.exam_activity_type_id',
              'Evaluates_Activity.teacher_id',
              'Evaluates_Activity.course_id',
              'Evaluates_Activity.exam_id',
              'Exam.exam_session',
              'Bill_Sectors.bill_sector_name',
              'Bill_Sectors.bill_sector_id',
              'Evaluates_Activity.last_modified'
            ]).distinct()
        )
        .selectFrom('cte')
        .selectAll()
        .execute();

        var factorQueryData = await  db.selectFrom('Exam_Activity_Factors')
          .selectAll()
          .execute();

        const factored_data = activityQueryData.map((activity) => {
          const factor_information = factorQueryData.filter((factor) => factor.activity_id === activity.activity_id).map((factor) => {
            return {
              factor_id: factor.id,
              activity_id: factor.activity_id,
              factor: factor.factor,
              quantity: factor.quantity
              }
            })
          return {
            ...activity,
            factor_information
          }
        })

        res.status(200).send({
          factored_data
        });

        // query = addFiltration(
        //   "Evaluates_Activity",
        //   query as SelectQueryBuilder<Database, TableName, {}>,
        //   req,
        // ) as any;
        // paginatedResults(query, req, res);
      } catch (err) {
        console.log(err);
        res
          .status(500)
          .json({ message: "No such course or semester activity exists", err });
      }
    } catch (err) {
      console.log(err);
      res.status(500).json({ message: "Internal server error", err });
    }
  },
);

// post request
evaluatesActivityRouter.post(
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

      const evaluatesActivityInfo = z.object({
        exam_activity_type_id: z.number(),
        academic_session_id: z.number(),
        teacher_id: z.number(),
        bill_sector_id: z.number(),
        course_id: z.number(),
        department_id: z.number(),
        exam_id: z.number(),
      });

      const {
        exam_activity_type_id,
        academic_session_id,
        teacher_id,
        bill_sector_id,
        course_id,
        department_id,
        exam_id,
      } = evaluatesActivityInfo.parse(req.body);

      const query = await db
        .insertInto("Evaluates_Activity")
        .values({
          exam_activity_type_id,
          academic_session_id,
          teacher_id,
          bill_sector_id,
          course_id,
          department_id,
          exam_id,
          last_modified: new Date(),
        })
        .execute();

      res.status(200).send({
        message: "Activity info added successfully",
        data: query,
      });
    } catch (err) {
      console.log(err);
      res.status(500).json({ message: "Internal server error", err });
    }
  },
);

//put request
evaluatesActivityRouter.put(
  "/:activity_id",
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

      const activity_id = z.coerce.number().parse(req.params.activity_id);

      const evaluatesActivityInfo = z.object({
        exam_activity_type_id: z.number(),
        academic_session_id: z.number(),
        teacher_id: z.number(),
        bill_sector_id: z.number(),
        course_id: z.number(),
        department_id: z.number(),
        exam_id: z.number(),
        last_modified: z.date(),
      });

      const {
        exam_activity_type_id,
        academic_session_id,
        teacher_id,
        bill_sector_id,
        course_id,
        department_id,
        exam_id,
        last_modified,
      } = evaluatesActivityInfo.parse(req.body);

      const query = await db
        .updateTable("Evaluates_Activity")
        .set({
          exam_activity_type_id,
          academic_session_id,
          teacher_id,
          bill_sector_id,
          course_id,
          department_id,
          exam_id,
          last_modified: last_modified || Date.now(),
        })
        .where("activity_id", "=", activity_id)
        .execute();

      res.status(200).send({
        message: "Activity info updated successfully",
        data: query,
      });
    } catch (err) {
      console.log(err);
      res.status(500).json({ message: "Internal server error", err });
    }
  },
);

export default evaluatesActivityRouter;
