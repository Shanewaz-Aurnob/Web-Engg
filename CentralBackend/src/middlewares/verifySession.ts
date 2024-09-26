import { NextFunction, Request, Response } from "express";
import { z } from "zod";
import db from "../database";

const authHeader = z.string();

export type session_t = {
  session_id: string;
  user_id: string;
  created_at: Date;
};
export interface SessionRequest extends Request {
  session?: session_t;
}

export async function verifySession(
  req: SessionRequest,
  res: Response,
  next: NextFunction,
) {
  try {
    const bearerHeader = authHeader.parse(req.headers["authorization"]);
    const token = z.string().parse(bearerHeader.split(" ")[1]);

    // Verify the token here
    const session = await db
      .selectFrom("Auth_Session")
      .where("session_id", "=", token)
      .selectAll()
      .executeTakeFirst();

    // Check if the session exists
    if (!session) {
      return res
        .status(403)
        .json({ message: "Session expired. Please log in again." });
    }

    // Check if the session has expired, limit: 7 days
    if (Date.now() - session.created_at.getTime() > 1000 * 60 * 60 * 24 * 7) {
      // Remove the session from the database
      await db
        .deleteFrom("Auth_Session")
        .where("session_id", "=", token)
        .execute();

      return res
        .status(403)
        .json({ message: "Session expired. Please log in again." });
    }

    // Else, valid session
    req.session = session;
    return next();
  } catch (error) {
    if (error instanceof z.ZodError) {
      return res.status(403).json({
        message: "Invalid token",
        error: JSON.parse((error as z.ZodError).message),
      });
    }
  }
}
