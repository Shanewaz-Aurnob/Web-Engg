import { NextFunction, Request, Response } from "express";
import { FormType, Role, form_t, user_t, users } from "../data";
import { canViewForm } from "../permissions/form";
import jwt from "jsonwebtoken";

export function authToken(req: Request, res: Response, next: NextFunction) {
  const header = req.headers["authorization"]; //get the authorization header
  const token = header && header.split(" ")[1]; // Bearer TOKEN

  if (token == null)
    return res
      .status(401)
      .json({ message: "Authentication required. No token provided" });

  jwt.verify(token, process.env.SECRET_TOKEN ?? "secret_key", (err, user) => {
    if (err) {
      return res.status(403).json({ message: "Unauthorized access" });
    }

    // TODO: Store the token in the database instead of the request object
    // req.signedCookies = user;

    next();
  });
}

export const authUser = (req: Request, res: Response, next: NextFunction) => {
  const uid = req.body.uid;
  if (!Boolean(uid)) {
    return res
      .status(403)
      .json({ message: "Session expired. Please log in again." });
  }

  //! Ideally query the database to get the role
  const currentUser = users.find((user) => user.uid === uid);

  if (currentUser === null || currentUser === undefined) {
    return res
      .status(401)
      .json({ message: "User not found. Try logging in again." });
  }

  // TODO: Store the user info
  // req.currentUser = currentUser;

  next();
};

export const authRole = (role: Role) => {
  return (req: Request, res: Response, next: NextFunction) => {
    // const currentUser = req.currentUser;
    // TODO: Get current user info
    const currentUser: user_t | undefined = undefined;

    if (!Boolean(currentUser)) {
      return res
        .status(401)
        .json({ message: "User not found. Try logging in again." });
    }

    if (role !== currentUser!.role) {
      return res
        .status(401)
        .json({ message: "You do not have permissions to access this." });
    }

    next();
  };
};

export const authGetForm = (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  // Get current user
  // Get form id
  const user: user_t = {
    uid: 1,
    role: Role.TEACHER,
    name: "John",
  };

  const form: form_t = {
    id: 1,
    userId: 1,
    type: FormType.GRANT,
  };
  if (!canViewForm({ user, form })) {
    return res
      .status(401)
      .json({ message: "You do not have permission to access this form." });
  }

  next();
};
