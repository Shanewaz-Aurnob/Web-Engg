/* eslint-disable react/no-unescaped-entities */
/* eslint-disable react/prop-types */
import { Button } from "@/components/ui/button";
import { useEffect, useState } from "react";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Input } from "@/components/ui/input";
import { Link } from "react-router-dom";
import { Table, TableHeader, TableBody, TableHead, TableRow, TableCell } from "@/components/ui/table";
import AttendanceSheet from "./AttendanceSheet";
import QRCode from "qrcode.react";


const Attendance = () => {
  const [courses, setCourses] = useState([]);
  const [sessionActive, setSessionActive] = useState(false);
  const [warning, setWarning] = useState("");


  const courseCode = 'CSE-413';

  const [teacherData, setTeacherData] = useState({});

  const userRole = localStorage.getItem('userRole');


  // console.log("passed id:", id);
  

  useEffect(() => {

    if (userRole !== "teacher") return;

    // Fetch teacher details
    fetch('http://localhost:5000/api/teacher/5008')
      .then((res) => res.json())
      .then((data) => {
        setTeacherData({
          name: `${data.personal_info.first_name} ${data.personal_info.last_name}`,
          designation: data.personal_info.designation || "Unknown Designation" 
        });
        // console.log(data);
      })
      .catch((error) => {
        console.error("Error fetching teacher details:", error);
      });


    fetch('http://localhost:5000/api/attendance/teacher?page=1')
      .then((res) => res.json())
      .then((data) => {
        setCourses(data.data);
        console.log(data.data);
      })
      .catch((error) => {
        console.error(error);
      });
  }, [userRole]);


 
  const CreateSessionForm = ({ course }) => {
    const localDate = new Date();
    const localDateString = localDate.toLocaleDateString("en-CA");
    const localTimeString = localDate.toLocaleTimeString("en-GB", {
      hour: "2-digit",
      minute: "2-digit",
    });

    const generateSecretCode = () => { //for security
      const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
      let result = '';
      const charactersLength = characters.length;
      for (let i = 0; i < 8; i++) {
        result += characters.charAt(Math.floor(Math.random() * charactersLength));
      }
      return result;
    };


    const getCurrentDateTime = () => {
      const now = new Date();
      const year = now.getFullYear();
      const month = String(now.getMonth() + 1).padStart(2, '0'); // Months are zero-indexed
      const day = String(now.getDate()).padStart(2, '0');
      const hours = String(now.getHours()).padStart(2, '0');
      const minutes = String(now.getMinutes()).padStart(2, '0');
      // const seconds = String(now.getSeconds()).padStart(2, '0');
  
      const currentDate = `${year}-${month}-${day}`;
      const currentTime = `${hours}:${minutes}:00`;
  
      return { currentDate, currentTime };
    };
  
    const { currentDate } = getCurrentDateTime();
  




  // 2.academic_session_id er jnno fetch api
  const handleSubmit = async (e) => {
    e.preventDefault();
  
    if (sessionActive) {
      setWarning("You can't create session more than once at a time");
      return;
    }
    setWarning('');
  
    const formData = new FormData(e.target);
    const startTime = formData.get('time');
    const duration = Number(formData.get('minutes'));
  
    // Split the start time into hours and minutes
    const [startHour, startMinute] = startTime.split(':').map(Number);
  
    // Calculate the total minutes
    let totalMinutes = startHour * 60 + startMinute + duration;
  
    // Calculate the end hours and minutes
    const endHour = Math.floor(totalMinutes / 60);
    const endMinute = totalMinutes % 60;
  
    // Format end time to "HH:MM:SS"
    const class_endTime = `${String(endHour).padStart(2, '0')}:${String(endMinute).padStart(2, '0')}:00`;
  
    const dataToPost = {
      course_id: course.course_id,
      course_code: formData.get('course_code'),
      semester: Number(formData.get('semester')),
      class_startDate: formData.get('date'),
      class_startTime: `${startTime}:00`,
      duration: duration,
      class_endTime: class_endTime,
      secret_code: generateSecretCode(),
      teacher_id: course.teacher_id,
      academic_session_id: course.academic_session_id
    };
    console.log("posted data",dataToPost);
  
    try {
      // First API call
      const response = await fetch('http://localhost:5000/api/attendance/teacher/create-session', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(dataToPost),
      });
    
      if (response.ok) {
        const dataSessionID = await response.json();
        const newSessionID = dataSessionID.data.session_id; // Get the session ID directly
        console.log("Newly created session ID:", newSessionID);
        // setSessionIDforAPi(newSessionID); // Store it in state
        setSessionActive(true);
    
        // Use the new session ID for the next API call
        const studentsResponse = await fetch(`http://localhost:5000/api/attendance/teacher/students-by-acc-id?academic_session_id=${course.academic_session_id}`);
        
        if (!studentsResponse.ok) {
          throw new Error('Failed to fetch students');
        }
    
        const studentsData = await studentsResponse.json();
        const updatedData = studentsData.map(student => ({
          ...student,
          academic_session_id: course.academic_session_id
        }));
        console.log("updated data",updatedData)
        // setStudentsForThisCourse(updatedData);
        console.log('The academic session students:', updatedData);
        
        // Third API call using newSessionID
        console.log("session id for api", newSessionID); // Now it will show the correct session ID
        const attendanceResponse = await fetch(`http://localhost:5000/api/attendance/teacher/create-attendance?session_id=${newSessionID}&currentDate=${currentDate}`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(updatedData),
        });
        
        if (!attendanceResponse.ok) {
          const attendanceData = await attendanceResponse.json();
          if (attendanceData.error && attendanceData.error.code === 'ER_DUP_ENTRY') {
            console.log('Duplicate entry detected');
          } else {
            throw new Error('Failed to post attendance');
          }
        }
        console.log('Attendance posted successfully');
        
      } else {
        throw new Error('Failed to create session');
      }
      
    } catch (error) {
      console.error('Error:', error);
    }
    
  };
  

  
    return (
        <form onSubmit={handleSubmit} className="space-y-4">
            <div>
                <label htmlFor="courseDetails">Course Name & Course Code</label>
                <div className="mt-1 flex">
                    <Input
                        type="text"
                        id="courseName"
                        defaultValue={course.course_title}
                        readOnly
                        name="course_name"
                        className="mr-2"
                    />
                    <Input
                        type="text"
                        id="courseCode"
                        defaultValue={course.course_code}
                        readOnly
                        name="course_code"
                    />
                </div>
            </div>
            <div>
                <label htmlFor="semester">Session & Semester</label>
                <div className="mt-1 flex">
                    <Input
                        type="text"
                        id="session"
                        defaultValue={course.session}
                        readOnly
                        name="session"
                        className="mr-2"
                    />
                    <Input
                        type="text"
                        id="semester"
                        defaultValue={course.semester}
                        readOnly
                        name="semester"
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
                    />
                </div>
            </div>
            <button type="submit" className="bg-[#0C4A6E] text-white py-2 px-4 rounded-md font-semibold">
                Create Session
            </button>
        </form>
    );
};


const [sessionTime, setSessionTime] = useState(null);
  const [qrCodeData, setQrCodeData] = useState(""); // State to store QR code data
  const [countdown, setCountdown] = useState(0);
  // const [secretCode, setSecretCode] = useState('');



useEffect(() => {
  if (userRole !== "teacher") return;
  const getCurrentDateTime = () => {
    const now = new Date();
    const year = now.getFullYear();
    const month = String(now.getMonth() + 1).padStart(2, '0'); // Months are zero-indexed
    const day = String(now.getDate()).padStart(2, '0');
    const hours = String(now.getHours()).padStart(2, '0');
    const minutes = String(now.getMinutes()).padStart(2, '0');
    // const seconds = String(now.getSeconds()).padStart(2, '0');

    const currentDate = `${year}-${month}-${day}`;
    const currentTime = `${hours}:${minutes}:00`;

    return { currentDate, currentTime };
  };

  const { currentDate, currentTime } = getCurrentDateTime();
  const url = `http://localhost:5000/api/attendance/teacher/class?academic_session_id=20220101&currentDate=${currentDate}&currentTime=${currentTime}`;
  // console.log(url);
  fetch(url)
    .then((res) => res.json())
    .then((data) => {
      setSessionTime(data[0]);
      // console.log(data[0]);
    })
    .catch((error) => {
      console.error(error);
    });
}, [userRole]);

useEffect(() => {
  if (!sessionTime) return;
  
  // Set the QR code data based on sessionTime
  setQrCodeData(`
    Session Time: ${sessionTime.class_startTime} - ${sessionTime.class_endTime}, 
    Attandance code : ${sessionTime.secret_code}`);

  const calculateCountdown = () => {
    const now = new Date();
    const currentHours = now.getHours();
    const currentMinutes = now.getMinutes();
    const currentSeconds = now.getSeconds();
    setSessionActive(true);

    const [endHours, endMinutes, endSeconds] = sessionTime.class_endTime.split(':').map(Number);
    
    const endTimeInSeconds = endHours * 3600 + endMinutes * 60 + endSeconds;
    const currentTimeInSeconds = currentHours * 3600 + currentMinutes * 60 + currentSeconds;

    const timeDiffInSeconds = endTimeInSeconds - currentTimeInSeconds;

    if (timeDiffInSeconds <= 0) {
      setCountdown('Session has ended');
      setSessionActive(false);
      return;
    }

    const hours = Math.floor(timeDiffInSeconds / 3600);
    const minutes = Math.floor((timeDiffInSeconds % 3600) / 60);
    const seconds = timeDiffInSeconds % 60;

    // console.log("time", hours, minutes, seconds);

    setCountdown(`${String(hours).padStart(2, '0')}:${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`);
  };

  const intervalId = setInterval(calculateCountdown, 1000);

  return () => clearInterval(intervalId);
}, [sessionTime]);

const formatDate = (dateString) => {
  const date = new Date(dateString);
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0'); // Months are 0-based in JavaScript
  const day = String(date.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
};



if (userRole == "teacher"){
  return (
    
    <div>
      <div className="flex justify-center gap-20">
        <div className="p-10">
          <p className="pb-1 text-3xl font-bold">Teachers' Name: {teacherData.name}</p>
          <p className="pt-1 text-xl">Designation: {teacherData.designation}</p>
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

      { sessionTime &&(
        <div className="p-10">
          <div className="flex flex-row-reverse justify-center gap-28 ">
            <div>
              <div className="mb-4 text-3xl font-bold">
                Currently a session is conducted <br />
                {/* <span className="text-lg"></span> */}
              </div>
                <p className="text-xl font-semibold">Date : {formatDate(sessionTime.class_startDate)}</p>
                <p className="text-xl font-semibold">Starting Time: {sessionTime.class_startTime}</p>
                <p className="text-xl font-semibold">Time left: {countdown}</p>
                <p className="text-xl font-semibold">End Time: {sessionTime.class_endTime}</p>
                <p className="text-xl font-semibold">Duration: {sessionTime.duration} minutes</p>
              </div>
            <div className="flex justify-center items-center">
              <QRCode className="w-64" size={240} fgColor={'#66798F'} value={qrCodeData} />
              </div>
          </div>
          <div>
            <hr className="border-2 mt-8" style={{ borderColor: '#CCCCCC' }} />
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
                <TableHead className="p-3 text-center text-lg text-black">Credit</TableHead>
                <TableHead className="p-3 text-center text-lg text-black">Which Semester</TableHead>
                <TableHead className="p-3 text-center text-lg text-black">Type</TableHead>
                <TableHead className="p-3 text-center text-lg text-black">Semester</TableHead>
                <TableHead className="p-3 text-center text-lg text-black">Session</TableHead>
                <TableHead className="p-3 text-center text-lg text-black">Details</TableHead>
                <TableHead className="p-3 text-center text-lg text-black">Action</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {courses.map((course, index) => (
                <TableRow key={index}>
                  <TableCell className="text-center">{index + 1}</TableCell>
                  <TableCell className="text-center">{course.course_title}</TableCell>
                  <TableCell className="text-center">{course.course_code}</TableCell>
                  <TableCell className="text-center">{course.program_abbr}</TableCell>
                  <TableCell className="text-center">{course.credit}</TableCell>
                  <TableCell className="text-center">{course.semester}</TableCell>
                  <TableCell className="text-center">{course.course_type}</TableCell>
                  <TableCell className="text-center">{course.semester}</TableCell>
                  <TableCell className="text-center">{course.session}</TableCell>
                  <TableCell className="text-center">
                    <Link to={`/dashboard/courseDetails/${course.course_code}`} state={{myObj: course}}>
                      <Button>View details</Button>
                    </Link>
                  </TableCell>
                  <TableCell className="text-center">
                    <Popover>
                      <PopoverTrigger>
                        <Button >Create Session</Button>
                      </PopoverTrigger>
                      {!sessionActive && (
                        <PopoverContent
                          style={{ position: 'absolute', top: '-50%', left: '50%', transform: 'translate(-200%, -80%)' }}
                          className="w-96 shadow-slate-950 shadow-2xl"
                        >
                          <CreateSessionForm course={course}  />
                        </PopoverContent>
                      )}
                    </Popover>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>

          <div className="hidden">
            <AttendanceSheet courseCode={courseCode} teacherName="Hero" />
          </div>
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

export default Attendance;
