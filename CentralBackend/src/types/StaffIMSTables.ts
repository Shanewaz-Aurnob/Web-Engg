import {
  ColumnType,
  Generated,
  Insertable,
  JSONColumnType,
  Selectable,
  Updateable,
} from "kysely";
export interface NoticeBoardTable {
  notice_id: Generated<number>;
  notice_type: string;
  notice_title: string;
  notice_description: string | null;
  notice_created_by: string;
  notice_uploaded_time: Date;
  notice_attachment: string;
}

export interface AssignTaskTable {
  task_id: number;
  assign_to: string;
  assign_by: string;
  assign_date: Date;
  due_date: Date;
  task_title: string;
  task_description: string;
  task_attachment: string;
  task_status: number;
}
export type Notice = Selectable<NoticeBoardTable>;
export type NewNotice = Insertable<NoticeBoardTable>;
export type NoticeUpdate = Updateable<NoticeBoardTable>;

export type AssignTask = Selectable<AssignTaskTable>;
export type NewAssignTask = Insertable<AssignTaskTable>;
export type AssignTaskUpdate = Updateable<AssignTaskTable>;
