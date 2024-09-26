import { exam_bill_calculation_rules } from "./exam_bill_calculation_rules";
import exam from "../exam";

const select_and_calculate_bill = async (
  exam_activity: any,
  exam_activity_factors: any,
  exam_activity_rate: any,
  exam_year: number
) => {
  if (
    exam_bill_calculation_rules[exam_activity.exam_activity_type_id] &&
    exam_bill_calculation_rules[exam_activity.exam_activity_type_id][exam_activity.bill_sector_id]
  ) {
    console.log(exam_activity.exam_activity_type_id, exam_activity.bill_sector_id);
    const rules =
      exam_bill_calculation_rules[exam_activity.exam_activity_type_id][exam_activity.bill_sector_id];

      const ruleInfo = rules[0];
    // const ruleInfo = rules.find(ruleInfo => ruleInfo.startDate.getFullYear() === exam_year);
    if (ruleInfo) {
      return await ruleInfo.rule(exam_activity, exam_activity_factors, exam_activity_rate);
    } else {
      throw new Error("Rule not found for the given year");
    }
  } else {
    throw new Error("Rule not found");
  }
};

export { select_and_calculate_bill };
