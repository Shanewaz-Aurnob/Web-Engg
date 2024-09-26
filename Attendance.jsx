/* eslint-disable react/prop-types */
/* eslint-disable react/no-unescaped-entities */
import { Button } from "@/components/ui/button";
import { useEffect, useState } from "react";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Input } from "@/components/ui/input";
import { Link } from "react-router-dom";
import { Table, TableHeader, TableBody, TableHead, TableRow, TableCell } from "@/components/ui/table";
import AttendanceSheet from "./AttendanceSheet";

const Attendance = () => {
  const [courses, setCourses] = useState([]);
  const [sessionActive, setSessionActive] = useState(false);
  const [warning, setWarning] = useState("");
  const [sessionDetails, setSessionDetails] = useState({
    courseName: "",
    courseCode: "",
    date: "",
    time: "",
  });
  const teacherName = 'Dr. Rudra Pratap Deb Nath';
  const courseCode = 'CSE-413';

  useEffect(() => {
    fetch('data.json')
      .then((res) => res.json())
      .then((data) => {
        setCourses(data);
        console.log("aise re vai aiseeee");
      })
      .catch((error) => {
        console.error(error);
      });
  }, []);

  const onSubmit = (e) => {
    e.preventDefault();
    if (sessionActive) {
      setWarning("You can't create session more than once at a time");
      return;
    }
    setWarning('');
    const formData = new FormData(e.target);
    const minutes = parseInt(formData.get('minutes'), 10);
  
    // Set session details
    const newSessionDetails = {
      courseName: formData.get('course_name'),
      courseCode: formData.get('course_code'),
      date: formData.get('date'),
      time: formData.get('time'),
    };
  
    setSessionDetails(newSessionDetails);
    localStorage.setItem('sessionDetails', JSON.stringify(newSessionDetails));
  
    startCountdown(minutes);
    console.log("Session created with data:", formData);
    e.target.reset();
  };
  
  const CreateSessionForm = ({ course, onSubmit }) => {
    const localDate = new Date();
    const localDateString = localDate.toLocaleDateString("en-CA");
    const localTimeString = localDate.toLocaleTimeString("en-GB", {
      hour: "2-digit",
      minute: "2-digit",
    });
  
    return (
      <form onSubmit={onSubmit} className="space-y-4">
        <div>
          <label htmlFor="courseDetails">Course Name & Course Code</label>
          <div className="mt-1 flex">
            <Input
              type="text"
              id="courseName"
              defaultValue={course.course_name}
              readOnly
              name="course_name"
              className="mr-2"
            />
            <Input
              type="text"
              id="courseCode"
              defaultValue={course.code}
              readOnly
              name="course_code"
            />
          </div>
        </div>
        <div>
          <label htmlFor="courseDetails">Session & Semester</label>
          <div className="mt-1 flex">
            <Input
              type="text"
              id="courseName"
              defaultValue={'2019-2020'}
              readOnly
              name="course_name"
              className="mr-2"
            />
            <Input
              type="text"
              id="courseCode"
              defaultValue={course.sem}
              readOnly
              name="course_code"
            />
          </div>
        </div>
        <div>
          <label htmlFor="date">Session Date</label>
          <div className="mt-1">
            <Input
              type="date"
              id="date"
              defaultValue={localDateString}
              name="date"
            />
          </div>  
        </div>
        <div>
          <label htmlFor="time">Session Time</label>
          <div className="mt-1">
            <Input
              type="time"
              id="time"
              defaultValue={localTimeString}
              name="time"
            />
          </div>
        </div>
        <div>
          <label htmlFor="minutes">Duration (in minutes)</label>
          <div className="mt-1">
            <Input
              type="number"
              id="minutes"
              name="minutes"
              onChange={(e) => console.log(e.target.value)}
            />
          </div>
        </div>
        <button type="submit" className="bg-[#0C4A6E] text-white py-2 px-4 rounded-md font-semibold">
          Create Session
        </button>
      </form>
    );
  };

  const [totalMinutes, setTotalMinutes] = useState(0);
  const [countdown, setCountdown] = useState(0);

  const convertToHoursMinutes = (totalMinutes) => {
    const hrs = Math.floor(totalMinutes / 60);
    const mins = totalMinutes % 60;
    return { hours: hrs, minutes: mins };
  };

  const startCountdown = (totalMinutes) => {
    setSessionActive(true);
    const totalSeconds = totalMinutes * 60;
    const endTime = Date.now() + totalSeconds * 1000;
    localStorage.setItem('countdownEndTime', endTime);
    setCountdown(totalSeconds);

    const interval = setInterval(() => {
      setCountdown((prevCountdown) => {
        if (prevCountdown > 0) {
          return prevCountdown - 1;
        } else {
          clearInterval(interval);
          localStorage.removeItem('countdownEndTime');
          setSessionActive(false);
          return 0;
        }
      });
    }, 1000);

    return interval;
  };

  

  useEffect(() => {
    const endTime = localStorage.getItem('countdownEndTime');
    const savedSessionDetails = localStorage.getItem('sessionDetails');
  
    if (savedSessionDetails) {
      setSessionDetails(JSON.parse(savedSessionDetails));
    }
  
    if (endTime) {
      const remainingTime = Math.floor((endTime - Date.now()) / 1000);
      if (remainingTime > 0) {
        setCountdown(remainingTime);
        setSessionActive(true);
        const interval = setInterval(() => {
          setCountdown((prevCountdown) => {
            if (prevCountdown > 0) {
              return prevCountdown - 1;
            } else {
              clearInterval(interval);
              localStorage.removeItem('countdownEndTime');
              localStorage.removeItem('sessionDetails');
              setSessionActive(false);
              return 0;
            }
          });
        }, 1000);
        return () => clearInterval(interval);
      } else {
        localStorage.removeItem('countdownEndTime');
        localStorage.removeItem('sessionDetails');
      }
    }
  }, []);
  

 

  const formatTime = (seconds) => {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    const remainingSeconds = seconds % 60;

    return `${hours}:${minutes < 10 ? '0' : ''}${minutes}:${remainingSeconds < 10 ? '0' : ''}${remainingSeconds}`;
  };

  return (
    <div>
      <div className="flex justify-center gap-20">
        <div className="p-10">
          <p className="pb-1 text-3xl font-bold">Teachers' Name: Rudra Pratap Deb Nath</p>
          <p className="pt-1 text-xl">Designation: Designation</p>
          <p className="pt-1 text-xl">Assigned Course: {courses.length}</p>
        </div>
        <div className="flex justify-center items-center">
          <img
            className="inline-block h-36 w-36 rounded-full ring-8 ring-slate-400"
            src="https://images.unsplash.com/photo-1500648767791-00dcc994a43e?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=2.25&w=256&h=256&q=80"
            alt=""
          />
        </div>
      </div>
      <div>
        <hr className="border-2" style={{ borderColor: '#CCCCCC' }} />
      </div>

      {countdown > 0 && (
        <div>
          <div className="flex justify-center mt-4 mb-4">
          <div className="text-center">
            <p className="text-xl font-bold">Course Name: {sessionDetails.courseName}</p>
            <p className="text-xl font-bold">Course Code: {sessionDetails.courseCode}</p>
            <p className="text-xl font-bold">Session Date: {sessionDetails.date}</p>
            <p className="text-xl font-bold">Starting Time: {sessionDetails.time}</p>
            <p className="text-xl font-bold">End Time: {new Date(Date.now() + countdown * 1000).toLocaleTimeString("en-GB", { hour: "2-digit", minute: "2-digit" })}</p>
            <p className="text-xl font-bold">Time left: {formatTime(countdown)}</p>
          </div>
        </div>
        <div>
          <hr className="border-2" style={{ borderColor: '#CCCCCC' }} />
        </div>
        </div>
      )}


      {warning && (
        <div className="flex justify-center mt-4">
          <p className="text-xl font-bold text-red-500">{warning}</p>
        </div>
      )}

      <div>
        <div className="overflow-x-auto p-10">
          <h1 className="text-3xl mb-4 font-bold text-center">Assigned Courses Details</h1>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="p-3 text-center text-lg text-black">S.No</TableHead>
                <TableHead className="p-3 text-center text-lg text-black">Course Name</TableHead>
                <TableHead className="p-3 text-center text-lg text-black">Course Code</TableHead>
                <TableHead className="p-3 text-center text-lg text-black">Program</TableHead>
                <TableHead className="p-3 text-center text-lg text-black">Type</TableHead>
                <TableHead className="p-3 text-center text-lg text-black">Which Semester</TableHead>
                <TableHead className="p-3 text-center text-lg text-black">Session</TableHead>
                <TableHead className="p-3 text-center text-lg text-black">Details</TableHead>
                <TableHead className="p-3 text-center text-lg text-black">Action</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {courses.map((course, index) => (
                <TableRow key={index}>
                  <TableCell className="text-center">{index + 1}</TableCell>
                  <TableCell className="text-center">{course.course_name}</TableCell>
                  <TableCell className="text-center">{course.code}</TableCell>
                  <TableCell className="text-center">{course.program}</TableCell>
                  <TableCell className="text-center">Theory</TableCell>
                  <TableCell className="text-center">{course.sem}</TableCell>
                  <TableCell className="text-center">2019-2020</TableCell>
                  <TableCell className="text-center">
                    <Link to={`/courseDetails/${course.id}`}>
                      <Button>View details</Button>
                    </Link>
                  </TableCell>
                  <TableCell className="text-center">
                    <Popover>
                      <PopoverTrigger >
                        <Button onClick={(e) => {
                            if (sessionActive) {
                              e.preventDefault();
                              setWarning("You can't create session more than once at a time");
                            }
                          }}>Create Session</Button>
                      </PopoverTrigger>
                      {!sessionActive && (
                        <PopoverContent
                          style={{ position: 'absolute', left: '50%', transform: 'translate(-200%, -80%)' }}
                          className="w-96 shadow-slate-950 shadow-2xl"
                        >
                          <CreateSessionForm course={course} onSubmit={onSubmit} />
                        </PopoverContent>
                      )}
                    </Popover>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>

          <div className="hidden">
            <AttendanceSheet courseCode={courseCode} teacherName={teacherName} />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Attendance;
