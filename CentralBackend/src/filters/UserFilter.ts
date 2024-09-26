import { Request } from "express";

type ConstructorProps = {
  name?: string;
  email?: string;
  phone?: string;
  religion?: string;
  first_name?: string;
  last_name?: string;
  gender?: string;
  nationality?: string;
  ethnicity?: string;
  blood_group?: string;
  address_id?: number;
};

export class UserFilter {
  name?: string;
  email?: string;
  phone?: string;
  religion?: string;
  first_name?: string;
  last_name?: string;
  gender?: string;
  nationality?: string;
  ethnicity?: string;
  blood_group?: string;
  address_id?: number;

  constructor({
    name,
    email,
    phone,
    religion,
    first_name,
    last_name,
    gender,
    nationality,
    ethnicity,
    blood_group,
    address_id,
  }: ConstructorProps) {
    this.name = name;
    this.email = email;
    this.phone = phone;
    this.religion = religion;
    this.first_name = first_name;
    this.last_name = last_name;
    this.gender = gender;
    this.nationality = nationality;
    this.ethnicity = ethnicity;
    this.blood_group = blood_group;
    this.address_id = address_id;
  }

  static fromRequest(req: Request): UserFilter {
    return new UserFilter({
      name: req.query.name as string | undefined,
      email: req.query.email as string | undefined,
      phone: req.query.phone as string | undefined,
      religion: req.query.religion as string | undefined,
      first_name: req.query.first_name as string | undefined,
      last_name: req.query.last_name as string | undefined,
      gender: req.query.gender as string | undefined,
      nationality: req.query.nationality as string | undefined,
      ethnicity: req.query.ethnicity as string | undefined,
      blood_group: req.query.blood_group as string | undefined,
      address_id: req.query.address_id as number | undefined,
    });
  }
}
