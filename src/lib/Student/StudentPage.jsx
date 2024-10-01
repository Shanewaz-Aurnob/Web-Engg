/* eslint-disable react/prop-types */
/* eslint-disable react/no-unescaped-entities */

import { Button } from "@/components/ui/button";
import { useEffect, useState } from "react";
import { Table, TableHeader, TableBody, TableHead, TableRow, TableCell } from "@/components/ui/table";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
// import { useOutletContext } from "react-router-dom";
import CountdownDisplay from "./CountdownDisplay";

const StudentPage = () => {
  // const { ongoingSession } = useOutletContext();

  // console.log(ongoingSession);
  const studentId = 20701043;
  const [courses, setCourses] = useState([]);

  useEffect(() => {
    fetch('data.json')
      .then((res) => res.json())
      .then((data) => {
        const filteredCourses = data.filter(course => course.students.some(student => student.student_id === studentId));
        setCourses(filteredCourses);
      })
      .catch((error) => {
        console.error(error);
      });
  }, []);

  const calculateAverage = (marks) => {
    const sum = marks.reduce((a, b) => a + b, 0);
    return (sum / marks.length).toFixed(2);
  };

  

  return (
    <div>
      {/* Students minimum info */}
      <div className="flex justify-center gap-20">
        <div className="p-10">
          <p className="pb-1 text-3xl font-bold">Students' Name: Khadiza Jarin Roza</p>
          <p className="pt-1 text-xl">Student ID: 20701043</p>
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
       <CountdownDisplay />


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
                <TableHead className="p-3 text-center text-lg text-black">Total Held Classes</TableHead>
                <TableHead className="p-3 text-center text-lg text-black">Attended Classes</TableHead>
                <TableHead className="p-3 text-center text-lg text-black">Attandance Percentage</TableHead>
                <TableHead className="p-3 text-center text-lg text-black">Average CATM</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {courses.map((course, index) => (
                course.students.filter(student => student.student_id === studentId).map(student => (
                  <TableRow key={index} className="">
                    <TableCell className="p-3 text-center">{index + 1}</TableCell>
                    <TableCell className="p-3 text-center">{course.course_name}</TableCell>
                    <TableCell className="p-3 text-center">{course.code}</TableCell>
                    <TableCell className="p-3 text-center">{course.total_held_classes}</TableCell>
                    <TableCell className="p-3 text-center">{student.attended}</TableCell>
                    <TableCell className="p-3 text-center">{((student.attended /course.total_held_classes)*100).toFixed(2)} %</TableCell>
                    <TableCell className="p-3 text-center"><Popover>
                            <PopoverTrigger><Button>{calculateAverage(student.ctma_marks)}</Button></PopoverTrigger>
                            <PopoverContent style={{ position: 'absolute', top:'50%', left: '50%', transform: 'translate(-200%, -100%)' }} className="w-96 shadow-slate-950 shadow-2xl"> 
                            <div >
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
                            </PopoverContent>
                          </Popover></TableCell>
                  </TableRow>
                ))
              ))}
            </TableBody>
          </Table>
        </div>
      </div>
    </div>
  );
};

export default StudentPage;
