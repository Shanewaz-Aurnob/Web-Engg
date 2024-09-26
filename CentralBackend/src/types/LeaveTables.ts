import {
    ColumnType,
    Generated,
    Insertable,
    JSONColumnType,
    Selectable,
    Updateable,
  } from "kysely";
  
  export interface StudyLeaveApplicationTable {
    applicant_id: string;
    applied_date: Date;
    attachments: string | null;
    department: string;
    designation: string;
    destination: string;
    destination_country: string;
    duration: number;
    final_application: string | null;
    financial_source: string;
    joining_date: Date;
    leave_id: Generated<number>;
    leave_start_date: Date;
    my_application_chairman: string | null;
    my_application_registrar: string | null;
    name_of_program: string;
    program_start_date: Date;
    signature: string | null;
  }
  
  export interface StudyLeaveEvaluationTable {
    applicant_id: string;
    evaluation_type: string;
    le_comment: string | null;
    le_evaluation_time: Date;
    le_status: string;
    leave_id: number;
  }

  export interface OtherLeaveApplicationTable {
    applicant_id: string;
    attachments: string | null;
    designation: string;
    duration: number;
    final_application: string | null;
    leave_ground: string | null;
    leave_id: Generated<number>;
    leave_start_date: Date;
    my_application_chairman: string | null;
    nature_of_leave: string;
    salary_acknowledgement: number | null;
    signature: string | null;
    station_leaving_permission: string | null;
  }
  
  export interface OtherLeaveEvaluationTable {
    applicant_id: string;
    evaluation_type: string;
    le_comment: string | null;
    le_evaluation_time: Date;
    le_status: string;
    leave_id: number;
  }

  export type StudyLeaveApplication= Selectable<StudyLeaveApplicationTable>;
  export type NewStudyLeaveApplication=Insertable<StudyLeaveApplicationTable>;
  export type StudyLeaveApplicationUpdate=Updateable<StudyLeaveApplicationTable>;

  export type OtherLeaveApplication= Selectable<OtherLeaveApplicationTable>;
  export type NewOtherLeaveApplication=Insertable<OtherLeaveApplicationTable>;
  export type OtherLeaveApplicationUpdate=Updateable<OtherLeaveApplicationTable>;
  
  export type StudyLeaveEvaluation= Selectable<StudyLeaveEvaluationTable>;
  export type NewStudyLeaveEvaluation=Insertable<StudyLeaveEvaluationTable>;
  export type StudyLeaveEvaluationUpdate=Updateable<StudyLeaveEvaluationTable>;

  export type OtherLeaveEvaluation= Selectable<OtherLeaveEvaluationTable>;
  export type NewOtherLeaveEvaluation=Insertable<OtherLeaveEvaluationTable>;
  export type OtherLeaveEvaluationUpdate=Updateable<OtherLeaveEvaluationTable>;

