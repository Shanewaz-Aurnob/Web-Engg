import { Generated, Insertable, Selectable, Updateable } from "kysely";

export interface AuthSessionTable {
  created_at: Generated<Date>;
  session_id: Generated<string>;
  user_id: string;
}

export interface UniversityTable {
  university_abbrev: string;
  university_id: Generated<number>;
  university_name: string;
}

export interface DepartmentTable {
  department_abbr: string;
  department_id: Generated<number>;
  department_name: string;
  faculty: string;
  grad_semester_no: number;
  undergrad_semester_no: number;
  university_id: number;
}

export interface ProgramTable {
  program_abbr: string;
  program_id: Generated<number>;
  program_name: string;
}

export interface ExamCommitteeTable {
  exam_id: number;
  formation_date: Generated<Date>;
  role: "Chairman" | "Member" | "Tabulator";
  teacher_id: number;
}

export interface RolesTable {
  end_date: Date | null;
  factor: string;
  role: string;
  start_date: Date;
  user_id: string;
}

export interface HallTable {
  hall_id: number;
  hall_name: string | null;
}

export interface AcademicSessionTable {
  academic_session_id: number;
  program_id: number;
  semester: number;
  session: string;
}
export interface CourseTable {
  course_code: string;
  course_id: Generated<number>;
  course_title: string;
  course_type: "Lab" | "Project" | "Theory" | "Thesis" | "Viva" | null;
  credit: number;
  department_id: number;
  exam_minutes: number;
}

export interface CoursesInSemesterTable {
  academic_session_id: number;
  catm_submit_date: Date | null;
  course_id: number;
  is_catm_submitted: Generated<number>;
  result_status: Generated<"Completed" | "Pending" | "Unassigned">;
  result_submit_date: Date | null;
  is_decoded: Generated<number>;
  set_A_sumitted: Generated<number>;
  set_B_sumitted: Generated<number>;
}

export interface ExamTable {
  academic_session_id: number;
  department_id: number;
  exam_centre: string;
  exam_end_date: Date | null;
  exam_id: Generated<number>;
  exam_name: string;
  exam_session: string;
  exam_start_date: Date | null;
  is_result_submitted: Generated<number>;
  result_submit_date: Date | null;
  committee_created: Generated<number>;
  is_result_completed: Generated<number>;
}

export interface AddressTable {
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

export interface UserTable {
  permanent_address_id: number;
  present_address_id: number;
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
  phone: string | null;
  profile_image_id: number | null;
  religion: string | null;
  sign_id: number | null;
  user_id: Generated<string>;
}

export interface StudentTable {
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

export interface TeacherTable {
  area_of_interest: string | null;
  department_id: number | null;
  designation: string | null;
  teacher_id: number | null;
  title: string | null;
  user_id: string;
}

export interface FormCoursesTable {
  form_id: number;
  course_id: number;
}

export interface UniversityTable {
  university_abbr: string;
  university_id: Generated<number>;
  university_name: string;
}

export interface UserTable {
  address_id: number;
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
  phone: string | null;
  profile_image_id: number | null;
  religion: string | null;
  sign_id: number | null;
  user_id: Generated<string>;
}

export interface SoS_UserTable {
  mobile: string;
  password: string;
  user_name: string | null;
}

export interface SoS_MessageTable {
  mobile: string;
  message_id: Generated<number>;
  content: string;
  attachment: string | null;
  timestamp: Generated<EpochTimeStamp>;
}

export type SoS_User = Selectable<SoS_UserTable>;
export type NewSoS_User = Insertable<SoS_UserTable>;
export type SoS_UserUpdate = Updateable<SoS_UserTable>;

export type SoS_Message = Selectable<SoS_MessageTable>;
export type NewSoS_Message = Insertable<SoS_MessageTable>;
export type SoS_MessageUpdate = Updateable<SoS_MessageTable>;

export type Address = Selectable<AddressTable>;
export type NewAddress = Insertable<AddressTable>;
export type AddressUpdate = Updateable<AddressTable>;

export type Department = Selectable<DepartmentTable>;
export type NewDepartment = Insertable<DepartmentTable>;
export type DepartmentUpdate = Updateable<DepartmentTable>;

export type Student = Selectable<StudentTable>;
export type NewStudent = Insertable<StudentTable>;
export type StudentUpdate = Updateable<StudentTable>;

export type Teacher = Selectable<TeacherTable>;
export type NewTeacher = Insertable<TeacherTable>;
export type TeacherUpdate = Updateable<TeacherTable>;

export type User = Selectable<UserTable>;
export type NewUser = Insertable<UserTable>;
export type UserUpdate = Updateable<UserTable>;

export type AuthSessions = Selectable<AuthSessionTable>;
export type NewAuthSession = Insertable<AuthSessionTable>;
export type AuthSessionUpdate = Updateable<AuthSessionTable>;

export type Hall = Selectable<HallTable>;
export type NewHall = Insertable<HallTable>;
export type HallUpdate = Updateable<HallTable>;

export type Course = Selectable<CourseTable>;
export type newCourse = Insertable<CourseTable>;
export type CourseUpdate = Updateable<CourseTable>;

export type CoursesInSemester = Selectable<CoursesInSemesterTable>;
export type newCourseInSemester = Insertable<CoursesInSemesterTable>;
export type CoursesInSemesterUpdate = Updateable<CoursesInSemesterTable>;

export type Exam = Selectable<ExamTable>;
export type newExam = Insertable<ExamTable>;
export type ExamUpdate = Updateable<ExamTable>;

export type ExamCommittee = Selectable<ExamCommitteeTable>;
export type newExamCommittee = Insertable<ExamCommitteeTable>;
export type ExamCommitteeUpdate = Updateable<ExamCommitteeTable>;

export type Roles = Selectable<RolesTable>;
export type NewRoles = Insertable<RolesTable>;
export type RolesUpdate = Updateable<RolesTable>;

export type AcademicSession = Selectable<AcademicSessionTable>;
export type NewAcademicSession = Insertable<AcademicSessionTable>;
export type AcademicSessionUpdate = Updateable<AcademicSessionTable>;

export type FormCourse = Selectable<FormCoursesTable>;
export type NewFormCourse = Insertable<FormCoursesTable>;
export type FormCourseUpdate = Updateable<FormCoursesTable>;

export type Program = Selectable<ProgramTable>;
export type NewProgram = Insertable<ProgramTable>;
export type ProgramUpdate = Updateable<ProgramTable>;
