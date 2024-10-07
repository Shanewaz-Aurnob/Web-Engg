/* eslint-disable react/no-unescaped-entities */
import { Table, TableHeader, TableBody, TableHead, TableRow, TableCell } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";

const StaffPage = () => {
    const [sems, setSems] = useState([]);
    
    useEffect(() => {
        const fetchData = async () => {
            try {
                const response = await fetch('/data.json');
                if (!response.ok) {
                    throw new Error('Network response was not ok');
                }
                const data = await response.json();
                setSems(data);
                console.log(data);
            } catch (error) {
                console.error('Fetch error:', error);
            }
        };
        
        fetchData();
    }, []);

    return (
        <div>
            {/* Staff minimum info */}
            <div className="flex justify-center gap-20">
                <div className="p-20">
                    <p className="pb-1 text-3xl font-bold">Staffs' Name: Mannan Vai</p>
                    {/* <p className="pt-1 text-xl font-semibold">Student ID: 20701043</p>
                    <p className="pt-1 text-xl font-semibold">Current Semester: 6th Semester</p>
                    <p className="pt-1 text-xl font-semibold">Session: 2019-2020</p> */}
                </div>
                <div className="flex justify-center items-center">
                    <img className="inline-block h-36 w-36 rounded-full ring-8 ring-slate-400" src="https://images.unsplash.com/photo-1500648767791-00dcc994a43e?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=2.25&w=256&h=256&q=80" alt=""/>
                </div>
            </div>
            <div>
                <hr className="border-2" style={{ borderColor: '#CCCCCC' }} />
            </div>

            {/* ongoing semesters attendance */}
            <div>
                <div className="overflow-x-auto p-10">
                    <h1 className="text-3xl mb-4 font-bold text-center">Current Semesters Details</h1>
                    <Table className="w-full">
                        <TableHeader>
                            <TableRow>
                                <TableHead className="p-3 text-center text-lg text-black">S.No</TableHead>
                                <TableHead className="p-3 text-center text-lg text-black">Course Name</TableHead>
                                <TableHead className="p-3 text-center text-lg text-black">Course Code</TableHead>
                                <TableHead className="p-3 text-center text-lg text-black">Program</TableHead>
                                <TableHead className="p-3 text-center text-lg text-black">Semester</TableHead>
                                <TableHead className="p-3 text-center text-lg text-black">Total students</TableHead>
                                <TableHead className="p-3 text-center text-lg text-black">Action</TableHead>
                                {/* <TableHead className="p-3 text-center text-lg text-black">Download Pdf</TableHead> */}
                                {/* <TableHead className="p-3 text-center text-lg text-black"></TableHead> */}
                            </TableRow>
                        </TableHeader>

                        <TableBody>
                            {sems.map((sem, index) => (
                                <TableRow key={index}>
                                    <TableCell className="p-3 text-center">{index + 1}</TableCell>
                                    <TableCell className="p-3 text-center">{sem.course_name}</TableCell>
                                    <TableCell className="p-3 text-center">{sem.code}</TableCell>
                                    <TableCell className="p-3 text-center">{sem.program}</TableCell>
                                    <TableCell className="p-3 text-center">{sem.sem}</TableCell>
                                    <TableCell className="p-3 text-center">{sem.students.length}</TableCell>
                                    <TableCell className="p-3 text-center">
                                        <Link to={`/dashboard/semDetails/${sem.id}`}>
                                            <Button>View Details</Button>
                                        </Link>
                                    </TableCell>
                                    {/* <TableCell className="p-3 text-center"><Button>Download Pdf</Button></TableCell> */}
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </div>
            </div>
        </div>
    );
};

export default StaffPage;
