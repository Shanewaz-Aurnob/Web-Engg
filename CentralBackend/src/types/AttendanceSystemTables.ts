import {
    ColumnType,
    Generated,
    Insertable,
    JSONColumnType,
    Selectable,
    Updateable,
  } from "kysely";

  export interface CreateClass {
    class_endTime: string | null;
    class_startDate: Date | string;
    class_startTime: string | null;
    course_id: number | null;
    duration: number;
    secret_code: string | null;
    academic_session_id: number | null;
    teacher_id: number | null;
    session_id: Generated<number>;
  }
export type createClass = Selectable<CreateClass>;
export type newCreateClass = Insertable<CreateClass>;
export type updateCreateClass = Updateable<CreateClass>;