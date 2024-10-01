import { useEffect, useState } from "react";
import QRCode from "qrcode.react"; // Import QRCode component
import { Button } from "@/components/ui/button";

const CountdownDisplay = () => {

  const [sessionTime, setSessionTime] = useState([]);
  useEffect(() => {
    fetch('http://localhost:5000/api/attendance/teacher/class?session=2019-20&currentDate=2024-09-30&currentTime=16:17:00')
      .then((res) => res.json())
      .then((data) => {
        setSessionTime(data.data);
        console.log(data.data);
      })
      .catch((error) => {
        console.error(error);
      });
  }, []);



  const [countdown, setCountdown] = useState(0);
  const [sessionDetails, setSessionDetails] = useState({
    courseName: "",
    courseCode: "",
    date: "",
    time: "",
  });
  const [qrCodeData, setQrCodeData] = useState(""); // State to store QR code data

  useEffect(() => {
    const endTime = localStorage.getItem('countdownEndTime');
    const savedSessionDetails = localStorage.getItem('sessionDetails');
    const savedQrCodeData = localStorage.getItem('qrCodeData'); // Retrieve QR code data

    if (savedSessionDetails) {
      setSessionDetails(JSON.parse(savedSessionDetails));
    }

    if (savedQrCodeData) {
      setQrCodeData(savedQrCodeData);
    }

    if (endTime) {
      const remainingTime = Math.floor((endTime - Date.now()) / 1000);
      if (remainingTime > 0) {
        setCountdown(remainingTime);
        const interval = setInterval(() => {
          setCountdown((prevCountdown) => {
            if (prevCountdown > 0) {
              return prevCountdown - 1;
            } else {
              clearInterval(interval);
              localStorage.removeItem('countdownEndTime');
              localStorage.removeItem('sessionDetails');
              localStorage.removeItem('qrCodeData'); // Remove QR code data from localStorage
              return 0;
            }
          });
        }, 1000);
        return () => clearInterval(interval);
      } else {
        localStorage.removeItem('countdownEndTime');
        localStorage.removeItem('sessionDetails');
        localStorage.removeItem('qrCodeData'); // Remove QR code data from localStorage
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
      {countdown > 0 ? (
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
              <p className="text-xl font-semibold">Course Name : {sessionDetails.courseName}</p>
              <p className="text-xl font-semibold">Course Code : {sessionDetails.courseCode}</p>
              <p className="text-xl font-semibold">Date : {sessionDetails.date}</p>
              <p className="text-xl font-semibold">Starting Time: {sessionDetails.time}</p>
              <p className="text-xl font-semibold">Time left: {formatTime(countdown)}</p>
              <p className="text-xl font-semibold">End Time: {new Date(Date.now() + countdown * 1000).toLocaleTimeString("en-GB", { hour: "2-digit", minute: "2-digit" })}</p>
                <Button className="mt-4">Submit Attendance</Button>
            </div>
            <div className="flex justify-center items-center">
            <QRCode className="w-64" size={240} fgColor={'#66798F'} value={qrCodeData} /> {/* Render the QR code */}
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
