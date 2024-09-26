import { Generated, Insertable, Selectable, Updateable } from "kysely";

export interface StudentProgramTable {
    student_program_end_date: Date | null;
    student_program_id: number;
    student_program_start_date: Date | null;
    student_program_type: "Bachelor of Science" | "Master of Science" | null;
}


export type StudentProgramSelect = Selectable<StudentProgramTable>;


export interface StudentAnnouncementTable {
    academic_session_id: number;
    announcement: string;
    announcement_id: Generated<number>;
    date: Generated<Date | null>;
    student_id: number | null;
}

export type StudentAnnouncementSelect = Selectable<StudentAnnouncementTable>;
export type StudentAnnouncementInsert = Insertable<StudentAnnouncementTable>;
export type StudentAnnouncementUpdate = Updateable<StudentAnnouncementTable>;



export interface CourseTeacherTable {
    academic_session_id: number;
    course_id: number;
    teacher_id: number;
}

export type CourseTeacherSelect = Selectable<CourseTeacherTable>;


// export interface CatmMarkTable {
//     attendance_mark: number;
//     course_id: number;
//     ct_mark: number;
//     exam_id: number;
//     student_id: number;
// }

// export type CatmMarkSelect = Selectable<CatmMarkTable>; 

export interface StudentAnnouncementFileTable {
    announcement_file_id: string;
    announcement_id: number;
}