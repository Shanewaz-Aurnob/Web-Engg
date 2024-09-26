import { SelectQueryBuilder } from "kysely";
import { Database, TableName } from "../../database";
import { UserFilter } from "../../filters/UserFilter";
import { Request } from "express";
import { z } from "zod";

export function addUserFilters(
  req: Request,
  query: SelectQueryBuilder<Database, "User", {}>,
) {
  if (req.query.email && z.string().safeParse(req.query.email).success) {
    query = query.where("User.email", "=", req.query.email as string);
  }
  if (
    req.query.permanent_address_id &&
    z.coerce.number().safeParse(req.query.permanent_address_id).success
  ) {
    query = query.where(
      "User.permanent_address_id",
      "=",
      z.coerce.number().parse(req.query.permanent_address_id),
    );
  }
  if (
    req.query.present_address_id &&
    z.coerce.number().safeParse(req.query.present_address_id).success
  ) {
    query = query.where(
      "User.present_address_id",
      "=",
      z.coerce.number().parse(req.query.present_address_id),
    );
  }
  if (
    req.query.blood_group &&
    z.string().safeParse(req.query.blood_group).success
  ) {
    query = query.where(
      "User.blood_group",
      "=",
      req.query.blood_group as string,
    );
  }
  if (
    req.query.ethnicity &&
    z.string().safeParse(req.query.ethnicity).success
  ) {
    query = query.where("User.ethnicity", "=", req.query.ethnicity as string);
  }
  if (
    req.query.first_name &&
    z.string().safeParse(req.query.first_name).success
  ) {
    query = query.where("User.first_name", "=", req.query.first_name as string);
  }
  if (req.query.gender && z.string().safeParse(req.query.gender).success) {
    query = query.where("User.gender", "=", req.query.gender as string);
  }
  if (
    req.query.last_name &&
    z.string().safeParse(req.query.last_name).success
  ) {
    query = query.where("User.last_name", "=", req.query.last_name as string);
  }
  if (req.query.nationality && z.string().safeParse(req.query.nationality)) {
    query = query.where(
      "User.nationality",
      "=",
      req.query.nationality as string,
    );
  }
  if (req.query.phone && z.string().safeParse(req.query.phone).success) {
    query = query.where("User.phone", "=", req.query.phone as string);
  }
  if (req.query.religion && z.string().safeParse(req.query.religion).success) {
    query = query.where("User.religion", "=", req.query.religion as string);
  }
  if (
    req.query.sign_id &&
    z.coerce.number().safeParse(req.query.sign_id).success
  ) {
    query = query.where(
      "User.sign_id",
      "=",
      z.coerce.number().parse(req.query.sign_id),
    );
  }

  return query;
}
