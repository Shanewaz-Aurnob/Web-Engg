/* eslint-disable react/prop-types */
import { useEffect, useState } from "react";
import { QRCodeCanvas } from 'qrcode.react';
import { Button } from "@/components/ui/button";

const CountdownDisplay = () => {
  const [countdown, setCountdown] = useState(0);
  const [sessionDetails, setSessionDetails] = useState({
    courseName: "",
    courseCode: "",
    date: "",
    time: "",
  });

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
        const interval = setInterval(() => {
          setCountdown((prevCountdown) => {
            if (prevCountdown > 0) {
              return prevCountdown - 1;
            } else {
              clearInterval(interval);
              localStorage.removeItem('countdownEndTime');
              localStorage.removeItem('sessionDetails');
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

  const SessionDetails = ({ sessionDetails, countdown, formatTime }) => {
    const attendanceUrl = `${window.location.origin}/submit-attendance?courseName=${sessionDetails.courseName}&courseCode=${sessionDetails.courseCode}&date=${sessionDetails.date}&time=${sessionDetails.time}`;
    const qrValue = JSON.stringify({
      courseName: sessionDetails.courseName,
      courseCode: sessionDetails.courseCode,
      date: sessionDetails.date,
      time: sessionDetails.time,
      url: attendanceUrl,
    });

    return (
      <div>
        {countdown > 0 ? (
          <div className="p-10">
            <div className="flex flex-row-reverse justify-center gap-28">
              <div>
                <div className="mb-4 text-3xl font-bold">
                  Currently a session is conducted <br />
                  <span className="text-lg">by Rudra Pratap Deb Nath.</span>
                </div>
                <div className="mb-4 text-3xl font-bold">
                  Would you like to provide attendance <br /> for the ongoing session?
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
                <QRCodeCanvas value={qrValue} size={256} />
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

  return (
    <SessionDetails sessionDetails={sessionDetails} countdown={countdown} formatTime={formatTime} />
  );
};

export default CountdownDisplay;
