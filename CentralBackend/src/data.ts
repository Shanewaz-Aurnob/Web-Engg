//! The data provided here is mock data.
//! Ideally, we would keep these data into the database
//! For testing purposes we're going to use this file
//! Later during development we will communicate with
//! The database and get actual data

export type user_t = {
  uid: number;
  name: string;
  role: Role;
};

/// Enum class for different roles
export enum Role {
  STUDENT = "student",
  TEACHER = "teacher",
}

/// Example users
export const users: user_t[] = [
  { uid: 1, name: "John", role: Role.STUDENT },
  { uid: 2, name: "Bill", role: Role.STUDENT },
  { uid: 3, name: "Susan", role: Role.STUDENT },
  { uid: 4, name: "Aaron", role: Role.TEACHER },
  { uid: 5, name: "Bonnie", role: Role.STUDENT },
];

export enum FormType {
  ADMISSION = "Admission Form",
  EXAM = "Exam Form",
  GRANT = "Grant Request Form",
}

export type form_t = {
  id: number;
  type: FormType;
  userId: number;
};

/// Example data a user may want to access
export const forms: form_t[] = [
  { id: 1, type: FormType.ADMISSION, userId: 1 },
  { id: 2, type: FormType.EXAM, userId: 2 },
  { id: 3, type: FormType.ADMISSION, userId: 3 },
  { id: 4, type: FormType.GRANT, userId: 4 },
  { id: 5, type: FormType.EXAM, userId: 5 },
];
