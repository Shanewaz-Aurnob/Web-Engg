import { Request } from "express";

type ConstructorProps = {
  country?: string;
  division?: string;
  district?: string;
  upazila?: string;
  union_name?: string;
  post_office?: string;
  village?: string;
  postal_code?: number;
  thana?: string;
  address_type?: string;
};

export class AddressFilter {
  country?: string;
  division?: string;
  district?: string;
  upazila?: string;
  union_name?: string;
  post_office?: string;
  village?: string;
  postal_code?: number;
  thana?: string;
  address_type?: string;

  constructor({
    country,
    division,
    district,
    upazila,
    union_name,
    post_office,
    village,
    postal_code,
    thana,
    address_type,
  }: ConstructorProps) {
    this.country = country;
    this.division = division;
    this.district = district;
    this.upazila = upazila;
    this.union_name = union_name;
    this.post_office = post_office;
    this.village = village;
    this.postal_code = postal_code;
    this.thana = thana;
    this.address_type = address_type;
  }

  static fromRequest = (req: Request): AddressFilter => {
    const country = req.query.country as string | undefined;
    const division = req.query.division as string | undefined;
    const district = req.query.district as string | undefined;
    const upazila = req.query.upazila as string | undefined;
    const union_name = req.query.union_name as string | undefined;
    const post_office = req.query.post_office as string | undefined;
    const village = req.query.village as string | undefined;
    const postal_code: number | undefined = req.query.postal_code
      ? Number(req.query.postal_code)
      : undefined;
    const thana = req.query.thana as string | undefined;
    const address_type = req.query.address_type as string | undefined;

    return new AddressFilter({
      country,
      division,
      district,
      upazila,
      union_name,
      post_office,
      village,
      postal_code,
      thana,
      address_type,
    });
  };
}
