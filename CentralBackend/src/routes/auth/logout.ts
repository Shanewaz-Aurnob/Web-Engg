import express from "express";
const logoutRouter = express.Router();
import db from "../../database";
import { z } from "zod";

const authHeader = z.string();
logoutRouter.post("/", async (req, res) => {
  try {
    const bearerHeader = authHeader.parse(req.headers["authorization"]);
    const token = z.string().parse(bearerHeader.split(" ")[1]);

    await db
      .deleteFrom("Auth_Session")
      .where("session_id", "=", token)
      .execute();
    return res.status(200).json({ message: "Logged out successfully" });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return res.status(403).json({
        name: "Session id is required.",
        message: JSON.parse(error.message),
      });
    }

    return res
      .status(500)
      .json({ message: "Something went wrong during log out.", error });
  }
});

export default logoutRouter;
