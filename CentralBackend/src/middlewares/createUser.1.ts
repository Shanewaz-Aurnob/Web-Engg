import { NextFunction, Request, Response } from "express";
import { userReqBody } from "./createUser";

export async function createUser(
  req: Request,
  res: Response,
  next: NextFunction
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
    const user = await req.db.insertInto("user").values({
      address_id,
      password,
      email,
      phone,
      first_name,
    });
  } finally {
  }
}
