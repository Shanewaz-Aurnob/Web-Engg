import express from "express";
import { z } from "zod";
import db from "../../database";
import { addFiltration } from "../../helper/addFiltration";
import { paginatedResults } from "../../helper/paginatedResults";
import { sql } from "kysely";
import { verifySession } from "../../middlewares/verifySession";
import {
  PermissionRequest,
  Role,
  checkPermissions,
} from "../../middlewares/checkPermissions";
const SIMS_noticeRouter = express.Router();
SIMS_noticeRouter.get("/allnotice/", async (req, res) => {
  try {
    let query = db.selectFrom("Notice_Board").selectAll();

    // Apply additional filtrations if needed
    query = addFiltration("Notice_Board", query, req);

    // Execute the query and return paginated results
    paginatedResults(query, req, res);
  } catch (error) {
    res.status(500).json({ message: "Internal server error", error });
  }
});

SIMS_noticeRouter.get("/search/", async (req, res) => {
  try {
    const search_query = z.string().optional().parse(req.query.q);
    const user_id_query = z.string().optional().parse(req.query.user_id);
    //const notice_type_query = z.string().optional().parse(req.query.user_id);

    let query = db.selectFrom("Notice_Board").selectAll();

    if (search_query) {
      query = query.where((eb) =>
        eb("Notice_Board.notice_type", "like", `%${search_query}%`)
          .or("Notice_Board.notice_title", "like", `%${search_query}%`)
          .or("Notice_Board.notice_created_by", "like", `%${search_query}%`)
          .or(
            sql`CONCAT(Notice_Board.notice_type, ' ', Notice_Board.notice_title)`,
            "like",
            `%${search_query}%`,
          ),
      );
    }

    if (user_id_query) {
      query = query.where(
        "Notice_Board.notice_created_by",
        "like",
        `%${user_id_query}%`,
      );
    }

    paginatedResults(query, req, res);
  } catch (error) {
    res.status(500).json({ message: "Internal server error", error });
  }
});

SIMS_noticeRouter.post("/add/", async (req, res) => {
  try {
    const noticeSchema = z.object({
      notice_type: z.string(),
      notice_title: z.string(),
      notice_description: z.string().nullable(),
      notice_created_by: z.string(),
      notice_uploaded_time: z.date().default(new Date()),
      notice_attachment: z.string(),
      notice_id: z.number(),
    });

    const noticeData = noticeSchema.parse(req.body);

    await db.insertInto("Notice_Board").values(noticeData).executeTakeFirst();

    res.status(200).send({
      message: "Data Inserted Successfully in notice_board Table.",
    });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return res.status(400).json({
        name: "Invalid data type.",
        message: error.errors,
      });
    }
    return res.status(400).json({ message: "Invalid request body", error });
  }
});
export default SIMS_noticeRouter;
