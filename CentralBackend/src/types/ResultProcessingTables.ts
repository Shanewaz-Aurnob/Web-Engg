import { Generated, Insertable, Selectable, Updateable } from "kysely";

export interface ExaminerTable {
  assigned_date: Generated<Date>;
  course_id: number;
  exam_id: number;
  is_submitted: Generated<number>;
  set: "A" | "B";
  submit_date: Date | null;
  teacher_id: number;
}
export interface SemesterResultTable {
  academic_session_id: number;
  cgpa: number;
  student_id: number;
}

export interface CatmMarkTable {
  attendance_mark: number;
  course_id: number;
  ct_mark: number;
  exam_id: number;
  student_id: number;
}

export interface TotalPaperMarkTable {
  course_id: number;
  exam_id: number;
  paper_code: number;
  set: "A" | "B";
  student_id?: number;
  total_mark?: number;
}

export interface QuestionMarkTable {
  course_id: number;
  exam_id: number;
  paper_code: number;
  q_mark: number;
  q_no: string;
  set: "A" | "B";
}

export interface Marksheet {
  exam_id: number;
  catm: number;
  course_id: number;
  fem: number;
  gpa: number;
  student_id: number;
}

export type Examiner = Selectable<ExaminerTable>;
export type NewExaminer = Insertable<ExaminerTable>;
export type ExaminerUpdate = Updateable<ExaminerTable>;

export type SemesterResult = Selectable<SemesterResultTable>;
export type NewSemesterResult = Insertable<SemesterResultTable>;
export type SemesterResultUpdate = Updateable<SemesterResultTable>;

export type CatmMark = Selectable<CatmMarkTable>;
export type NewCatmMark = Insertable<CatmMarkTable>;
export type CatmMarkUpdate = Updateable<CatmMarkTable>;

export type TotalPaperMark = Selectable<TotalPaperMarkTable>;
export type NewTotalPaperMark = Insertable<TotalPaperMarkTable>;
export type TotalPaperMarkUpdate = Updateable<TotalPaperMarkTable>;

export type QuestionMark = Selectable<QuestionMarkTable>;
export type NewQuestionMark = Insertable<QuestionMarkTable>;
export type QuestionMarkUpdate = Updateable<QuestionMarkTable>;

export type MarksheetTable = Selectable<Marksheet>;
export type NewMarksheetTable = Insertable<Marksheet>;
export type MarksheetTableUpdate = Updateable<Marksheet>;
