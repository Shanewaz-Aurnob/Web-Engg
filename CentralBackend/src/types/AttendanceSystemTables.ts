import {
    ColumnType,
    Generated,
    Insertable,
    JSONColumnType,
    Selectable,
    Updateable,
  } from "kysely";

  export interface CreateClass {
    class_startDate: Date | string;
    class_startTime: string | null;
    course_id: number | null;
    duration: number;
    secret_code: string | null;
    session: string | null;
  }
export type createClass = Selectable<CreateClass>;
export type newCreateClass = Insertable<CreateClass>;
export type updateCreateClass = Updateable<CreateClass>;