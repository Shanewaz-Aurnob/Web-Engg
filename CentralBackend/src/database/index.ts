import * as Schema from "./Schema";
import * as CoreTables from "../types/CoreTables";
import * as LeaveTables from "../types/LeaveTables";
import * as StaffTables from "../types/StaffIMSTables";
import * as EManagerTables from "../types/EditorialManagerTables";
import * as TeacherTables from "../types/TeacherTables";
import * as ResultProcessingTables from "../types/ResultProcessingTables";
import * as ExamRemunerationTables from "../types/ExamRemunerationTables";

import * as CertificateWithdrawalTables from "../types/CertificateWithdrawalTables";
import * as AttendanceSystemTables from "../types/AttendanceSystemTables";

import * as MeetingManagementTables from "../types/MeetingManagementTable";
import * as StudentInformationTables from "../types/StudentInformatationTables";

import { createPool } from "mysql2"; // do not use 'mysql2/promises'!
import { Kysely, MysqlDialect } from "kysely";
import { AdminCreds } from "./Credentials";

export interface Database {
  //core tables
  Address: CoreTables.AddressTable;
  Department: CoreTables.DepartmentTable;
  Roles: CoreTables.RolesTable;
  Student: CoreTables.StudentTable;
  Teacher: CoreTables.TeacherTable;
  User: CoreTables.UserTable;
  Auth_Session: CoreTables.AuthSessionTable;
  Hall: CoreTables.HallTable;
  University: CoreTables.UniversityTable;
  Course: CoreTables.CourseTable;
  Courses_in_Semester: CoreTables.CoursesInSemesterTable;
  Exam: CoreTables.ExamTable;
  Academic_Session: CoreTables.AcademicSession;
  Program: CoreTables.Program;
  //others
  Image: Schema.ImageTable;
  Form: Schema.FormTable;
  Form_Courses: CoreTables.FormCoursesTable;
  Form_Evaluation: Schema.FormEvaluationTable;

  //Exam Remuneration Tables
  Bill_Sectors: ExamRemunerationTables.BillSectors;
  Exam_Activity: ExamRemunerationTables.ExamActivityTable;
  Exam_Activity_Type: ExamRemunerationTables.ExamActivityTypeTable;
  Exam_Activity_Factors: ExamRemunerationTables.ExamActivityFactorsTable;
  Evaluates_Activity: ExamRemunerationTables.EvaluatesActivityTable;
  Exam_Bill: ExamRemunerationTables.ExamBillTable;
  Exam_Calculation_Metadata: ExamRemunerationTables.ExamCalculationMetadataTable;

  //Leave Tables
  Study_Leave_Application: LeaveTables.StudyLeaveApplicationTable;
  Other_Leave_Application: LeaveTables.OtherLeaveApplicationTable;
  Study_Leave_Evaluation: LeaveTables.StudyLeaveEvaluationTable;
  Other_Leave_Evaluation: LeaveTables.OtherLeaveEvaluationTable;

  // Editorial Manager Tables
  EManager_Attachment: EManagerTables.EManagerAttachment;
  EManager_File: EManagerTables.EManagerFile;
  EManager_Review: EManagerTables.EManagerReview;
  EManager_Reviewer_Assigned: EManagerTables.EManagerReviewerAssigned;
  EManager_Submission: EManagerTables.EManagerSubmission;
  EManager_Submission_Status_History: EManagerTables.EManagerSubmissionStatusHistory;

  //Result processing tables
  Examiner: ResultProcessingTables.ExaminerTable;
  Exam_Committee: Schema.ExamCommitteeTable;
  Semester_Result: ResultProcessingTables.SemesterResultTable;
  Catm_Mark: ResultProcessingTables.CatmMarkTable;
  Total_Paper_Mark: ResultProcessingTables.TotalPaperMarkTable;
  Question_Mark: ResultProcessingTables.QuestionMarkTable;
  Marksheet: ResultProcessingTables.Marksheet;

  //certificate withdrawal tables

  Certificate_Form_History: CertificateWithdrawalTables.CertificateFormHistory;
  Certificate_Withdrawal_Attachments: CertificateWithdrawalTables.CertificateWithdrawalAttachments;
  Certificate_Form_Verification: CertificateWithdrawalTables.CertificateFormVerification;
  Certificate_Withdrawal_Form: CertificateWithdrawalTables.CertificateWithdrawalForm;

  //Teacher tables
  Education: TeacherTables.EducationTable;
  Professional_experinece: TeacherTables.ProfessionalExperineceTable;
  Administrative_experinece: TeacherTables.AdministrativeExperineceTable;
  Scholarship_and_fellowship: TeacherTables.ScholarshipAndFellowshipTable;
  Accomplishment: TeacherTables.AccomplishmentTable;
  Training_and_certification: TeacherTables.TrainingAndCertificationTable;
  Journal: TeacherTables.JournalTable;
  Publication: TeacherTables.PublicationTable;
  Award: TeacherTables.AwardTable;

  //StaffIMS Related Tables
  Notice_Board: StaffTables.NoticeBoardTable;
  Assign_Task: StaffTables.AssignTaskTable;

  //Student Information Tables
  Student_Program: StudentInformationTables.StudentProgramTable;
  Student_Announcement: StudentInformationTables.StudentAnnouncementTable;
  Course_Teacher: StudentInformationTables.CourseTeacherTable;

  //meeting tables
  Meeting: MeetingManagementTables.MeetingTable;
  Meeting_Agenda: MeetingManagementTables.MeetingAgendaTable;
  Meeting_Attend: MeetingManagementTables.MeetingAttendTable;
  Meeting_Room: MeetingManagementTables.MeetingRoomTable;
  Meeting_Type: MeetingManagementTables.MeetingTypeTable;

  // CU | SoS
  SoS_User: CoreTables.SoS_UserTable;
  SoS_Message: CoreTables.SoS_MessageTable;

  //Attendance System
  Create_Class: AttendanceSystemTables.CreateClass;
}

export type TableName =
  | "Address"
  | "Department"
  | "Image"
  | "Roles"
  | "Student"
  | "Teacher"
  | "User"
  | "Exam"
  | "EManager_Attachment"
  | "EManager_File"
  | "EManager_Review"
  | "EManager_Reviewer_Assigned"
  | "EManager_Submission"
  | "EManager_Submission_Status_History"
  | "Course"
  | "Exam_Committee"
  | "Bill_Sectors"
  | "Exam_Activity"
  | "Exam_Activity_Type"
  | "Exam_Activity_Factors"
  | "Evaluates_Activity"
  | "Exam_Bill"
  | "Exam_Calculation_Metadata"
  | "Courses_in_Semester"
  | "Auth_Session"
  | "Hall"
  | "University"
  | "Exam_Committee"
  | "Form"
  | "Form_Evaluation"
  | "Form_Courses"
  | "Academic_Session"
  | "Study_Leave_Application"
  | "Study_Leave_Evaluation"
  | "Other_Leave_Application"
  | "Other_Leave_Evaluation"
  | "Examiner"
  | "Semester_Result"
  | "Education"
  | "Professional_experinece"
  | "Administrative_experinece"
  | "Scholarship_and_fellowship"
  | "Accomplishment"
  | "Training_and_certification"
  | "Journal"
  | "Publication"
  | "Award"
  | "Certificate_Form_History"
  | "Certificate_Withdrawal_Attachments"
  | "Certificate_Form_Verification"
  | "Certificate_Withdrawal_Form"
  | "Meeting"
  | "Meeting_Agenda"
  | "Meeting_Attend"
  | "Meeting_Room"
  | "Meeting_Type"
  | "Notice_Board"
  | "Assign_Task"
  | "Question_Mark"
  | "Total_Paper_Mark"
  | "Program"
  | "Student_Program"
  | "Student_Announcement"
  | "Course_Teacher"
  | "Catm_Mark"
  | "SoS_User"
  | "SoS_Message"
  "Create_Class"
  ;

const dialect = new MysqlDialect({
  pool: async () => createPool(AdminCreds),
});

const db = new Kysely<Database>({
  dialect,
});

export default db;
