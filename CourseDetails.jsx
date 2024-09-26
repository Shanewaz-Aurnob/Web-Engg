import { Table,
    TableHeader,
    TableBody,
    // TableFooter,
    // TableHead,
    TableRow,
    TableCell,
    TableCaption,
    TableHead, } from "@/components/ui/table";
import { Link, useLoaderData, useParams } from 'react-router-dom';
import { FaArrowLeft } from 'react-icons/fa';
import AttendanceSheet from "./AttendanceSheet";
import { Button } from "@/components/ui/button";
import { usePDF } from 'react-to-pdf';



const CourseDetails = () => {


    const teacherName='Dr. Rudra Pratap Deb Nath'
    const courseCode ='CSE-413'

    // Function to calculate average marks
const calculateAverage = (marks) => {
    const totalMarks = marks.reduce((sum, mark) => sum + mark, 0);
    const average = totalMarks / marks.length;
    return average.toFixed(2); // Round to 2 decimal places
};
const avgAttendace = (attanded) => {
    const totalHeldClasses = Details.total_held_classes;
    const average = (attanded / totalHeldClasses) * 100 ;
    console.log(" avg class ", average);
    return average.toFixed(2); // Round to 2 decimal places
};

const { toPDF, targetRef } = usePDF({filename: 'attendance.pdf'});

    const { id } = useParams();
    const details = useLoaderData();
    const Details = details.find(details => details.id === id)
    // console.log( id);
    
    return (
        <div className="m-10 ">
            <div className="mb-4">
                <Link to="/attendance"><button className="flex items-center text-[#0C496D]">
                    <FaArrowLeft className="mr-1" /> Back
                </button></Link>
            </div>

            <h1 className="text-3xl mb-4 font-bold text-center">{Details.course_name} Details</h1>
            <h3 className="text-xl mb-6 font-bold text-center">Total Held Classes: {Details.total_held_classes}</h3>
            <div>
                <Button onClick={() => toPDF()}>Download PDF</Button>
            </div>
            <Table>
                <TableCaption>{Details.course_name} Details</TableCaption>
                <TableHeader >
                    <TableRow>
                        <TableHead className="p-3 text-center text-lg text-black">Student Name</TableHead>
                        <TableHead className="p-3 text-center text-lg text-black">Student Id</TableHead>
                        <TableHead className="p-3 text-center text-lg text-black">1st CATM</TableHead>
                        <TableHead className="p-3 text-center text-lg text-black">2nd CATM</TableHead>
                        <TableHead className="p-3 text-center text-lg text-black">3rd CATM</TableHead>
                        <TableHead className="p-3 text-center text-lg text-black">Average Marks</TableHead>
                        <TableHead className="p-3 text-center text-lg text-black">Attended Classes</TableHead>
                        <TableHead className="p-3 text-center text-lg text-black">Average Attendance</TableHead>
                        <TableHead className="p-3 text-center text-lg text-black">Attendance Mark</TableHead>
                        <TableHead className="p-3 text-center text-lg text-black">Total Mark (CTMA + Attendance)</TableHead>
                    </TableRow>
                </TableHeader>
                <TableBody>
                    {Details.students.map(student => (
                        <TableRow key={student.name}>
                            <TableCell className=" text-center ">{student.name}</TableCell>
                            <TableCell className=" text-center ">{student.student_id}</TableCell>
                            <TableCell className=" text-center ">{student.ctma_marks[0]}</TableCell>
                            <TableCell className=" text-center ">{student.ctma_marks[1]}</TableCell>
                            <TableCell className=" text-center ">{student.ctma_marks[2]}</TableCell>
                            <TableCell className=" text-center ">{calculateAverage(student.ctma_marks)}</TableCell>
                            <TableCell className=" text-center ">{student.attended}</TableCell>
                            <TableCell className=" text-center ">{avgAttendace(student.attended)}</TableCell>
                            <TableCell className=" text-center ">{(avgAttendace(student.attended) * (7.5 / 100)).toFixed(2)}</TableCell>
                            <TableCell className=" text-center "> {((Number(avgAttendace(student.attended)) * 0.075) + Number(calculateAverage(student.ctma_marks))).toFixed(2)}
                            </TableCell>

                        </TableRow>
                    ))}
                </TableBody>
            </Table>


            <div ref={targetRef} 
            style={{ position: 'absolute', top: '-10000px', left: '-10000px', width: '100%', height: 'auto' }}
            >
                <AttendanceSheet courseCode={courseCode} teacherName={teacherName} />
            </div>
        </div>
    );
};

export default CourseDetails;