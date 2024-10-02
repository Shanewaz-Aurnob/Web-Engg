/* eslint-disable react/prop-types */
import { useEffect, useState } from 'react';
import logo from '../../assets/cuLogo.png';

const AttendanceSheet = ({  teacherName, details }) => {
  const [sessions, setSessions] = useState([]);
  const [studentData, setStudentData] = useState([]);

  useEffect(() => {
    if (details) {
      const sessionData = [];
      const students = {};

      // Aggregate all sessions from the details object
      Object.values(details).forEach(sessionsArray => {
        sessionsArray.forEach(session => {
          sessionData.push(session);
          session.students.forEach(student => {
            if (!students[student.id]) {
              students[student.id] = { id: student.id, attendance: {} };
            }
            students[student.id].attendance[session.date] = student.status;
          });
        });
      });

      setSessions(sessionData);

      // Set student data
      setStudentData(Object.values(students));
    }
  }, [details]);

  // Extract unique dates from session data
  const uniqueDates = [...new Set(sessions.map(session => session.date))];

  return (
    <div className="p-4 flex flex-col justify-center items-center">
      <img src={logo} className="w-32 h-auto" alt="cu logo" />
      <div className="text-center my-4">
        <h1 className="font-bold text-xl">University of Chittagong</h1>
        <h2>Department of Computer Science and Engineering</h2>
        <p>Course Teacher: {teacherName}</p>
      </div>
      <table className="w-full bg-white border-2 border-black">
        <thead>
          <tr>
            <th className="py-2 border">ID</th>
            {uniqueDates.map((date, index) => (
              <th key={index} className="py-2 border">{date}</th>
            ))}
            <th className="py-2 border">Total Present</th>
            <th className="py-2 border">Total Percentage</th>
          </tr>
        </thead>
        <tbody>
          {studentData.map(student => {
            const totalPresent = uniqueDates.filter(date => student.attendance[date] === 'P').length;
            const totalPercentage = ((totalPresent / uniqueDates.length) * 100).toFixed(2);

            return (
              <tr key={student.id}>
                <td className="border px-4 py-2">{student.id}</td>
                {uniqueDates.map((date, index) => (
                  <td key={index} className="border px-4 py-2">
                    {student.attendance[date] || 'N/A'}
                  </td>
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
