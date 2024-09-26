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
const cuersRouter = express.Router();

// get request
cuersRouter.get(
    "/",
    verifySession,
    checkPermissions,
    async (req: PermissionRequest, res) => {
        try{
            const session_id = req.session?.session_id as string;

            // check the user roles 
            const allRoles = await db.with('teacherinfo', (db) =>
              db.selectFrom("Auth_Session")
              .innerJoin("Teacher", "Auth_Session.user_id", "Teacher.user_id")
              .where('Auth_Session.session_id', '=', session_id)
              .select(["Teacher.teacher_id as teacher_id", `session_id` as 'session_id'])
            ).with('chairman', (db) => db.selectFrom("Auth_Session")
                .innerJoin("Roles", "Auth_Session.user_id", "Roles.user_id")
                .where("Auth_Session.session_id", "=", session_id)
                .select(["Roles.role as staff_role", `session_id` as 'session_id'])
              ).with('cec', (db) => db.selectFrom("teacherinfo")
                .innerJoin(
                  "Exam_Committee",
                  "Exam_Committee.teacher_id",
                  "teacherinfo.teacher_id"
                ).where('Exam_Committee.role', '=', 'Chairman')
                .where("teacherinfo.session_id", "=", session_id)
                .select(["Exam_Committee.teacher_id as cec_role", `session_id` as 'session_id']))
              .with('evaluator', (db) => db.selectFrom("teacherinfo")
              .leftJoin(
                "Evaluates_Activity",
                "teacherinfo.teacher_id",
                "Evaluates_Activity.teacher_id"
              )
              .select(["teacherinfo.teacher_id as evaluator_role", `session_id` as 'session_id'])
              ).selectFrom('Auth_Session')
              .leftJoin('chairman', (join) => 
              join.onRef('Auth_Session.session_id', '=', 'chairman.session_id'))
              .leftJoin('cec', (join) => 
                join.onRef('Auth_Session.session_id', '=', 'cec.session_id'))
              .leftJoin('evaluator', (join) => 
                join.onRef('Auth_Session.session_id', '=', 'evaluator.session_id'))
              .select([
                sql`CASE WHEN chairman.staff_role IS NOT NULL THEN staff_role ELSE "none" END`.as('staff_role'),
                // 'chairman.staff_role',
                sql`CASE WHEN cec.cec_role IS NOT NULL THEN 'chairman-of-exam-committee' ELSE "none" END`.as('cec_role'),
                // 'cec.cec_role',
                sql`CASE WHEN evaluator.evaluator_role IS NOT NULL THEN 'evaluator' ELSE "none" END`.as('evaluator_role'),
                // 'evaluator-role'
              ]).
              where((eb) => eb.or([
                eb('Auth_Session.session_id', '=', session_id),
                eb('chairman.session_id', '=', session_id),
                eb('cec.session_id', '=', session_id),
                eb('evaluator.session_id', '=', session_id)
              ]))
                .executeTakeFirst();
          console.log(allRoles);

          res.status(200).send({
            roles: allRoles
          });

        }catch(err){
            console.log(err);
            res.status(500).json({ message: "Internal server error", err });
        }
    }
)

export default cuersRouter;