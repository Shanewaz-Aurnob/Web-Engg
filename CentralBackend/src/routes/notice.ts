import express from "express";
import { z } from "zod";
import db from "../database";
import { paginatedResults } from "../helper/paginatedResults";
import { SessionRequest, verifySession } from "../middlewares/verifySession";
import {
  checkPermissions,
  PermissionRequest,
  Role,
} from "../middlewares/checkPermissions";
import { sql } from "kysely";
const noticeRouter = express.Router();

noticeRouter.get("/", async (req, res) => {
  try {
    const query = db
      .selectFrom("Notice_Board")
      .innerJoin("User", "User.user_id", "Notice_Board.notice_created_by")
      .select([
        "Notice_Board.notice_id",
        "Notice_Board.notice_title",
        "Notice_Board.notice_type",
        "Notice_Board.notice_description",
        "Notice_Board.notice_uploaded_time",
        "Notice_Board.notice_attachment",
        "Notice_Board.notice_created_by",
        "User.first_name",
        "User.last_name",
        "User.first_name_bn",
        "User.last_name_bn",
        "User.email",
        "User.phone",
      ])
      .orderBy("Notice_Board.notice_uploaded_time desc");

    paginatedResults(query, req, res);
  } catch (error) {
    res.status(500).json({ message: "Internal server error", error });
  }
});

noticeRouter.get("/my", verifySession, async (req: SessionRequest, res) => {
  try {
    const query = db
      .selectFrom("Notice_Board")
      .where("notice_created_by", "=", req.session?.user_id!)
      .orderBy("Notice_Board.notice_uploaded_time desc")
      .selectAll();

    paginatedResults(query, req, res);
  } catch (error) {
    res.status(500).json({ message: "Internal server error", error });
  }
});

const InsertNoticeBody = z.object({
  notice_type: z.string(),
  notice_title: z.string(),
  notice_description: z.string(),
  notice_attachment: z.string(),
});

noticeRouter.post(
  "/",
  verifySession,
  checkPermissions,
  async (req: PermissionRequest, res) => {
    if (req.role != Role.Teacher && req.role != Role.Staff) {
      return res.status(403).json({
        message: "You don't have enough permissions to access this document.",
      });
    }
    try {
      const uid = req.session?.user_id;
      const reqBod = InsertNoticeBody.parse(req.body);
      await db
        .insertInto("Notice_Board")
        .values({
          ...reqBod,
          notice_created_by: uid!,
          notice_uploaded_time: new Date(),
        })
        .execute();

      const row = await db
        .selectFrom("Notice_Board")
        .select(sql<string>`LAST_INSERT_ID()`.as("notice_id"))
        .executeTakeFirst();

      if (!row) {
        return res.status(500).json({
          message: "Failed to create notice",
        });
      }

      return res.status(200).json({
        message: "Notice created successfully",
        notice_id: row.notice_id,
      });
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({
          name: "Invalid data type.",
          message: JSON.parse(error.message),
        });
      }

      return res.status(400).json({ message: "Invalid request body", error });
    }
  },
);

noticeRouter.get("/:id", async (req, res) => {
  try {
    const notice_id = z.coerce.number().parse(req.params.id);

    const data = await db
      .selectFrom("Notice_Board")
      .where("Notice_Board.notice_id", "=", notice_id)
      .innerJoin("User", "User.user_id", "Notice_Board.notice_created_by")
      .select([
        "Notice_Board.notice_id",
        "Notice_Board.notice_title",
        "Notice_Board.notice_type",
        "Notice_Board.notice_description",
        "Notice_Board.notice_uploaded_time",
        "Notice_Board.notice_attachment",
        "Notice_Board.notice_created_by",
        "User.first_name",
        "User.last_name",
        "User.first_name_bn",
        "User.last_name_bn",
        "User.email",
        "User.phone",
      ])
      .executeTakeFirst();

    if (!data) {
      return res.status(404).json({
        message: "Notice with id " + notice_id + " not found",
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

const UpdateNoticeBody = z.object({
  notice_type: z.string().optional(),
  notice_title: z.string().optional(),
  notice_description: z.string().optional(),
  notice_attachment: z.string().optional(),
});

noticeRouter.put(
  "/:id",
  verifySession,
  checkPermissions,
  async (req: PermissionRequest, res) => {
    if (req.role != Role.Teacher && req.role != Role.Staff) {
      return res.status(403).json({
        message: "You don't have enough permissions to access this document.",
      });
    }

    try {
      const uid = req.session?.user_id!;
      const id = z.coerce.number().parse(req.params.id);
      const {
        notice_type,
        notice_attachment,
        notice_description,
        notice_title,
      } = UpdateNoticeBody.parse(req.body);
      if (
        !notice_title &&
        !notice_type &&
        !notice_attachment &&
        !notice_description
      ) {
        return res.status(400).json({ message: "No update field provided" });
      }

      var query = db
        .updateTable("Notice_Board")
        .where("notice_created_by", "=", uid)
        .where("notice_id", "=", id);
      if (notice_type) query = query.set("notice_type", notice_type);
      if (notice_attachment)
        query = query.set("notice_attachment", notice_attachment);
      if (notice_description)
        query = query.set("notice_description", notice_description);
      if (notice_title) query = query.set("notice_title", notice_title);
      await query.execute();

      return res
        .status(204)
        .json({ message: `Notice with id ${id} updated successfully` });
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

noticeRouter.delete(
  "/:id",
  verifySession,
  checkPermissions,
  async (req: PermissionRequest, res) => {
    if (req.role != Role.Teacher && req.role != Role.Staff) {
      return res.status(403).json({
        message: "You don't have enough permissions to access this document.",
      });
    }

    try {
      const uid = req.session?.user_id!;
      const id = z.coerce.number().parse(req.params.id);

      await db
        .deleteFrom("Notice_Board")
        .where("notice_id", "=", id)
        .where("notice_created_by", "=", uid)
        .execute();

      return res
        .status(204)
        .json({ message: `Notice with id ${id} has been deleted.` });
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

export default noticeRouter;
