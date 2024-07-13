/* eslint-disable react/prop-types */
import  { useEffect, useState } from 'react';
import logo from '../../assets/cuLogo.png'

const AttendanceSheet = ({ courseCode, teacherName }) => {
  const [courseDetails, setCourseDetails] = useState({});
  const [sessions, setSessions] = useState([]);
  const [students, setStudents] = useState([]);

  
  return (
    <div className="p-4 flex flex-col justify-center items-center">
      <img src={logo} className="w-32 h-auto" alt="cu logo" />
      <div className="text-center my-4">
        <h1 className="font-bold text-xl">University of Chittagong</h1>
        <h2>Department of Computer Science and Engineering</h2>
        <p>Semester: {courseDetails.semester}</p>
        <p>Session: {courseDetails.session}</p>
        <p>Course Code: {courseDetails.course_code}</p>
        <p>Course Teacher: {teacherName}</p>
      </div>
      <table className="w-full bg-white border-6 border-red-700">
        <thead>
          <tr>
            <th className="py-2">Roll No</th>
            <th className="py-2">Name</th>
            {/* {sessions.map((session, index) => (
              <th key={index} className="py-2">
                <div>{index + 1}</div>
                <div>{session.date}</div>
              </th>
            ))} */}
            <th className="py-2">Total Present</th>
            <th className="py-2">Total Percentage</th>
          </tr>
        </thead>
        <tbody >
          {/* {students.map(student => ( */}
            <tr >
              <td className="border px-4 py-2">student_id</td>
              <td className="border px-4 py-2">user_name</td>
              {/* {sessions.map(session => {
                const attendance = student.attendance.find(att => att.session_id === session.session_id);
                const status = attendance ? attendance.status : '-';
                return <td key={session.session_id} className="border px-4 py-2">{status}</td>;
              })} */}
              {/* <td>kiiiiiiiiiiiiiiiiii</td> */}
              <td className="border px-4 py-2">total_present</td>
              <td className="border px-4 py-2">total_percentage</td>
            </tr>
          {/* ))} */}
        </tbody>
      </table>
    </div>
  );
};

export default AttendanceSheet;
