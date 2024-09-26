import express from "express";
import { z } from "zod";
import db from "../../database";
import { EManagerFile } from "../../types/EditorialManagerTables";

const emanagerFileRouter = express.Router();

const fileGetQuerySchema = z.object({
  submission_id: z.string(),
});

// /api/editorial-manager/file?submission_id=$1
emanagerFileRouter.get("/", async (req, res) => {
  try {
    const validatedQueryObject = fileGetQuerySchema.parse(req.query);
    const query = db
      .selectFrom("EManager_File")
      .selectAll()
      .where("submission_id", "=", validatedQueryObject.submission_id);

    const result: EManagerFile[] = await query.execute();
    return res.status(200).json({ message: "success", files: result });
  } catch (err) {
    console.error(err);
    if (err instanceof z.ZodError) {
      return res.status(400).json({ message: "invalid `submission_id`" });
    } else {
      return res.status(500).json({ message: "internal server error" });
    }
  }
});

const filePostQuerySchema = z.object({
  files: z.array(
    z.object({
      file_id: z.string(),
      file_name: z.string(),
      file_size: z.union([z.number(), z.null()]),
      file_type: z.string(),
      file_url: z.string(),
      submission_id: z.string(),
    }),
  ),
});

// /api/editorial-manager/file/
emanagerFileRouter.post("/", async (req, res) => {
  try {
    const validatedBodyObject = filePostQuerySchema.parse(req.body);
    validatedBodyObject.files.forEach(async (file) => {
      await db.insertInto("EManager_File").values(file).execute();
    });
    return res.status(201).json({ message: "successfully uploaded files" });
  } catch (err) {
    console.error(err);
    if (err instanceof z.ZodError) {
      return res.status(400).json({ message: "body object has wrong type" });
    } else {
      return res.status(500).json({ message: `internal server error` });
    }
  }
});

export default emanagerFileRouter;
