import {
  ColumnType,
  Generated,
  Insertable,
  JSONColumnType,
  Selectable,
  Updateable,
} from "kysely";

// Related to result processing

export interface FormTable {
  clearance_level: Generated<number | null>;
  current_address_id: number | null;
  description_of_other_programs: Generated<string | null>;
  exam_id: number | null;
  form_id: Generated<number>;
  form_submission_time: Date | null;
  permanent_address_id: number | null;
  previous_charges: Generated<string | null>;
  student_id: number | null;
  student_status: Generated<"Improvement" | "Irregular" | "Regular">;
}

export interface FormEvaluationTable {
  end_time: Date | null;
  evaluation_id: Generated<number>;
  evaluator_id: string | null;
  form_id: number | null;
  start_time: Date | null;
}

export interface ImageTable {
  image_id: Generated<number>;
  image_path: string | null;
  image_type: string | null;
}

export interface ExamCommitteeTable {
  exam_id: number;
  formation_date: Generated<Date>;
  role: "Chairman" | "Member" | "Tabulator";
  teacher_id: number;
}

export interface ExamTable {
  exam_id: Generated<number>;
  department_id: number;
  academic_session_id: number;
  exam_session: string;
  exam_name: string;
  exam_centre: string;
  exam_start_date: Date | null;
  exam_end_date: Date | null;
  is_result_submitted: 0 | 1;
  result_submit_date: Date | null;
}
export type Image = Selectable<ImageTable>;
export type NewImage = Insertable<ImageTable>;
export type ImageUpdate = Updateable<ImageTable>;

export type ExamCommittee = Selectable<ExamCommitteeTable>;
export type newExamCommittee = Insertable<ExamCommitteeTable>;
export type ExamCommitteeUpdate = Updateable<ExamCommitteeTable>;

export type Exam = Selectable<ExamTable>;
export type NewExam = Insertable<ExamTable>;
export type ExamUpdate = Updateable<ExamTable>;