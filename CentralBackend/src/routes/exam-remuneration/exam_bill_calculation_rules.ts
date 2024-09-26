import {
  calc_bill_questionSetting_honours_v2019,
  calc_bill_questionSetting_tutorial_v2019,
  calc_bill_answerscriptExamining_honours_v2019,
  calc_bill_answerscriptExamining_tutorial_v2019,
  calc_bill_answerscriptExamining_laboratory_v2019,
  calc_bill_answerscriptExamining_scrutiny_v2019,
  calc_bill_answerscriptExamining_mphil_phd_v2019,
  calc_bill_answerscriptExamining_terminal_v2019
} from "./exam_bill_calculation_functions";
import { Bill_Calculation } from "./types";

const exam_bill_calculation_rules: Record<
  number,
  Record<number, Array<{ startDate: Date; rule: Bill_Calculation }>>
> = {
  // Question setting
  1: {
    // honours
    10: [
      {
        startDate: new Date("2020-01-01"),
        rule: calc_bill_questionSetting_honours_v2019
      }
    ],
    2: [
      {
        startDate: new Date("2020-01-01"),
        rule: calc_bill_questionSetting_tutorial_v2019
      }
    ]
  },
  4: {
    10: [
      {
        startDate: new Date("2020-01-01"),
        rule: calc_bill_answerscriptExamining_honours_v2019
      }
      
    ],
    2: [
      {
        startDate: new Date("2020-01-01"),
        rule: calc_bill_answerscriptExamining_tutorial_v2019
      }
    ],
    3: [
      {
        startDate: new Date("2020-01-01"),
        rule: calc_bill_answerscriptExamining_laboratory_v2019
      }
    ],
    4: [
      {
        startDate: new Date("2020-01-01"),
        rule: calc_bill_answerscriptExamining_scrutiny_v2019
      }
    ],
    22: [
      {
        startDate: new Date("2020-01-01"),
        rule: calc_bill_answerscriptExamining_mphil_phd_v2019
      }
    ],
    20: [
      {
        startDate: new Date("2020-01-01"),
        rule: calc_bill_answerscriptExamining_terminal_v2019
      }
    ]
  }
};

export { exam_bill_calculation_rules };
