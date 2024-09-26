import "./loadEnvironment";
import express, { Request, Response } from "express";
import path from "path";
import cookieParser from "cookie-parser";
import cors from "cors";

const app = express();
const port = process.env.PORT || 5000;
const htmlPath = path.join(__dirname, "../public");

app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(cookieParser(process.env.SECRET_KEY));
app.use(cors());

// Doc routes
app.use(express.static("public"));

// Auth routes [x]
import loginRouter from "./routes/auth/login";
import logoutRouter from "./routes/auth/logout";
// import signupRouter from "./routes/auth/signup";

app.use("/api/login", loginRouter);
app.use("/api/logout", logoutRouter);
// app.use("/api/signup", signupRouter);

// Public routes [x]
import addressRouter from "./routes/address";
import departmentRouter from "./routes/department";
import hallRouter from "./routes/hall";
import universityRouter from "./routes/university";
import teacherRouter from "./routes/teacher";
import courseRouter from "./routes/course";
import academicSessionRouter from "./routes/academic-session";

import staffRouter from "./routes/staffIMS/staff";
import SIMS_noticeRouter from "./routes/staffIMS/notice";
import taskRouter from "./routes/staffIMS/assignTask";

import myInfo from "./routes/certificate-withdrawal/myInfo";

app.use("/api/myInfo", myInfo);
app.use("/api/department", departmentRouter);
app.use("/api/address", addressRouter);
app.use("/api/hall", hallRouter);
app.use("/api/university", universityRouter);
app.use("/api/teacher", teacherRouter);
app.use("/api/course", courseRouter);
app.use("/api/academic-session", academicSessionRouter);

//staffIMS router
app.use("/api/staff", staffRouter);
app.use("/api/sims/notice", SIMS_noticeRouter);
app.use("/api/task", taskRouter);

// Routes that require authentication/authorization [x]
import studentRouter from "./routes/student";
import examRouter from "./routes/exam";
import uploadRouter from "./routes/upload";
import userRouter from "./routes/user";
import noticeRouter from "./routes/notice";

app.use("/api/student", studentRouter);
app.use("/api/exam", examRouter);
app.use("/api/upload", uploadRouter);
app.use("/api/user", userRouter);
app.use("/api/notice", noticeRouter);

// Course-Semester Router [x]
import courseSemesterRouter from "./routes/courses-semester";
import formRouter from "./routes/form";
app.use("/api/course-semester", courseSemesterRouter);
app.use("/api/form", formRouter);

//Leave Application Router [x]
import studyLeaveApplicationRouter from "./routes/study_leave_application";
import otherLeaveApplicationRouter from "./routes/other_leave_application";
import studyLeaveEvaluationRouter from "./routes/study_leave_evaluation";
import otherLeaveEvaluationRouter from "./routes/other_leave_evaluation";
import commonLeaveUtilitiesRouter from "./routes/common_leave_utilities";
app.use("/api/leave/study", studyLeaveApplicationRouter);
app.use("/api/leave/other", otherLeaveApplicationRouter);
app.use("/api/leave/evaluates/study", studyLeaveEvaluationRouter);
app.use("/api/leave/evaluates/other", otherLeaveEvaluationRouter);
app.use("/api/leave/common", commonLeaveUtilitiesRouter);

//certificate
import certificateWithdrawalStudent from "./routes/certificate-withdrawal/certificate-withdrawal-student";
import certificateWithdrawalOtherStakeholders from "./routes/certificate-withdrawal/certificate-withdrawal-otherStakeholders";
import certificateWithdrawalCommon from "./routes/certificate-withdrawal/certificate-withdrawal-common";

app.use("/api/certificate-withdrawal", certificateWithdrawalStudent);
app.use(
  "/api/certificate-withdrawal-otherStakeholders",
  certificateWithdrawalOtherStakeholders,
);
app.use("/api/certificate-withdrawal-common", certificateWithdrawalCommon);

import submissionRouter from "./routes/editorial-manager/submission";
import emanagerFileRouter from "./routes/editorial-manager/file";
import reviewerRouter from "./routes/editorial-manager/reviewer";
import countRouter from "./routes/editorial-manager/count";
import emanagerAttachmentRouter from "./routes/editorial-manager/attachment";
import roleRouter from "./routes/editorial-manager/role";

// Editorial Manager
app.use("/api/editorial-manager/submission", submissionRouter);
app.use("/api/editorial-manager/file", emanagerFileRouter);
app.use("/api/editorial-manager/reviewer", reviewerRouter);
app.use("/api/editorial-manager/count", countRouter);
app.use("/api/editorial-manager/attachment", emanagerAttachmentRouter);
app.use("/api/editorial-manager/role", roleRouter);

//Result Proccessing Routes
import examCommitteeRouter from "./routes/result-processing/exam-committee";
import examinerRouter from "./routes/result-processing/examiner";
import semesterResultRouter from "./routes/result-processing/semester-result";
import questionMarkRouter from "./routes/result-processing/question-mark";
import totalPaperMarkRouter from "./routes/result-processing/total-papermark";
import catmMarkRouter from "./routes/result-processing/catm-mark";
import marksheetRouter from "./routes/result-processing/marksheet";

app.use("/api/exam-committee", examCommitteeRouter);
app.use("/api/examiner", examinerRouter);
app.use("/api/semester-result", semesterResultRouter);
app.use("/api/question-mark", questionMarkRouter);
app.use("/api/total-papermark", totalPaperMarkRouter);
app.use("/api/catm-mark", catmMarkRouter);
app.use("/api/marksheet", marksheetRouter);

//meeting management routes
import meetingRouter from "./routes/meeting-management/meetingRouter";
app.use("/api/meeting", meetingRouter);

// Student Information Routes
import studentHistoryRouter from "./routes/student-info/studentHistory";
import studentAnnouncementSubmissionRouter from "./routes/student-info/studentAnnoucement";
import studentCourseSemsterRouter from "./routes/student-info/studentCourseInfo";
import studentCATMMarksRouter from "./routes/student-info/studentCATMMarks";
import studentResultRouter from "./routes/student-info/studentResult";
import studentInfoRouter from "./routes/student-info/baseStudentInfo";

app.use("/api/student-info/base-info", studentInfoRouter);
app.use("/api/student-info/history", studentHistoryRouter);
app.use("/api/student-info/announcement", studentAnnouncementSubmissionRouter);
app.use("/api/student-info/course-semster", studentCourseSemsterRouter);
app.use("/api/student-info/catm-marks", studentCATMMarksRouter);
app.use("/api/student-info/result", studentResultRouter);

//Exam Remuneration Routes
import cuersRouter from "./routes/exam-remuneration/cuers";
import examActivityRouter from "./routes/exam-remuneration/exam_activity";
import examActivityFactorsRouter from "./routes/exam-remuneration/exam_activity_factors";
import evaluatesActivityRouter from "./routes/exam-remuneration/evaluates_activity";
import calculateBillRouter from "./routes/exam-remuneration/calculate_bill";
import courseTeacherRouter from "./routes/courseTeacher";

app.use("/api/cuers", cuersRouter);
app.use("/api/cuers/exam-activity", examActivityRouter);
app.use("/api/cuers/exam-activity-factors", examActivityFactorsRouter);
app.use("/api/cuers/evaluates-activity", evaluatesActivityRouter);
app.use("/api/cuers/calculate-bill", calculateBillRouter);

app.use("/api/course-teacher", courseTeacherRouter);



//Attendance System Router [x]

import attendanceSystemTeacherRouter from "./routes/attendance-system/attendance-system-teacher";

app.use("/api/attendance/teacher", attendanceSystemTeacherRouter);
// Start the server
app.listen(port, () => {
  console.log(
    `ERP API is listening to port ${port}\nURL: http://localhost:${port}`,
  );
});
