import express from "express";
import db from "../../database";
const authRouter = express.Router();

authRouter.post("/login", async (req, res) => {
  // Example authentication
  const { user_id, password } = req.body;

  const result = await db
    .selectFrom("User")
    .where("user_id", "=", user_id)
    .where("password", "=", password)
    .selectAll()
    .executeTakeFirst();

  if (Boolean(result)) {
    // TODO: Generate a token here
    result!.password = "";

    return res.status(200).json({
      message: "Successfully logged in",
      user: result,
    });
  }

  return res.status(403).json({ message: "Invalid credentials" });
});

authRouter.post("/signup", (req, res) => {
  res.status(201).json({ message: "Signup endpoint" });
});

export default authRouter;
