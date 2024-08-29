/* eslint-disable react/prop-types */
import { useEffect, useState } from 'react';
import logo from '../../assets/cuLogo.png';

const AttendanceSheet = ({ courseCode, teacherName, month, year }) => {
  const [courseDetails, setCourseDetails] = useState({
    semester: '4',
    session: '2019-2020',
    course_code: 'CSE-413'
  });

  const [students, setStudents] = useState([
    { rollNo: '1', name: 'Shanewaz Aurnob', attendance: Array(31).fill('A') },
    { rollNo: '5', name: 'Avinash Sinha', attendance: Array(31).fill('A') },
    { rollNo: '9', name: 'Sourav Talukdar', attendance: Array(31).fill('A') },
    { rollNo: '10', name: 'Kawsar Ahmed Shojib', attendance: Array(31).fill('A') },
    { rollNo: '22', name: 'Asif Mahmud Meraj', attendance: Array(31).fill('A') }
  ]);

  useEffect(() => {
    // Fetch course details and students data from an API or a data source if needed
  }, []);

  const getDaysInMonth = (month, year) => {
    return new Date(year, month, 0).getDate();
  };

  const calculateAttendance = (attendance) => {
    const totalPresent = attendance.filter(day => day === 'P').length;
    const totalPercentage = ((totalPresent / attendance.length) * 100).toFixed(2);
    return { totalPresent, totalPercentage };
  };

  const daysInMonth = getDaysInMonth(month, year);

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
      <table className="w-full bg-white border-2 border-black">
        <thead>
          <tr>
            <th className="py-2 border">Roll No</th>
            <th className="py-2 border">Name</th>
            {Array.from({ length: daysInMonth }, (_, i) => (
              <th key={i} className="py-2 border">{month}/{i + 1}jk</th>
            ))}
            <th className="py-2 border">Total Present</th>
            <th className="py-2 border">Total Percentage</th>
          </tr>
        </thead>
        <tbody>
          {students.map(student => {
            const { totalPresent, totalPercentage } = calculateAttendance(student.attendance);
            return (
              <tr key={student.rollNo}>
                <td className="border px-4 py-2">{student.rollNo}</td>
                <td className="border px-4 py-2">{student.name}</td>
                {student.attendance.map((status, index) => (
                  <td key={index} className="border px-4 py-2">{status}</td>
                ))}
                <td className="border px-4 py-2">{totalPresent}</td>
                <td className="border px-4 py-2">{totalPercentage}%</td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
};

export default AttendanceSheet;
