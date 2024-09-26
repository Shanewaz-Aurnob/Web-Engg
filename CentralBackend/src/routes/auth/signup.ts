import express from "express";
const signupRouter = express.Router();
import db from "../../database";
import { z } from "zod";
import { createUser } from "../../middlewares/createUser.1";

const studentLoginReqBody = z.object({
  student_id: z.number().min(10000000),
  password: z.string().min(8),
});

signupRouter.post("/student", createUser, async (req, res) => {
  try {
    const { student_id, password } = studentLoginReqBody.parse(req.body);

    const user = await db
      .selectFrom("Student")
      .innerJoin("User", "Student.user_id", "User.user_id")
      .where("Student.student_id", "=", student_id)
      .where("User.password", "=", password)
      .selectAll()
      .executeTakeFirst();

    if (!user) {
      return res.status(403).json({ message: "Invalid credentials" });
    }

    user.password = "";

    // Generate a session id
    var session: { session_id: string } | undefined;
    try {
      await db
        .insertInto("AuthSession")
        .values({
          user_id: user.user_id,
        })
        .executeTakeFirst();

      // Get the session id
      session = await db
        .selectFrom("AuthSession")
        .select("AuthSession.session_id")
        .where("AuthSession.user_id", "=", user.user_id)
        .executeTakeFirst();
    } catch (error) {
      // Get the session id
      session = await db
        .selectFrom("AuthSession")
        .select("AuthSession.session_id")
        .where("AuthSession.user_id", "=", user.user_id)
        .executeTakeFirst();

      return res.status(200).json({
        message: "The user is already logged in",
        session_id: session?.session_id,
      });
    }

    // Return the session id
    res.status(200).send({
      message: "Successfully logged in",
      session_id: session?.session_id,
      user: user,
    });
  } catch (error) {
    var typeError: z.ZodError | undefined;
    if (error instanceof z.ZodError) {
      typeError = error as z.ZodError;
      return res.status(400).json({
        name: "Invalid data type.",
        message: JSON.parse(typeError.message),
      });
    }
    return res.status(400).json({ message: "Invalid request body", error });
  }
});

const teacherLoginReqBody = z.object({
  teacher_id: z.number().min(100000),
  password: z.string().min(8),
});
signupRouter.post("/teacher", async (req, res) => {
  try {
    const { teacher_id, password } = teacherLoginReqBody.parse(req.body);

    const user = await db
      .selectFrom("Teacher")
      .innerJoin("User", "Teacher.user_id", "User.user_id")
      .where("Teacher.teacher_id", "=", teacher_id)
      .where("User.password", "=", password)
      .selectAll()
      .executeTakeFirst();

    if (!user) {
      return res.status(403).json({ message: "Invalid credentials" });
    }

    user.password = "";

    // Generate a session id
    var session: { session_id: string } | undefined;
    try {
      await db
        .insertInto("AuthSession")
        .values({
          user_id: user.user_id,
        })
        .executeTakeFirst();

      // Get the session id
      session = await db
        .selectFrom("AuthSession")
        .select("AuthSession.session_id")
        .where("AuthSession.user_id", "=", user.user_id)
        .executeTakeFirst();
    } catch (error) {
      // Get the session id
      session = await db
        .selectFrom("AuthSession")
        .select("AuthSession.session_id")
        .where("AuthSession.user_id", "=", user.user_id)
        .executeTakeFirst();

      return res.status(200).json({
        message: "The user is already logged in",
        session_id: session?.session_id,
      });
    }

    // Return the session id
    res.status(200).send({
      message: "Successfully logged in",
      session_id: session?.session_id,
      user: user,
    });
  } catch (error) {
    var typeError: z.ZodError | undefined;
    if (error instanceof z.ZodError) {
      typeError = error as z.ZodError;
      return res.status(400).json({
        name: "Invalid data type.",
        message: JSON.parse(typeError.message),
      });
    }
    return res.status(400).json({ message: "Invalid request body", error });
  }
});

// Default authentication using email and password
const loginReqBody = z.object({
  email: z.string().email(),
  password: z.string().min(8),
});

// Default authentication
signupRouter.post("/", async (req, res) => {
  try {
    const { email, password } = loginReqBody.parse(req.body);

    const user = await db
      .selectFrom("User")
      .where("email", "=", email)
      .where("password", "=", password)
      .selectAll()
      .executeTakeFirst();

    if (!user) {
      return res.status(403).json({ message: "Invalid credentials" });
    }

    user.password = "";
    // Generate a session id
    var session: { session_id: string } | undefined;
    try {
      await db
        .insertInto("AuthSession")
        .values({
          user_id: user.user_id,
        })
        .executeTakeFirst();

      // Get the session id
      session = await db
        .selectFrom("AuthSession")
        .select("AuthSession.session_id")
        .where("AuthSession.user_id", "=", user.user_id)
        .executeTakeFirst();
    } catch (error) {
      // Get the session id
      session = await db
        .selectFrom("AuthSession")
        .select("AuthSession.session_id")
        .where("AuthSession.user_id", "=", user.user_id)
        .executeTakeFirst();

      return res.status(200).json({
        message: "The user is already logged in",
        session_id: session?.session_id,
      });
    }

    // Return the session id
    res.status(200).send({
      message: "Successfully logged in",
      session_id: session?.session_id,
      user: user,
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
});

export default signupRouter;
