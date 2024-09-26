import { z } from "zod";

type EnumLike = {
  [k: string]: string | number;
  [nu: number]: string;
};

/**
 Returns a Zod schema that coerces a value to one of the enum values.(case insensitive)*/
export const zCoercedEnum = <T extends EnumLike>(e: T) =>
  z.preprocess((val) => {
    const target = String(val)?.toLowerCase();
    for (const k of Object.values(e)) {
      if (String(k)?.toLowerCase() === target) {
        return k;
      }
    }

    return null;
  }, z.nativeEnum(e));
