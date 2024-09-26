import {
  EvaluatesActivity,
  ExamActivity,
  ExamActivityFactors
} from "../../types/ExamRemunerationTables";
import { Bill_Calculation } from "./types";
// question setting honours v2019
const calc_bill_questionSetting_honours_v2019: Bill_Calculation = async (
  exam_activity: EvaluatesActivity,
  exam_activity_factors: ExamActivityFactors,
  exam_activity_rule: ExamActivity
) => {
  // calculate
  var halfFullPart = Array.isArray(exam_activity_factors) ? exam_activity_factors.filter((factor: { factor: string; activity_id: number; }) => factor.factor === "অর্ধ/পূর্ণ") : [];
  var courseHours =  Array.isArray(exam_activity_factors) ? exam_activity_factors.filter((factor: { factor: string; activity_id: number; }) => factor.factor === "ঘণ্টা") : [];
  const { exam_activity_type_id, bill_sector_id, course_id  } = exam_activity;
  var exam_bill = Array.isArray(exam_activity_rule) ? exam_activity_rule.filter(
  (factor: { exam_activity_type_id: number; bill_sector_id: number; quantity_initial: number; quantity_final: number }) => 
    factor.exam_activity_type_id === exam_activity_type_id && factor.bill_sector_id === bill_sector_id  && (factor.quantity_initial ===courseHours[0].quantity || (factor.quantity_initial <= courseHours[0].quantity && factor.quantity_final >= courseHours[0].quantity)) )[0].exam_bill
    : 0;
  var billAmount = halfFullPart[0].quantity == 1 ? exam_bill / 2.0 : exam_bill ;
  console.log("questionSetting_honours_v2019", billAmount);
  return billAmount;
};


// question setting tutorial v2019
const calc_bill_questionSetting_tutorial_v2019: Bill_Calculation = async (
  exam_activity: EvaluatesActivity,
  exam_activity_factors: ExamActivityFactors,
  exam_activity_rule: ExamActivity
) => {
  // calculate
  const uniqueActivityIds = Array.isArray(exam_activity_factors) ? exam_activity_factors.reduce((acc, item, index) => {
    if (!acc.includes(item.activity_id)) {
      acc.push(item.activity_id);
    }
    return acc;
  } , []) : []; 

  var billResult = 0.0;
  for(let activityId of uniqueActivityIds) {
    var numberOfExams = Array.isArray(exam_activity_factors) ? exam_activity_factors.filter((factor: { factor: string; activity_id:number; }) => factor.factor === "পরীক্ষার সংখ্যা"  && factor.activity_id === activityId) : [];
    const { exam_activity_type_id, bill_sector_id,  } = exam_activity;
    var exam_bill = Array.isArray(exam_activity_rule) ? exam_activity_rule.filter((factor: { exam_activity_type_id: number; bill_sector_id: number; }) => factor.exam_activity_type_id === exam_activity_type_id && factor.bill_sector_id === bill_sector_id)[0].exam_bill : 0;
    var billAmount = numberOfExams[0].quantity * exam_bill; // // number of exams * exam_bill
    billResult += billAmount;
  }
  console.log("questionSetting_tutorial_v2019", billResult)
  return billResult;
};

//answerscript examining honours
const calc_bill_answerscriptExamining_honours_v2019: Bill_Calculation = async(
  exam_activity: EvaluatesActivity,
  exam_activity_factors: ExamActivityFactors,
  exam_activity_rule: ExamActivity
) => {
  // calculate
  // const uniqueActivityIds = Array.isArray(exam_activity_factors) ? exam_activity_factors.reduce((acc, item, index) => {
  //   if (!acc.includes(item.activity_id)) {
  //     acc.push(item.activity_id);
  //   }
  //   return acc;
  // } , []) : []; 

  var halfFullPart = Array.isArray(exam_activity_factors) ? exam_activity_factors.filter((factor: { factor: string; activity_id: number; }) => factor.factor === "অর্ধ/পূর্ণ" ) : [];
  var courseHours =  Array.isArray(exam_activity_factors) ? exam_activity_factors.filter((factor: { factor: string; activity_id: number;}) => factor.factor === "ঘণ্টা" ) : [];
  var numberOfStudents = Array.isArray(exam_activity_factors) ? exam_activity_factors.filter((factor: { factor: string; activity_id: number;}) => factor.factor === "ছাত্রের সংখ্যা" ) : [];
  const { exam_activity_type_id, bill_sector_id, course_id } = exam_activity;
  var exam_bill = Array.isArray(exam_activity_rule) ? exam_activity_rule.filter(
    (factor: { exam_activity_type_id: number; bill_sector_id: number; quantity_initial: number; quantity_final: number }) => 
      factor.exam_activity_type_id === exam_activity_type_id && factor.bill_sector_id === bill_sector_id && 
    (factor.quantity_initial ===courseHours[0].quantity || (factor.quantity_initial <= courseHours[0].quantity && factor.quantity_final >= courseHours[0].quantity)))[0].exam_bill : 0;
  var billAmount = halfFullPart[0].quantity == 1 ? (numberOfStudents[0].quantity * exam_bill)/2.0 : (numberOfStudents[0].quantity * exam_bill);
  console.log( "answerscriptExamining_honours_v2019", billAmount)
  return billAmount;

}

//answerscript examining tutorial
const calc_bill_answerscriptExamining_tutorial_v2019: Bill_Calculation = async(
  exam_activity: EvaluatesActivity,
  exam_activity_factors: ExamActivityFactors,
  exam_activity_rule: ExamActivity
) => {
   // calculate
  var numberOfQuestions = Array.isArray(exam_activity_factors) ? exam_activity_factors.filter((factor: { factor: string; activity_id: number;}) => factor.factor === "পরীক্ষার সংখ্যা"  ) : []; 
  var numberOfStudents = Array.isArray(exam_activity_factors) ? exam_activity_factors.filter((factor: { factor: string; activity_id: number; }) => factor.factor === "ছাত্রের সংখ্যা" ) : [];
  const { exam_activity_type_id, bill_sector_id,  } = exam_activity;
  var exam_bill = Array.isArray(exam_activity_rule) ? exam_activity_rule.filter((factor: { exam_activity_type_id: number; bill_sector_id: number; }) => factor.exam_activity_type_id === exam_activity_type_id && factor.bill_sector_id === bill_sector_id)[0].exam_bill : 0;
  var billAmount = Math.min(exam_bill * numberOfQuestions[0].quantity, exam_bill * 3) * numberOfStudents[0].quantity;

  console.log("answerscriptExamining_tutorial_v2019", billAmount)
  return billAmount;

}

const calc_bill_answerscriptExamining_laboratory_v2019: Bill_Calculation = async(
  exam_activity: EvaluatesActivity,
  exam_activity_factors: ExamActivityFactors,
  exam_activity_rule: ExamActivity
) => {
  // calculate
  var numberOfStudents = Array.isArray(exam_activity_factors) ? exam_activity_factors.filter((factor: { factor: string; activity_id: number; }) => factor.factor === "ছাত্রের সংখ্যা" ) : [];
  var courseHours =  Array.isArray(exam_activity_factors) ? exam_activity_factors.filter((factor: { factor: string; activity_id: number;}) => factor.factor === "ঘণ্টা" ) : [];
  const { exam_activity_type_id, bill_sector_id,  } = exam_activity;
  var exam_bill = Array.isArray(exam_activity_rule) ? exam_activity_rule.filter(
    (factor: { exam_activity_type_id: number; bill_sector_id: number; quantity_initial: number; quantity_final: number }) => 
    factor.exam_activity_type_id === exam_activity_type_id && factor.bill_sector_id === bill_sector_id && (factor.quantity_initial ===courseHours[0].quantity || (factor.quantity_initial <= courseHours[0].quantity && factor.quantity_final >= courseHours[0].quantity)))[0].exam_bill : 0;
  var billAmount = exam_bill * numberOfStudents[0].quantity;
  console.log("answerscriptExamining_laboratory_v2019", billAmount);
  return billAmount;
}

const calc_bill_answerscriptExamining_scrutiny_v2019: Bill_Calculation = async(
  exam_activity: EvaluatesActivity,
  exam_activity_factors: ExamActivityFactors,
  exam_activity_rule: ExamActivity
) => {
  // calculate
  const { exam_activity_type_id, bill_sector_id,  } = exam_activity;
  var exam_bill = Array.isArray(exam_activity_rule) ? exam_activity_rule.filter((factor: { exam_activity_type_id: number; bill_sector_id: number; }) => factor.exam_activity_type_id === exam_activity_type_id && factor.bill_sector_id === bill_sector_id)[0].exam_bill : 0;
  var billResult = exam_bill; // exam_bill is 450 per course or for all courses 
  console.log("answerscriptExamining_scrutiny_v2019", billResult);
  return billResult;
}

const calc_bill_answerscriptExamining_mphil_phd_v2019: Bill_Calculation = async(
  exam_activity: EvaluatesActivity,
  exam_activity_factors: ExamActivityFactors,
  exam_activity_rule: ExamActivity
) => {
  // calculate
  var halfFullPart = Array.isArray(exam_activity_factors) ? exam_activity_factors.filter((factor: { factor: string; activity_id: number; }) => factor.factor === "অর্ধ/পূর্ণ" ) : [];
  var numberOfStudents = Array.isArray(exam_activity_factors) ? exam_activity_factors.filter((factor: { factor: string; activity_id: number;}) => factor.factor === "ছাত্রের সংখ্যা" ) : [];
  const { exam_activity_type_id, bill_sector_id, course_id } = exam_activity;
  var exam_bill = Array.isArray(exam_activity_rule) ? exam_activity_rule.filter(
    (factor: { exam_activity_type_id: number; bill_sector_id: number; quantity_initial: number; quantity_final: number }) => 
      factor.exam_activity_type_id === exam_activity_type_id && factor.bill_sector_id === bill_sector_id)[0].exam_bill : 0;
  var min_exam_bill = Array.isArray(exam_activity_rule) ? exam_activity_rule.filter(
    (factor: { exam_activity_type_id: number; bill_sector_id: number; quantity_initial: number; quantity_final: number }) => 
      factor.exam_activity_type_id === exam_activity_type_id && factor.bill_sector_id === bill_sector_id)[0].min_exam_bill : 0;
  var billAmount = halfFullPart[0].quantity == 1 ? Math.max(min_exam_bill, (numberOfStudents[0].quantity * exam_bill)/2.0) : Math.max(min_exam_bill, numberOfStudents[0].quantity * exam_bill);
  console.log( "answerscriptExamining_mphil_v2019", billAmount)
  return billAmount;
}

const calc_bill_answerscriptExamining_terminal_v2019: Bill_Calculation = async(
  exam_activity: EvaluatesActivity,
  exam_activity_factors: ExamActivityFactors,
  exam_activity_rule: ExamActivity
) => {
  //calculate
  var numberOfQuestions = Array.isArray(exam_activity_factors) ? exam_activity_factors.filter((factor: { factor: string; activity_id: number;}) => factor.factor === "পরীক্ষার সংখ্যা"  ) : []; 
  const { exam_activity_type_id, bill_sector_id,  } = exam_activity;
  var exam_bill = Array.isArray(exam_activity_rule) ? exam_activity_rule.filter(
    (factor: { exam_activity_type_id: number; bill_sector_id: number; quantity_initial: number; quantity_final: number }) => 
    factor.exam_activity_type_id === exam_activity_type_id && factor.bill_sector_id === bill_sector_id )[0].exam_bill : 0;
  var billAmount = exam_bill * numberOfQuestions[0].quantity;
  console.log("answerscriptExamining_terminal_v2019", billAmount)
  return billAmount;
}

const calc_bill_laboratoryExamination_v2019: Bill_Calculation = async (
  exam_activity: EvaluatesActivity,
  exam_activity_factors: ExamActivityFactors,
  exam_activity_rule: ExamActivity
) => {
  //calculate
  return 0;
}

export {
  calc_bill_questionSetting_honours_v2019,
  calc_bill_questionSetting_tutorial_v2019, 
  calc_bill_answerscriptExamining_honours_v2019,
  calc_bill_answerscriptExamining_tutorial_v2019,
  calc_bill_answerscriptExamining_laboratory_v2019,
  calc_bill_answerscriptExamining_scrutiny_v2019,
  calc_bill_answerscriptExamining_mphil_phd_v2019,
  calc_bill_answerscriptExamining_terminal_v2019,
  calc_bill_laboratoryExamination_v2019,
};

