import { NextFunction, Request, Response } from "express";
import { z } from "zod";
import db from "../database";

interface UserRequest extends Request {
  user_id: string;
}

export const userReqBody = z.object({
  sign_id: z.number(),
  address_id: z.number(),
  password: z.string().min(8),
  email: z.string().email(),
  phone: z.string().min(11).max(11).startsWith("01"),
  first_name: z.string(),
  last_name: z.string(),
  dob: z.date().or(z.string()),
  gender: z.string(),
  blood_group: z.string(),
  religion: z.string(),
  ethnicity: z.string(),
  nationality: z.string(),
});

export async function createUser(
  req: UserRequest,
  res: Response,
  next: NextFunction,
) {
  try {
    const {
      address_id,
      password,
      email,
      phone,
      first_name,
      last_name,
      dob,
      gender,
      blood_group,
      religion,
      ethnicity,
      nationality,
    } = userReqBody.parse(req.body);
    // Creating the user

    try {
      await db
        .insertInto("User")
        .values({
          address_id,
          password,
          email,
          phone,
          first_name,
          last_name,
          dob,
          gender,
          blood_group,
          religion,
          ethnicity,
          nationality,
        })
        .execute();

      const result = await db
        .selectFrom("User")
        .select(["user_id"])
        .where("email", "=", email)
        .executeTakeFirstOrThrow();

      req.user_id = result.user_id;
      next();
    } catch (error) {
      return res
        .status(500)
        .json({ message: "Something went wrong. Please try again.", error });
    }
  } catch (error) {
    if (error instanceof z.ZodError) {
      return res.status(400).json({
        name: "Invalid data type.",
        message: JSON.parse(error.message),
      });
    }

    return res.status(400).json({ message: "Invalid request body", error });
  }
}
