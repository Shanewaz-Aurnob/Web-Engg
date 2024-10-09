/* eslint-disable react/prop-types */
/* eslint-disable react/no-unescaped-entities */

// import { Button } from "@/components/ui/button";
import { useEffect, useState } from "react";
import { Table, TableHeader, TableBody, TableHead, TableRow, TableCell } from "@/components/ui/table";
import { Popover,  } from "@/components/ui/popover";
import CountdownDisplay from "./CountdownDisplay";
import { useParams } from 'react-router-dom';

const StudentPage = () => {
  // const studentId = 19701008;
  const [studentData, setStudentData] = useState([]);

  const userRole = localStorage.getItem('userRole');

  const { id} = useParams();
  console.log('User ID:', id);
  


  useEffect(() => {

    if (userRole !== "student") return;
    // Fetch  details
    fetch(`http://localhost:5000/api/attendance/teacher/courses?student_id=${id}`)
      .then((res) => res.json())
      .then((data) => {
        if (Array.isArray(data)) {
          setStudentData(data);
        } else {
          console.error("Fetched data is not an array:", data);
        }
        console.log("student data", data);
      })
      .catch((error) => {
        console.error("Error fetching teacher details:", error);
      });
  }, [id, userRole]);


  if (userRole == "student" ){
    return (
    <div>
      {/* Students minimum info */}
      <div className="flex justify-center gap-20">
        <div className="p-10">
          <p className="pb-1 text-3xl font-bold">Students' Name: Khadiza Jarin Roza</p>
          <p className="pt-1 text-xl">Student ID: {id}</p>
          <p className="pt-1 text-xl">Current Semester: 6th Semester</p>
          <p className="pt-1 text-xl">Session: 2019-2020</p>
        </div>
        <div className="flex justify-center items-center">
          <img className="inline-block h-36 w-36 rounded-full ring-8 ring-slate-400" src="https://images.unsplash.com/photo-1500648767791-00dcc994a43e?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=2.25&w=256&h=256&q=80" alt="" />
        </div>
      </div>
      <div>
        <hr className="border-2" style={{ borderColor: '#CCCCCC' }} />
      </div>

      {/* Ongoing session */}
      <CountdownDisplay id={id} />

      {/* student information */}
      <div>
        <div className="overflow-x-auto p-10">
          <h1 className="text-3xl mb-4 font-bold text-center">Enrolled Courses Details</h1>
          <Table className="w-full">
            <TableHeader>
              <TableRow className="font-semibold">
                <TableHead className="p-3 text-center text-lg text-black">S.No</TableHead>
                <TableHead className="p-3 text-center text-lg text-black">Course Name</TableHead>
                <TableHead className="p-3 text-center text-lg text-black">Course Code</TableHead>
                <TableHead className="p-3 text-center text-lg text-black">Course Credit</TableHead>
                <TableHead className="p-3 text-center text-lg text-black">Course Type</TableHead>
                <TableHead className="p-3 text-center text-lg text-black">Exam Minutes</TableHead>
                <TableHead className="p-3 text-center text-lg text-black">Total Held Classes</TableHead>
                <TableHead className="p-3 text-center text-lg text-black">Attended Classes</TableHead>
                <TableHead className="p-3 text-center text-lg text-black">Attendance Percentage</TableHead>
                {/* <TableHead className="p-3 text-center text-lg text-black">Average CATM</TableHead> */}
              </TableRow>
            </TableHeader>
            <TableBody>
              {studentData.map((course, index) => (
                <TableRow key={index} className="">
                  <TableCell className="p-3 text-center">{index + 1}</TableCell>
                  <TableCell className="p-3 text-center">{course.course_title}</TableCell>
                  <TableCell className="p-3 text-center">{course.course_code}</TableCell>
                  <TableCell className="p-3 text-center">{course.credit}</TableCell>
                  <TableCell className="p-3 text-center">{course.course_type}</TableCell>
                  <TableCell className="p-3 text-center">{course.exam_minutes}</TableCell>
                  <TableCell className="p-3 text-center">{course.attended_classes}</TableCell>
                  <TableCell className="p-3 text-center">{course.total_held_class}</TableCell>
                  <TableCell className="p-3 text-center">{((course.total_held_class/ course.attended_classes) * 100).toFixed(2)} %</TableCell>
                  <TableCell className="p-3 text-center">
                    <Popover>
                      {/* <PopoverTrigger><Button>{calculateAverage(course.ctma_marks)}</Button></PopoverTrigger> */}
                      {/* <PopoverContent style={{ position: 'absolute', top:'50%', left: '50%', transform: 'translate(-200%, -100%)' }} className="w-96 shadow-slate-950 shadow-2xl"> 
                      <div>
                          <h2 className="text-2xl font-bold mb-2 text-black">Statistics {course.course_name}</h2>
                          <Table>
                          <TableHeader>
                              <TableRow className="font-semibold">
                                  <TableHead className="p-3 text-center text-lg text-black">S.No</TableHead>
                                  <TableHead className="p-3 text-center text-lg text-black">Marks</TableHead>
                                  <TableHead className="p-3 text-center text-lg text-black">Average</TableHead>
                              </TableRow>
                          </TableHeader>

                          <TableBody>
                              {student.ctma_marks.map((mark, index) => (
                                  <TableRow key={index} className="text-center">
                                  <TableCell className="p-3 text-center">{index + 1}</TableCell>
                                  <TableCell className="p-3 text-center">{mark}</TableCell>
                                  {index === 0 && (
                                      <TableCell className="p-3 text-center" rowSpan={student.ctma_marks.length}>
                                      {calculateAverage(student.ctma_marks)}
                                      </TableCell>
                                  )}
                                  </TableRow>
                              ))}
                          </TableBody>
                          </Table>    
                      </div>
                      </PopoverContent> */}
                    </Popover>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </div>
    </div>
  );
  } else {
    return (
      <div className="flex justify-center items-center h-screen">
        <div>
            Unauthorised Access...
        </div>
      </div>
    )
  }
  
};

export default StudentPage;
