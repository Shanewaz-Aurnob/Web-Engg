/* eslint-disable no-unsafe-optional-chaining */
import { Table, TableHeader, TableBody, TableRow, TableCell, TableCaption, TableHead } from "@/components/ui/table";
import { FaArrowLeft } from 'react-icons/fa';
import AttendanceSheet from "./AttendanceSheet";
import { Button } from "@/components/ui/button";
import { usePDF } from 'react-to-pdf';
import { useEffect, useState } from "react";
import { Link, } from "react-router-dom";
import { useLocation } from 'react-router-dom';
// import { useEffect } from 'react';



const CourseDetails = () => {
    const [details, setDetails] = useState({});
    const [sessions, setSessions] = useState([]);
    const [studentData, setStudentData] = useState([]);
    // const [courses, setCourses] = useState([]);

    const {state} = useLocation();
    console.log("course details",state);

  useEffect(() => {
    console.log('Location state:', location.state);
    if (state) {
      console.log('state:', state.myObj);
    } else {
      console.log('No course data available');
    }
  }, [state]);
   

    const teacherName='Dr. Rudra Pratap Deb Nath'
    const courseCode ='CSE-413'

    useEffect(() => {
        // Fetch course details
        fetch(`http://localhost:5000/api/attendance/teacher/get-attendance?course_id=${state.myObj.course_id}&academic_session_id=20180801`)
            .then((res) => res.json())
            .then((data) => {
                setDetails(data);
                console.log(data);
            })
            .catch((error) => {
                console.error("Error fetching teacher details:", error);
            });
    }, []);

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

    // Calculate total classes held
    const totalClassesHeld = uniqueDates.length;

    const { toPDF, targetRef } = usePDF({ filename: 'attendance.pdf' });

    return (
        <div className="m-10">
            <div className="mb-4">
                <Link to="/dashboard/attendance"><button className="flex items-center text-[#0C496D]">
                    <FaArrowLeft className="mr-1" /> Back
                </button></Link>
            </div>

            <h1 className="text-3xl mb-4 font-bold text-center">{state.myObj.course_title} Details</h1>
            <h3 className="text-xl mb-6 font-bold text-center">Total Held Classes: {uniqueDates.length}</h3>
            
            <div>
                <Button onClick={() => toPDF()}>Download PDF</Button>
            </div>
            <Table>
                <TableCaption>{state.myObj.course_title} Details</TableCaption>
                <TableHeader>
                    <TableRow>
                        <TableHead className="p-3 text-center text-lg text-black">Student Id</TableHead>
                        <TableHead className="p-3 text-center text-lg text-black">Attended Classes</TableHead>
                        <TableHead className="p-3 text-center text-lg text-black">Average Attendance</TableHead>
                        <TableHead className="p-3 text-center text-lg text-black">Attendance Mark</TableHead>
                    </TableRow>
                </TableHeader>
                <TableBody>
                    {studentData.map(student => {
                        const totalPresent = uniqueDates.filter(date => student.attendance[date] === 'P').length;
                        const totalPercentage = ((totalPresent / totalClassesHeld) * 100).toFixed(2);
                        return (
                            <TableRow key={student.id}>
                                <TableCell className="text-center">{student.id}</TableCell>
                                <TableCell className="text-center">{totalPresent}</TableCell>
                                <TableCell className="text-center">{totalPercentage}%</TableCell>
                                <TableCell className="text-center">{(totalPercentage) * 0.075}</TableCell>
                            </TableRow>

                        );
                    })}

                    
                </TableBody>
            </Table>


            <div ref={targetRef} 
            style={{ position: 'absolute', top: '-10000px', left: '-10000px', width: '100%', height: 'auto' }}
            >
                <AttendanceSheet courseCode={courseCode} teacherName={teacherName} details={details}/>
            </div>
        </div>
    );
};

export default CourseDetails;