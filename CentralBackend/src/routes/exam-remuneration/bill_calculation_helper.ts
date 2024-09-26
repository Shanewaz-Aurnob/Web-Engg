import db from "../../database";

const get_exam_year = async (exam_id: number) => {
  return await db.selectFrom("Exam")
    .select("Exam.exam_session")
    .where("Exam.exam_id", "=", exam_id)
    .executeTakeFirst();
};

const get_activity_factors_information = async (activity_id: number) => {
  return await db.selectFrom("Exam_Activity_Factors")
    .selectAll()
    .where("Exam_Activity_Factors.activity_id", "=", activity_id)
    .execute();
};

const get_activity_rates = async (exam_activity_type_id: number, bill_sector_id: number, exam_year: number) => {
  return await db.selectFrom("Exam_Activity")
    .selectAll()
    .where("Exam_Activity.exam_activity_type_id", "=", exam_activity_type_id)
    .where("Exam_Activity.bill_sector_id", "=", bill_sector_id)
    .execute();
};

export { get_exam_year, get_activity_factors_information, get_activity_rates };