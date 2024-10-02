import { useEffect, useState } from "react";
// import QRCode from "qrcode.react"; // Import QRCode component
// import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

const CountdownDisplay = () => {

  const [sessionTime, setSessionTime] = useState([]);
  
  useEffect(() => {
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
    const url = `http://localhost:5000/api/attendance/teacher/class?academic_session_id=20180801&currentDate=${currentDate}&currentTime=${currentTime}`;
    // console.log(url);
    fetch(url)
      .then((res) => res.json())
      .then((data) => {
        setSessionTime(data[0]);
        console.log(data);
      })
      .catch((error) => {
        console.error(error);
      });
  }, []);
  

  useEffect(() => {
    if (!sessionTime) return;
  
    const calculateCountdown = () => {
      const now = new Date();
      const currentHours = now.getHours();
      const currentMinutes = now.getMinutes();
      const currentSeconds = now.getSeconds();
  
      const [endHours, endMinutes, endSeconds] = sessionTime.class_endTime.split(':').map(Number);
      
      const endTimeInSeconds = endHours * 3600 + endMinutes * 60 + endSeconds;
      const currentTimeInSeconds = currentHours * 3600 + currentMinutes * 60 + currentSeconds;
  
      const timeDiffInSeconds = endTimeInSeconds - currentTimeInSeconds;
  
      if (timeDiffInSeconds <= 0) {
        setCountdown('Session has ended');
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



  const [countdown, setCountdown] = useState(0);
  // const [qrCodeData, setQrCodeData] = useState(""); // State to store QR code data

  const [secretCode, setSecretCode] = useState('');


  const handleSubmit = (e) => {
    e.preventDefault();
    // setSubmittedCode(secretCode);
    console.log(secretCode);
  };

  const handleInputChange = (e) => {
    setSecretCode(e.target.value);
  };
  return (
    <div>
      {sessionTime  ? (
        <div className="p-10">
          <div className="flex flex-row-reverse justify-center gap-28 ">
            <div>
              <div className="mb-4 text-3xl font-bold">
                Currently a session is conducted <br />
                <span className="text-lg">by Rudra Pratap Deb Nath.</span>
              </div>
              <div className="mb-4 text-3xl font-bold">
                Would you like to provide attendance <br/> for the ongoing session?
              </div>
              {/* <p className="text-xl font-semibold">Course Name : {sessionTime.courseName}</p>
              <p className="text-xl font-semibold">Course Code : {sessionTime.courseCode}</p>
              <p className="text-xl font-semibold">Date : {sessionTime.date}</p> */}
              <p className="text-xl font-semibold">Starting Time: {sessionTime.class_startTime}</p>
              <p className="text-xl font-semibold">Time left: {countdown}</p>
              <p className="text-xl font-semibold">End Time: {sessionTime.class_endTime}</p>
              <form onSubmit={handleSubmit} className="">
                  <div className="mt-2">
                    <label htmlFor="attendance">Code for attendance</label>
                    <div className="mt-1 flex">
                      <Input
                        type="text"
                        id="secret_code"
                        name="secret_code"
                        value={secretCode}
                        onChange={handleInputChange}
                        className="mr-2"
                      />
                      <button type="submit" className="bg-[#0C4A6E] text-white py-2 px-4 rounded-md font-semibold">
                    Submit Attendance
                  </button>
                    </div>
                  </div>
                </form>
            </div>
            <div className="flex justify-center items-center">
            {/* <QRCode className="w-64" size={240} fgColor={'#66798F'} value={qrCodeData} /> Render the QR code */}
            </div>
          </div>
          <div>
            <hr className="border-2 mt-8" style={{ borderColor: '#CCCCCC' }} />
          </div>
        </div>
      ) : (
        <div className="flex justify-center mt-4">
          <p className="text-xl font-bold">No active session</p>
        </div>
      )}
    </div>
  );
};

export default CountdownDisplay;
