import { SelectQueryBuilder } from "kysely";
import { Database, TableName } from "../../database";
import { AddressFilter } from "../../filters/AddressFilter";
import { Request } from "express";
import { z } from "zod";
import { zCoercedEnum } from "../../types/coreredEnum";

enum AddressTypes {
  "Present",
  "Permanent",
}

const AddressTypeEnum = zCoercedEnum(AddressTypes);

export function addAddressFilters(
  req: Request,
  query: SelectQueryBuilder<Database, "Address", {}>,
) {
  if (
    req.query.country &&
    AddressTypeEnum.safeParse(req.query.country).success
  ) {
    query = query.where("Address.country", "=", req.query.country as string);
  }

  if (
    req.query.address_type &&
    AddressTypeEnum.safeParse(req.query.address_type).success
  ) {
    query = query.where(
      "Address.address_type",
      "=",
      req.query.address_type as any,
    );
  }
  if (req.query.district && z.string().safeParse(req.query.district).success) {
    query = query.where("Address.district", "=", req.query.district as string);
  }
  if (req.query.division && z.string().safeParse(req.query.division).success) {
    query = query.where("Address.division", "=", req.query.division as string);
  }
  if (
    req.query.post_office &&
    z.string().safeParse(req.query.post_office).success
  ) {
    query = query.where(
      "Address.post_office",
      "=",
      req.query.post_office as string,
    );
  }
  if (
    req.query.postal_code &&
    z.coerce.number().safeParse(req.query.postal_code).success
  ) {
    query = query.where(
      "Address.postal_code",
      "=",
      z.coerce.number().parse(req.query.postal_code),
    );
  }
  if (req.query.thana && z.string().safeParse(req.query.thana).success) {
    query = query.where("Address.thana", "=", req.query.thana as string);
  }
  if (
    req.query.union_name &&
    z.string().safeParse(req.query.union_name).success
  ) {
    query = query.where(
      "Address.union_name",
      "=",
      req.query.union_name as string,
    );
  }
  if (req.query.upazila && z.string().safeParse(req.query.upazila).success) {
    query = query.where("Address.upazila", "=", req.query.upazila as string);
  }
  if (req.query.village && z.string().safeParse(req.query.village).success) {
    query = query.where("Address.village", "=", req.query.village as string);
  }
  return query;
}
