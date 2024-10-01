import type { ColumnType } from "kysely";

export type Decimal = ColumnType<string, number | string, number | string>;

export type Generated<T> = T extends ColumnType<infer S, infer I, infer U>
  ? ColumnType<S, I | undefined, U>
  : ColumnType<T, T | undefined, T>;

export interface AcademicSession {
  academic_session_id: number;
  program_id: number;
  semester: number;
  session: string;
}

export interface Accomplishment {
  acomplishment_field: string;
  acomplishment_organization: string;
  acomplishment_title: string;
  acomplishment_year: string;
  teacher_id: number;
}

export interface Address {
  address_id: Generated<number>;
  address_type: "Permanent" | "Present";
  country: Generated<string>;
  district: Generated<string>;
  division: Generated<string>;
  post_office: Generated<string>;
  postal_code: number | null;
  thana: Generated<string>;
  union_name: Generated<string>;
  upazila: Generated<string>;
  village: Generated<string>;
}

export interface AdministrativeExperinece {
  administrative_experinece_description: string;
  administrative_experinece_institution: string;
  administrative_experinece_title: string;
  administrative_experinece_year: string;
  teacher_id: number;
}

export interface AssignCourse {
  Course_code: string;
  Department_name: string;
  Teacher_name: string;
}

export interface AssignTask {
  assign_by: string | null;
  assign_date: Generated<Date | null>;
  assign_to: string | null;
  due_date: Date | null;
  task_attachment: string | null;
  task_description: string | null;
  task_id: Generated<number>;
  task_status: number | null;
  task_title: string | null;
}

export interface AuthSession {
  created_at: Generated<Date>;
  session_id: Generated<string>;
  user_id: string;
}

export interface Award {
  award_country: string;
  award_institution: string;
  award_title: string;
  award_year: string;
  teacher_id: number;
}

export interface BillSectors {
  bill_sector_id: number;
  bill_sector_name: string;
}

export interface CatmMark {
  attendance_mark: number;
  course_id: number;
  ct_mark: number;
  exam_id: number;
  student_id: number;
}

export interface CertificateFormHistory {
  academic_session: string | null;
  cf_form_id: number | null;
  cf_history_id: Generated<number>;
  degree: string | null;
  department_name: string | null;
  district: string | null;
  father_name_bn: string | null;
  father_name_eng: string | null;
  fifth_year_exam_actual_year: string | null;
  fifth_year_exam_cgpa: number | null;
  fifth_year_exam_name: string | null;
  fifth_year_exam_time: string | null;
  fir_year_exam_actual_year: string | null;
  fir_year_exam_cgpa: number | null;
  fir_year_exam_name: string | null;
  fir_year_exam_time: string | null;
  fourth_year_exam_actual_year: string | null;
  fourth_year_exam_cgpa: number | null;
  fourth_year_exam_name: string | null;
  fourth_year_exam_time: string | null;
  hall_name: string | null;
  mobile_phone: string | null;
  mother_name_bn: string | null;
  mother_name_eng: string | null;
  post_office: string | null;
  present_address: string | null;
  profile_image: Buffer | null;
  sec_year_exam_actual_year: string | null;
  sec_year_exam_cgpa: number | null;
  sec_year_exam_name: string | null;
  sec_year_exam_time: string | null;
  student_id: number | null;
  student_name_bn: string | null;
  student_name_eng: string | null;
  thana: string | null;
  third_year_exam_actual_year: string | null;
  third_year_exam_cgpa: number | null;
  third_year_exam_name: string | null;
  third_year_exam_time: string | null;
  village: string | null;
}

export interface CertificateFormVerification {
  authority_id: string | null;
  comment: string | null;
  form_id: number | null;
  status: string | null;
  verification_date: Date | null;
  verification_id: Generated<number>;
}

export interface CertificateWithdrawalAttachments {
  attachment: string | null;
  attachment_id: Generated<number>;
  attachment_name: string | null;
  form_id: number | null;
}

export interface CertificateWithdrawalForm {
  degree: string | null;
  form_id: Generated<number>;
  form_submission_date: Date | null;
  form_type: string | null;
  money: number | null;
  payorder_id: string | null;
  student_id: number | null;
}

export interface Course {
  course_code: string;
  course_id: Generated<number>;
  course_title: string;
  course_type: "Lab" | "Project" | "Theory" | "Thesis" | "Viva";
  credit: number;
  department_id: number;
  exam_minutes: number;
}

export interface CoursesInSemester {
  academic_session_id: number;
  catm_submit_date: Date | null;
  course_id: number;
  is_catm_submitted: Generated<number>;
  is_decoded: Generated<number>;
  result_status: Generated<"Completed" | "Pending" | "Unassigned">;
  result_submit_date: Date | null;
  set_A_submitted: Generated<number>;
  set_B_submitted: Generated<number>;
}

export interface CourseTeacher {
  academic_session_id: number;
  course_id: number;
  teacher_id: number;
}

export interface CreateClass {
  academic_session_id: number | null;
  class_endTime: string | null;
  class_startDate: Date;
  class_startTime: string;
  course_id: number | null;
  duration: number;
  secret_code: string | null;
  session_id: Generated<number>;
  teacher_id: number | null;
}

export interface Department {
  department_abbr: string;
  department_id: Generated<number>;
  department_name: string;
  department_name_bn: string | null;
  faculty: string;
  grad_semester_no: number;
  undergrad_semester_no: number;
  university_id: number;
}

export interface Education {
  education_country: string;
  education_from_year: string;
  education_institution: string;
  education_title: string;
  education_to_year: string;
  user_id: string;
}

export interface EManagerAttachment {
  attachment_id: string;
  attachment_name: string;
  attachment_size: number | null;
  attachment_type: string;
  attachment_url: string;
  review_id: string;
}

export interface EManagerFile {
  file_id: string;
  file_name: string;
  file_size: number | null;
  file_type: string;
  file_url: string;
  submission_id: string;
}

export interface EManagerReview {
  review_date: Date;
  review_id: string;
  reviewer_id: number;
  submission_id: string;
}

export interface EManagerReviewerAssigned {
  assigned_date: Date;
  reviewer_id: number;
  submission_id: string;
}

export interface EManagerSubmission {
  author_id: number;
  initial_submission_id: string | null;
  keywords: string;
  paper_title: string;
  status: "Accepted" | "Assigned" | "Pending" | "Rejected" | "Reviewed" | "Submitted";
  status_date: Date;
  submission_date: Date;
  submission_id: string;
}

export interface EManagerSubmissionStatusHistory {
  status: "Accepted" | "Assigned" | "Pending" | "Rejected" | "Reviewed" | "Submitted";
  status_date: Date;
  submission_id: string;
}

export interface EvaluatesActivity {
  academic_session_id: number;
  activity_id: Generated<number>;
  bill_sector_id: number;
  course_id: number | null;
  department_id: number;
  exam_activity_type_id: number;
  exam_id: number;
  last_modified: Generated<Date>;
  teacher_id: number;
}

export interface Exam {
  academic_session_id: number;
  committee_created: Generated<number>;
  department_id: number;
  exam_centre: string;
  exam_end_date: Date | null;
  exam_id: Generated<number>;
  exam_name: string;
  exam_session: string;
  exam_start_date: Date | null;
  is_result_completed: Generated<number>;
  is_result_submitted: Generated<number>;
  result_submit_date: Date | null;
}

export interface ExamActivity {
  bill_sector_id: number;
  exam_activity_type_id: number;
  exam_bill: number;
  factor: string;
  min_exam_bill: number;
  quantity_final: number;
  quantity_initial: number;
  rule_id: Generated<number>;
  valid_from: Date;
}

export interface ExamActivityFactors {
  activity_id: number;
  factor: string;
  id: Generated<number>;
  quantity: number | null;
}

export interface ExamActivityType {
  exam_activity_name: string;
  exam_activity_type_id: Generated<number>;
  exam_category: string;
}

export interface ExamBill {
  academic_semester_id: number;
  department_id: number;
  exam_bill_id: number;
  exam_bill_payment: number;
  exam_bill_position: number;
  exam_session: string;
  teacher_id: number;
}

export interface ExamCalculationMetadata {
  activity_id: number;
  calculation_amount: number | null;
  calculation_status: "Failed" | "Success" | null;
  id: Generated<number>;
  last_calculated: Generated<Date>;
}

export interface ExamCommittee {
  exam_id: number;
  formation_date: Generated<Date>;
  role: "Chairman" | "Member" | "Tabulator";
  teacher_id: number;
}

export interface Examiner {
  assigned_date: Generated<Date>;
  course_id: number;
  exam_id: number;
  is_submitted: Generated<number>;
  set: "A" | "B";
  submit_date: Date | null;
  teacher_id: number;
}

export interface Form {
  clearance_level: Generated<number | null>;
  current_address_id: number | null;
  description_of_other_programs: Generated<string | null>;
  exam_id: number;
  form_id: Generated<number>;
  form_submission_time: Date | null;
  permanent_address_id: number | null;
  previous_charges: Generated<string | null>;
  student_id: number | null;
  student_status: Generated<"Improvement" | "Irregular" | "Regular">;
}

export interface FormCourses {
  course_id: number;
  form_id: number;
}

export interface FormEvaluation {
  end_time: Date | null;
  evaluation_id: Generated<number>;
  evaluator_id: string | null;
  form_id: number | null;
  start_time: Generated<Date>;
}

export interface GradeSystem {
  grade_points: Decimal;
  letter_grade: string;
  percentage_max: Decimal;
  percentage_min: Decimal;
}

export interface Hall {
  hall_id: number;
  hall_name: string | null;
}

export interface Image {
  image_id: Generated<number>;
  image_path: Buffer | null;
  image_type: string | null;
}

export interface Journal {
  journal_title: string;
  journal_type: string;
  journal_year: string;
  teacher_id: number;
}

export interface Marksheet {
  catm: Generated<number>;
  course_id: number;
  exam_id: number;
  fem: Generated<number>;
  gpa: Generated<number | null>;
  student_id: number;
}

export interface Meeting {
  department_id: number | null;
  meeting_agenda_id: number | null;
  meeting_id: number;
  meeting_room_id: number | null;
  meeting_time: Date | null;
  meeting_type_id: number | null;
  pdf_url: string | null;
  signature_url: string | null;
}

export interface MeetingAgenda {
  decision: string | null;
  description: string | null;
  meeting_agenda_id: Generated<number>;
  meeting_id: number | null;
  topic: string | null;
}

export interface MeetingAttend {
  meeting_id: number | null;
  user_id: string | null;
}

export interface MeetingRoom {
  meeting_room_id: Generated<number>;
  room_name: string | null;
}

export interface MeetingType {
  meeting_type: string | null;
  meeting_type_id: Generated<number>;
}

export interface NoticeBoard {
  notice_attachment: string | null;
  notice_created_by: string | null;
  notice_description: string | null;
  notice_id: Generated<number>;
  notice_title: string | null;
  notice_type: string | null;
  notice_uploaded_time: Generated<Date | null>;
}

export interface OtherLeaveApplication {
  applicant_id: string;
  applied_date: Date | null;
  attachments: string | null;
  designation: string | null;
  duration: string;
  final_application: string | null;
  leave_ground: string | null;
  leave_id: Generated<number>;
  leave_start_date: Date | null;
  my_application_chairman: string | null;
  nature_of_leave: string;
  salary_acknowledgement: number | null;
  signature: string | null;
  station_leaving_permission: string | null;
}

export interface OtherLeaveEvaluation {
  applicant_id: string;
  evaluation_type: string;
  le_comment: string | null;
  le_evaluation_time: Date;
  le_status: string;
  leave_id: number;
}

export interface ProfessionalExperinece {
  professional_experience_country: string;
  professional_experience_description: string;
  professional_experience_institution: string;
  professional_experience_title: string;
  professional_experience_year: string;
  teacher_id: number;
}

export interface Program {
  program_abbr: string;
  program_id: Generated<number>;
  program_name: string;
}

export interface Publication {
  publication_description: string;
  publication_field: string;
  publication_title: string;
  publication_year: string;
  teacher_id: number;
}

export interface QrCode {
  academic_session_id: number | null;
  academic_session_semester: string | null;
  course_id: number | null;
  date: Date | null;
  end_time: Date | null;
  qr_code: string | null;
  qr_id: number;
  start_time: Date | null;
  teacher_id: number | null;
  user_id: string | null;
}

export interface QuestionMark {
  course_id: number;
  exam_id: number;
  paper_code: number;
  q_mark: number;
  q_no: string;
  set: "A" | "B";
}

export interface Roles {
  end_date: Date | null;
  factor: string | null;
  role: string;
  start_date: Date;
  university_id: number;
  user_id: string;
}

export interface ScholarshipAndFellowship {
  scholarship_country: string;
  scholarship_degree: string;
  scholarship_from_year: string;
  scholarship_institution: string;
  scholarship_title: string;
  scholarship_to_year: string;
  teacher_id: number;
}

export interface SemesterResult {
  academic_session_id: number;
  cgpa: number;
  student_id: number;
}

export interface SoSMessage {
  attachment: string | null;
  content: string | null;
  message_id: Generated<number>;
  mobile: string;
  timestamp: Generated<Date | null>;
}

export interface SoSNotice {
  content: string | null;
  id: Generated<number>;
  timestamp: Generated<Date | null>;
  title: string;
}

export interface SoSRoom {
  description: string | null;
  max_participants: Generated<number | null>;
  room_code: string;
  timestamp: Generated<Date | null>;
  title: string | null;
}

export interface SoSRoomParticipant {
  membership_status: Generated<"admin" | "member" | "pending" | null>;
  mobile: string;
  room_code: string;
  timestamp: Generated<Date | null>;
}

export interface SoSUser {
  mobile: string;
  password: string;
  user_name: string | null;
}

export interface Student {
  academic_session_id: number | null;
  department_id: number;
  fathers_name: string | null;
  fathers_name_bn: string | null;
  guardian_address_id: number | null;
  guardian_name: string | null;
  guardian_name_bn: string | null;
  guardian_relation: string | null;
  hall_id: number;
  mothers_name: string | null;
  mothers_name_bn: string | null;
  program_id: number | null;
  student_id: Generated<number>;
  user_id: string;
}

export interface StudentAnnouncement {
  academic_session_id: number | null;
  announcement: string | null;
  announcement_id: Generated<number>;
  date: Generated<Date | null>;
  student_id: number | null;
}

export interface StudentAnnouncementFile {
  announcement_file_id: string;
  announcement_id: number;
}

export interface StudentAttendance {
  course_id: number | null;
  qr_id: number;
  sa_time: Date | null;
  student_id: number;
}

export interface StudentProgram {
  student_program_end_date: Date | null;
  student_program_id: number;
  student_program_start_date: Date | null;
  student_program_type: "Bachelor of Science" | "Master of Science" | null;
}

export interface StudyLeaveApplication {
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

export interface StudyLeaveEvaluation {
  applicant_id: string;
  evaluation_type: string;
  le_comment: string | null;
  le_evaluation_time: Date;
  le_status: string;
  leave_id: number;
}

export interface Teacher {
  area_of_interest: string | null;
  department_id: number;
  designation: string;
  designation_bn: string | null;
  teacher_id: number;
  title: string;
  title_bn: string | null;
  user_id: string;
}

export interface TotalPaperMark {
  course_id: number;
  exam_id: number;
  paper_code: number;
  set: "A" | "B";
  student_id: number | null;
  total_mark: Generated<number>;
}

export interface TrainingAndCertification {
  teacher_id: number;
  training_duration: string;
  training_field: string;
  training_title: string;
  training_year: string;
}

export interface University {
  university_abbr: string;
  university_id: Generated<number>;
  university_name: string;
}

export interface User {
  blood_group: string | null;
  dob: Date;
  email: string;
  ethnicity: string | null;
  first_name: string;
  first_name_bn: string | null;
  gender: string | null;
  last_name: string;
  last_name_bn: string | null;
  nationality: string | null;
  password: string;
  permanent_address_id: number;
  phone: string | null;
  present_address_id: number;
  profile_image_id: number | null;
  religion: string | null;
  sign_id: number | null;
  user_id: Generated<string>;
}

export interface DB {
  Academic_Session: AcademicSession;
  Accomplishment: Accomplishment;
  Address: Address;
  Administrative_experinece: AdministrativeExperinece;
  Assign_course: AssignCourse;
  Assign_Task: AssignTask;
  Auth_Session: AuthSession;
  Award: Award;
  Bill_Sectors: BillSectors;
  Catm_Mark: CatmMark;
  Certificate_Form_History: CertificateFormHistory;
  Certificate_Form_Verification: CertificateFormVerification;
  Certificate_Withdrawal_Attachments: CertificateWithdrawalAttachments;
  Certificate_Withdrawal_Form: CertificateWithdrawalForm;
  Course: Course;
  Course_Teacher: CourseTeacher;
  Courses_in_Semester: CoursesInSemester;
  Create_Class: CreateClass;
  Department: Department;
  Education: Education;
  EManager_Attachment: EManagerAttachment;
  EManager_File: EManagerFile;
  EManager_Review: EManagerReview;
  EManager_Reviewer_Assigned: EManagerReviewerAssigned;
  EManager_Submission: EManagerSubmission;
  EManager_Submission_Status_History: EManagerSubmissionStatusHistory;
  Evaluates_Activity: EvaluatesActivity;
  Exam: Exam;
  Exam_Activity: ExamActivity;
  Exam_Activity_Factors: ExamActivityFactors;
  Exam_Activity_Type: ExamActivityType;
  Exam_Bill: ExamBill;
  Exam_Calculation_Metadata: ExamCalculationMetadata;
  Exam_Committee: ExamCommittee;
  Examiner: Examiner;
  Form: Form;
  Form_Courses: FormCourses;
  Form_Evaluation: FormEvaluation;
  grade_system: GradeSystem;
  Hall: Hall;
  Image: Image;
  Journal: Journal;
  Marksheet: Marksheet;
  Meeting: Meeting;
  Meeting_Agenda: MeetingAgenda;
  Meeting_Attend: MeetingAttend;
  Meeting_Room: MeetingRoom;
  Meeting_Type: MeetingType;
  Notice_Board: NoticeBoard;
  Other_Leave_Application: OtherLeaveApplication;
  Other_Leave_Evaluation: OtherLeaveEvaluation;
  Professional_experinece: ProfessionalExperinece;
  Program: Program;
  Publication: Publication;
  Qr_Code: QrCode;
  Question_Mark: QuestionMark;
  Roles: Roles;
  Scholarship_and_fellowship: ScholarshipAndFellowship;
  Semester_Result: SemesterResult;
  SoS_Message: SoSMessage;
  SoS_Notice: SoSNotice;
  SoS_Room: SoSRoom;
  SoS_Room_Participant: SoSRoomParticipant;
  SoS_User: SoSUser;
  Student: Student;
  Student_Announcement: StudentAnnouncement;
  Student_Announcement_File: StudentAnnouncementFile;
  Student_Attendance: StudentAttendance;
  Student_Program: StudentProgram;
  Study_Leave_Application: StudyLeaveApplication;
  Study_Leave_Evaluation: StudyLeaveEvaluation;
  Teacher: Teacher;
  Total_Paper_Mark: TotalPaperMark;
  Training_and_certification: TrainingAndCertification;
  University: University;
  User: User;
}
