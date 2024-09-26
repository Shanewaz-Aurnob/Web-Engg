import express from "express";
import db from "../../database";
import { verifySession } from "../../middlewares/verifySession";
import {
  checkPermissions,
  PermissionRequest
} from "../../middlewares/checkPermissions";
import {
  get_activity_factors_information, get_activity_rates,
  get_exam_year
} from "./bill_calculation_helper";
import { select_and_calculate_bill } from "./select_bill_calculation_function";
import { store_calculation } from "./store_calculation";
import { z } from "zod";


const calculateBillRouter = express.Router();

const checkEvaluator = async (req: PermissionRequest, res: express.Response) => {
  const session_id = req.session?.session_id as string;
  const isEvaluator = await db.with("teacherinfo", (db) =>
    db.selectFrom("Auth_Session")
      .innerJoin("Teacher", "Auth_Session.user_id", "Teacher.user_id")
      .where("Auth_Session.session_id", "=", session_id)
      .select(["Teacher.teacher_id as teacher_id", `session_id` as "session_id"])
  ).selectFrom("teacherinfo")
    .leftJoin(
      "Evaluates_Activity",
      "teacherinfo.teacher_id",
      "Evaluates_Activity.teacher_id"
    ).whereRef("Evaluates_Activity.teacher_id", "=", "teacherinfo.teacher_id")
    .select("teacherinfo.teacher_id as teacher_id")
    .executeTakeFirst();
  return isEvaluator;
};

const getActivities = async (teacher_id: number, exam_id: number, academic_session_id: number) => {
  return await db.selectFrom("Evaluates_Activity")
    .where("Evaluates_Activity.teacher_id", "=", teacher_id)
    .where("Evaluates_Activity.academic_session_id", "=", academic_session_id)
    .where("Evaluates_Activity.exam_id", "=", exam_id)
    .selectAll()
    .execute();
};

calculateBillRouter.get(
  "/",
  verifySession,
  checkPermissions,
  async (req: PermissionRequest, res) => {
    try {

      const evaluatorId = await checkEvaluator(req, res);

      if (!evaluatorId) {
        return res
          .status(403)
          .json({
            message:
              "You don't have enough permissions to access this document."
          });
      }
      // get academic session id and exam id
      try {
        var query = await db.selectFrom("Evaluates_Activity").select(["exam_id", "academic_session_id"])
          .where("teacher_id", "=", evaluatorId.teacher_id)
          .distinct()
          .execute();
        console.log(query);

        res.status(200).send({
          data: query
        });
      } catch (error) {
        console.log(error);
        res.status(500).json({ message: "Internal server error", error });
      }
    } catch (error) {
      console.log(error);
      res.status(500).json({ message: "Internal server error", error });
    }
  }
);

calculateBillRouter.get(
    "/:exam_id/:academic_session_id",
    verifySession,
    checkPermissions,
    async (req: PermissionRequest, res) => {
        try {
            const session_id = req.session?.session_id as string;
            const evaluatorId = await checkEvaluator(req, res);

      if (!evaluatorId) {
        return res
          .status(403)
          .json({
            message:
              "You don't have enough permissions to access this document."
          });
      }


            if (!evaluatorId) {
                return res
                    .status(403)
                    .json({
                        message:
                            "You don't have enough permissions to access this document.",
                    });
            }
            const {exam_id, academic_session_id} = z.object({
                exam_id: z.coerce.number(),
                academic_session_id: z.coerce.number()
            }).parse(req.params);
            console.log(exam_id, academic_session_id);

            // calculate bills
             // calculate bills
      // filter the evaluates activity with the provided info
      const teacher_id = evaluatorId.teacher_id as number;
      const activities = await getActivities(teacher_id, exam_id,academic_session_id);

      const calculation_chain = activities.map(async (activity) => {
        const {
          exam_id,
          teacher_id,
          exam_activity_type_id,
          bill_sector_id,
          activity_id
        } = activity;

        // get the factor information of the activity
        const activity_factor = await get_activity_factors_information(activity_id);

        // get the exam year of the activity
        const exam_year_obj = await get_exam_year(exam_id);
        const exam_year = exam_year_obj!!.exam_session;

        // choose the particular rate of the activity based on the exam year
        const activity_rate = await get_activity_rates(exam_activity_type_id, bill_sector_id, parseInt(exam_year));

        // choose particular rule
        const bill = await select_and_calculate_bill(activity, activity_factor, activity_rate, parseInt(exam_year));

        // store this in metadata
        await store_calculation(activity.activity_id, bill);
      });

      // activities will return a list of things
      await Promise.all(calculation_chain);
      // send bill calculation data

      // res.status(200).send({
      //   "message": "Bill calculated successfully"
      // });

    } catch (error) {
      console.log(error);
      res.status(500).json({ message: "Internal server error", error });
    }
  }
);

export default calculateBillRouter;