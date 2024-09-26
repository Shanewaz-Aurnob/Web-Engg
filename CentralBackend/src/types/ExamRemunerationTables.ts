import { Generated, Insertable, Selectable, Updateable } from "kysely";

export interface Bill_Sectors{
  bill_sector_id: Generated<number>;
  bill_sector_name: string;
}

export interface ExamActivityTable {
  rule_id: Generated<number>;
  bill_sector_id: number;
  exam_activity_type_id: number;
  quantity_initial: number;
  quantity_final: number;
  exam_bill: number;
  min_exam_bill: number;
  factor: string;
  valid_from: Date | null;
}

export interface ExamActivityTypeTable {
  exam_activity_type_id: number;
  exam_activity_name: string;
  exam_category: string;
}

export interface ExamActivityFactorsTable {
  id: Generated<number>;
  activity_id: number;
  factor: string;
  quantity: number;
}

export interface EvaluatesActivityTable {
  activity_id: Generated<number>;
  exam_activity_type_id: number;
  academic_session_id: number;
  teacher_id: number;
  bill_sector_id: number;
  course_id: number | null;
  department_id: number;
  exam_id: number;
  last_modified: Date;
}

export interface ExamBillTable {
  exam_bill_id: Generated<number>;
  teacher_id: number;
  academic_session_id: number;
  department_id: number;
  exam_session: string;
  exam_bill_position: number;
  exam_bill_payment: number;
}
export interface ExamCalculationMetadataTable {
  id: Generated<number>;
  activity_id: number;
  calculated_amound: number;
  last_calculated: Date | null;
  calculated_status: "Failed" | "Success";
}

export interface ExamBillChecksTable {
  exam_bill_id: Generated<number>;
  staff_id: number;
  bill_check_time: Date | null;
  exam_bill_status: "Approved" | "Rejected" | "Pending";
  exam_bill_message: string;
}

export type BillSectors = Selectable<Bill_Sectors>;
export type newBillSectors = Insertable<Bill_Sectors>;
export type BillSectorsUpdate = Updateable<Bill_Sectors>;

export type ExamActivity = Selectable<ExamActivityTable>;
export type newExamActivity = Insertable<ExamActivityTable>;
export type ExamActivityUpdate = Updateable<ExamActivityTable>;

export type ExamActivityType = Selectable<ExamActivityTypeTable>;
export type newExamActivityType = Insertable<ExamActivityTypeTable>;
export type ExamActivityTypeUpdate = Updateable<ExamActivityTypeTable>;

export type ExamActivityFactors = Selectable<ExamActivityFactorsTable>;
export type newExamActivityFactors = Insertable<ExamActivityFactorsTable>;
export type ExamActivityFactorsUpdate = Updateable<ExamActivityFactorsTable>;

export type EvaluatesActivity = Selectable<EvaluatesActivityTable>;
export type newEvaluatesActivity = Insertable<EvaluatesActivityTable>;
export type EvaluatesActivityUpdate = Updateable<EvaluatesActivityTable>;

export type ExamBill = Selectable<ExamBillTable>;
export type newExamBill = Insertable<ExamBillTable>;
export type ExamBillUpdate = Updateable<ExamBillTable>;

export type ExamCalculationMetadata = Selectable<ExamCalculationMetadataTable>;
export type newExamCalculationMetadata =
  Insertable<ExamCalculationMetadataTable>;
export type ExamCalculationMetadataUpdate =
  Updateable<ExamCalculationMetadataTable>;

export type ExamBillChecks = Selectable<ExamBillChecksTable>;
export type newExamBillChecks = Insertable<ExamBillChecksTable>;
export type ExamBillChecksUpdate = Updateable<ExamBillChecksTable>;
