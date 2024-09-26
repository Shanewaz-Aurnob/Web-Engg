import { Request } from "express";
import { SelectQueryBuilder } from "kysely";
import { Database, TableName } from "../database";
import { addAcademicSessionFilters } from "./filterHelpers/addAcademicSessionFilters";
import { addAddressFilters } from "./filterHelpers/addAddressFilters";
import { addCourseFilters } from "./filterHelpers/addCourseFilters";
import { addDepartmentFilters } from "./filterHelpers/addDepartmentFilters";
import { addExamCommitteeFilter } from "./filterHelpers/addExamCommitteeFilters";
import { addExamFilters } from "./filterHelpers/addExamFilter";
import { addExamActivityFilters } from "./filterHelpers/addExamActivityFilters";
import { addEvaluatesActivityFilters } from "./filterHelpers/addEvaluatesActivityFilters";
import { addExaminerFilters } from "./filterHelpers/addExaminerFilters";
import { addFormEvaluationFilters } from "./filterHelpers/addFormEvaluationFilter";
import { addFormFilters } from "./filterHelpers/addFormFilters";
import { addOtherLeaveApplicationFilter } from "./filterHelpers/addOtherLeaveApplicationFilter";
import { addOtherLeaveEvaluationFilter } from "./filterHelpers/addOtherLeaveEvaluationFilter";
import { addStudentFilter } from "./filterHelpers/addStudentFilters";
import { addStudyLeaveApplicationFilter } from "./filterHelpers/addStudyLeaveApplicationFilter";
import { addStudyLeaveEvaluationFilter } from "./filterHelpers/addStudyLeaveEvaluationFilter";
import { addTeacherFilters } from "./filterHelpers/addTeacherFilters";
import { addUniversityFilters } from "./filterHelpers/addUniversityFilter";
import { addUserFilters } from "./filterHelpers/addUserFilters";
import { addQuestionMarkFilters } from "./filterHelpers/addQuestionMarkFilters";
import { addTotalPaperMarkFilters } from "./filterHelpers/addTotalPaperMarkFilters";
import { addExamActivityFactorsFilters } from "./filterHelpers/addExamActivityFactorsFilters";

export function addFiltration(
  table: TableName,
  query: SelectQueryBuilder<Database, TableName, any>,
  req: Request,
) {
  // const addrFilter: AddressFilter | undefined =
  //   table === "Address" ? AddressFilter.fromRequest(req) : undefined;
  // const deptFilter: DepartmentFilter | undefined =
  //   table === "Department" ? DepartmentFilter.fromRequest(req) : undefined;
  // const studFilter: StudentFilter | undefined =
  //   table === "Student" ? StudentFilter.fromRequest(req) : undefined;
  // const teacherFilter: TeacherFilter | undefined =
  //   table === "Teacher" ? TeacherFilter.fromRequest(req) : undefined;
  // const userFilter: UserFilter | undefined =
  //   table === "User" ? UserFilter.fromRequest(req) : undefined;
  // const examComFilter: examCommitteeFilter | undefined =
  //   table === "Exam_Committee" ? examCommitteeFilter.fromRequest(req) : undefined;
  // const examFilter: ExamFilter | undefined =
  //   table === "Exam" ? ExamFilter.fromRequest(req) : undefined;
  // const formFilter: FormFilter | undefined = table == 'Form' ? FormFilter.fromRequest(req) : undefined;
  // const formEvaluationFilter: FormEvaluationFilter | undefined = table == 'FormEvaluation' ? FormEvaluationFilter.fromRequest(req) : undefined;
  // const courseSemesterFilter: CourseSemesterFilter | undefined =
  //   table === "Courses_in_Semester" ? CourseSemesterFilter.fromRequest(req) : undefined;

  if (table === "Address") {
    query = addAddressFilters(req, query as any);
  } else if (table === "Department") {
    query = addDepartmentFilters(req, query as any);
  } else if (table === "Student") {
    query = addStudentFilter(req, query as any);
  } else if (table === "Teacher") {
    query = addTeacherFilters(req, query as any);
  } else if (table === "User") {
    query = addUserFilters(req, query as any);
  } else if (table === "Exam") {
    query = addExamFilters(req, query as any);
  } else if (table === "Exam_Committee") {
    query = addExamCommitteeFilter(req, query as any);
  } else if (table === "Exam_Activity") {
    query = addExamActivityFilters(req, query as any);
  } else if (table === "Exam_Activity_Factors") {
    query = addExamActivityFactorsFilters(req, query as any);
  } else if (table === "Evaluates_Activity") {
    query = addEvaluatesActivityFilters(req, query as any);
  } else if (table === "Form") {
    query = addFormFilters(req, query as any);
  } else if (table === "Form_Evaluation") {
    query = addFormEvaluationFilters(req, query as any);
  } else if (table === "Course") {
    query = addCourseFilters(
      req,
      query as SelectQueryBuilder<Database, "Course", {}>,
    );
  } else if (table === "Study_Leave_Application") {
    query = addStudyLeaveApplicationFilter(req, query as any);
  } else if (table === "Other_Leave_Application") {
    query = addOtherLeaveApplicationFilter(req, query as any);
  } else if (table === "Study_Leave_Evaluation") {
    query = addStudyLeaveEvaluationFilter(req, query as any);
  } else if (table === "Other_Leave_Evaluation") {
    query = addOtherLeaveEvaluationFilter(req, query as any);
  } else if (table === "University") {
    query = addUniversityFilters(req, query as any);
  } else if (table === "Examiner") {
    query = addExaminerFilters(req, query as any);
  } else if (table === "Academic_Session") {
    query = addAcademicSessionFilters(req, query as any);
  } else if (table === "Question_Mark") {
    query = addQuestionMarkFilters(req, query as any);
  } else if (table === "Total_Paper_Mark") {
    query = addTotalPaperMarkFilters(req, query as any);
  }

  return query as any;
}
