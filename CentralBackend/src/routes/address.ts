import express from "express";
import { z } from "zod";
import db from "../database";
import { addFiltration } from "../helper/addFiltration";
import { paginatedResults } from "../helper/paginatedResults";
import { verifySession } from "../middlewares/verifySession";
import {
  checkPermissions,
  PermissionRequest,
  Role,
} from "../middlewares/checkPermissions";
const addressRouter = express.Router();

// Get all addresses
addressRouter.get("/", async (req, res) => {
  try {
    var query = db.selectFrom("Address").selectAll();
    query = addFiltration("Address", query as any, req) as any;
    paginatedResults(query as any, req, res);
  } catch (error) {
    return res.status(500).json({ message: "Internal server error", error });
  }
});

// Get current user's addresses
addressRouter.get(
  "/my",
  verifySession,
  checkPermissions,
  async (req: PermissionRequest, res) => {
    var userQuery = db
      .selectFrom("User")
      .where("User.user_id", "=", req.session?.user_id!);
    var addressQuery = db.selectFrom("Address").selectAll();
    if (req.role === Role.Student) {
      const studentAddressIDs = await userQuery
        .innerJoin("Student", "Student.user_id", "User.user_id")
        .select([
          "User.permanent_address_id",
          "User.present_address_id",
          "Student.guardian_address_id",
        ])
        .executeTakeFirst();
      if (!studentAddressIDs)
        return res.status(404).json({ message: "User information not found" });

      const permanentAddress = await addressQuery
        .where(
          "Address.address_id",
          "=",
          studentAddressIDs.permanent_address_id ?? 0,
        )
        .executeTakeFirst();
      const presentAddress = await addressQuery
        .where(
          "Address.address_id",
          "=",
          studentAddressIDs.present_address_id ?? 0,
        )
        .executeTakeFirst();
      const guardiansAddress = await addressQuery
        .where(
          "Address.address_id",
          "=",
          studentAddressIDs.guardian_address_id ?? 0,
        )
        .executeTakeFirst();

      return res.status(200).json({
        permanent_address: permanentAddress,
        present_address: presentAddress,
        guardians_address: guardiansAddress,
      });
    }

    const userAddressIDs = await userQuery
      .select(["User.present_address_id", "User.permanent_address_id"])
      .executeTakeFirst();
    if (!userAddressIDs)
      return res.status(404).json({ message: "User information not found" });

    const permanentAddress = await addressQuery
      .where(
        "Address.address_id",
        "=",
        userAddressIDs.permanent_address_id ?? 0,
      )
      .executeTakeFirst();
    const presentAddress = await addressQuery
      .where("Address.address_id", "=", userAddressIDs.present_address_id ?? 0)
      .executeTakeFirst();

    return res.status(200).json({
      permanent_address: permanentAddress,
      present_address: presentAddress,
    });
  },
);

// Get address by id
addressRouter.get("/:id", async (req, res) => {
  try {
    const address_id = z.coerce.number().parse(req.params.id);

    const data = await db
      .selectFrom("Address")
      .selectAll()
      .where("Address.address_id", "=", address_id)
      .executeTakeFirst();

    if (!data) {
      return res
        .status(404)
        .json({ message: "Address with id " + address_id + " not found" });
    }

    return res.status(200).json(data);
  } catch (error) {
    if (error instanceof z.ZodError) {
      return res.status(400).json({
        name: "Invalid data type.",
        message: JSON.parse(error.message),
      });
    }

    return res.status(500).json({ message: "Internal server error", error });
  }
});

export default addressRouter;
