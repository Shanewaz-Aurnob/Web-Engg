import { Link, useLoaderData, useParams } from "react-router-dom";
import { FaArrowLeft } from 'react-icons/fa';
import { Table, TableHeader, TableBody, TableRow, TableCell, TableCaption, TableHead } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { usePDF } from 'react-to-pdf';

const SemesterDetails = () => {
    const { id } = useParams();
    const sems = useLoaderData();
    const Sem = sems.find(sems => sems.id === id);
    console.log(Sem);
    const { toPDF, targetRef } = usePDF({filename: `${Sem.course_name}.pdf`});

    const calculateAverage = (marks) => {
        const totalMarks = marks.reduce((sum, mark) => sum + mark, 0);
        const average = totalMarks / marks.length;
        return average.toFixed(2); 
    };

    const avgAttendace = (attanded) => {
        const totalHeldClasses = Sem.total_held_classes;
        const average = (attanded / totalHeldClasses) * 100 ;
        console.log(" avg class ", average);
        return average.toFixed(2); 
    };

    return (
        <div className="m-10">
            <div className="mb-4">
                <Link to="/dashboard/staffPage">
                    <button className="flex items-center text-[#0C496D]">
                        <FaArrowLeft className="mr-1" /> Back
                    </button>
                </Link>
            </div>

            <div ref={targetRef} className="mx-4">
                <div className="flex justify-around items-center mb-4">
                    <div className="text-left">
                        <h1 className="text-3xl mb-2 font-bold ">Course : {Sem.course_name} - {Sem.code} </h1>
                        <h1 className="text-2xl mb-2 font-bold ">Total Held Classes : {Sem.total_held_classes} </h1>
                        <h1 className="text-2xl mb-2 font-bold ">Total Students : {Sem.students.length} </h1>
                        
                    </div>
                    <div>
                        <Button onClick={() => toPDF()}>Download PDF</Button>
                    </div>
                </div>
                <Table>
                    <TableCaption>{Sem.course_name} Course Details</TableCaption>
                    <TableHeader>
                        <TableRow >
                            <TableHead className="p-3 text-center text-lg text-black">S.No</TableHead>
                            <TableHead className="p-3 text-center text-lg text-black">Student Name</TableHead>
                            <TableHead className="p-3 text-center text-lg text-black">Student ID</TableHead>
                            <TableHead className="p-3 text-center text-lg text-black">1st CATM</TableHead>
                            <TableHead className="p-3 text-center text-lg text-black">2nd CATM</TableHead>
                            <TableHead className="p-3 text-center text-lg text-black">3rd CATM</TableHead>
                            <TableHead className="p-3 text-center text-lg text-black">Average CATM</TableHead>
                            <TableHead className="p-3 text-center text-lg text-black">Attanded Classes</TableHead>
                            <TableHead className="p-3 text-center text-lg text-black">Average Attendance</TableHead>
                            <TableHead className="p-3 text-center text-lg text-black">Attendance Mark</TableHead>
                            <TableHead className="p-3 text-center text-lg text-black">Total Mark (CTMA + Attendance)</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                            {Sem.students.map((student, index) => (
                            <TableRow key={student.name}>
                                <TableCell className=" text-center ">{index + 1}</TableCell>
                                <TableCell className=" text-center ">{student.name}</TableCell>
                                <TableCell className=" text-center ">{student.student_id}</TableCell>
                                <TableCell className=" text-center ">{student.ctma_marks[0]}</TableCell>
                                <TableCell className=" text-center ">{student.ctma_marks[1]}</TableCell>
                                <TableCell className=" text-center ">{student.ctma_marks[2]}</TableCell>
                                <TableCell className=" text-center ">{calculateAverage(student.ctma_marks)}</TableCell>
                                <TableCell className=" text-center ">{student.attended}</TableCell>
                                <TableCell className=" text-center ">{avgAttendace(student.attended)}</TableCell>
                                <TableCell className=" text-center ">{(avgAttendace(student.attended) * (7.5 / 100)).toFixed(2)}</TableCell>
                                <TableCell className=" text-center ">{((Number(avgAttendace(student.attended)) * 0.075) + Number(calculateAverage(student.ctma_marks))).toFixed(2)}</TableCell>

                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </div>
        </div>
    );
};

export default SemesterDetails;
