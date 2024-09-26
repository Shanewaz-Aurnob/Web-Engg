import {
  EvaluatesActivity,
  ExamActivity,
  ExamActivityFactors
} from "../../types/ExamRemunerationTables";

type Bill_Calculation = (
  exam_activity: EvaluatesActivity,
  exam_activity_factors: ExamActivityFactors,
  exam_activity_rate: ExamActivity
) => Promise<any>;

export { Bill_Calculation };
