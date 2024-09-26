import express from "express";
import { z } from "zod";
import db from "../../database";
import { EManagerAttachment } from "../../types/EditorialManagerTables";

const emanagerAttachmentRouter = express.Router();

const attachmentGetQuerySchema = z.object({
  submission_id: z.string(),
});

// /api/editorial-manager/attachment?submission_id=$1
emanagerAttachmentRouter.get("/", async (req, res) => {
  try {
    const validatedQueryObject = attachmentGetQuerySchema.parse(req.query);
    const query = db
      .selectFrom("EManager_Attachment")
      .selectAll()
      .where("submission_id", "=", validatedQueryObject.submission_id);

    const result: EManagerAttachment[] = await query.execute();
    return res.status(200).json({ message: "success", attachments: result });
  } catch (err) {
    console.error(err);
    if (err instanceof z.ZodError) {
      return res.status(400).json({ message: "invalid `submission_id`" });
    } else {
      return res.status(500).json({ message: "internal server error" });
    }
  }
});

const attachmentPostQuerySchema = z.object({
  attachments: z.array(
    z.object({
      attachment_id: z.string(),
      attachment_name: z.string(),
      attachment_size: z.union([z.number(), z.null()]),
      attachment_type: z.string(),
      attachment_url: z.string(),
      reviewer_id: z.number(),
      submission_id: z.string(),
    }),
  ),
});

// /api/editorial-manager/attachment/
emanagerAttachmentRouter.post("/", async (req, res) => {
  try {
    const validatedBodyObject = attachmentPostQuerySchema.parse(req.body);
    validatedBodyObject.attachments.forEach(async (attachment) => {
      await db.insertInto("EManager_Attachment").values(attachment).execute();
    });
  } catch (err) {
    console.error(err);
    if (err instanceof z.ZodError) {
      return res.status(400).json({ message: "body object has wrong type" });
    } else {
      return res.status(500).json({ message: `internal server error` });
    }
  }
});

export default emanagerAttachmentRouter;
