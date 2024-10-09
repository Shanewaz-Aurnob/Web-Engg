import { useEffect, useState } from "react";
import QRCode from "qrcode.react"; // Import QRCode component
// import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

const CountdownDisplay = (id) => {

  const [sessionTime, setSessionTime] = useState(null);
  const [qrCodeData, setQrCodeData] = useState(""); // State to store QR code data
  const [countdown, setCountdown] = useState(0);
  const [secretCode, setSecretCode] = useState('');
  const student_id = id;

  const aca_id = 20180801;

  useEffect(() => {
    const getCurrentDateTime = () => {
      const now = new Date();
      const year = now.getFullYear();
      const month = String(now.getMonth() + 1).padStart(2, '0');
      const day = String(now.getDate()).padStart(2, '0');
      const hours = String(now.getHours()).padStart(2, '0');
      const minutes = String(now.getMinutes()).padStart(2, '0');
      // const seconds = String(now.getSeconds()).padStart(2, '0');
  
      const currentDate = `${year}-${month}-${day}`;
      const currentTime = `${hours}:${minutes}:00`;
  
      return { currentDate, currentTime };
    };
  
    const { currentDate, currentTime } = getCurrentDateTime();
    const url = `http://bike-csecu.com:5000/api/attendance/teacher/class?academic_session_id=${aca_id}&currentDate=${currentDate}&currentTime=${currentTime}`;
    // console.log(url);
    fetch(url)
      .then((res) => res.json())
      .then((data) => {
        setSessionTime(data[0]);
        console.log(data[0]);
      })
      .catch((error) => {
        console.error(error);
      });
  }, []);

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

  const handleSubmit = (e) => {
    e.preventDefault();
    if (secretCode === sessionTime.secret_code) {
        // console.log(true);
        
        // Prepare the data to be sent to the API
        const data = {  
           student_id: id.id,
           session_id: sessionTime.session_id
        };
        console.log("attendance submit data",data)

        // Send the update attendance request
        fetch('http://bike-csecu.com:5000/api/attendance/teacher/update-attendance', {
            method: 'PATCH', 
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(data), 
        })
        .then((response) => {
            if (!response.ok) {
                throw new Error('Network response was not ok');
            }
            return response.json();
        })
        .then((data) => {
            console.log('Attendance updated successfully:', data);
            alert('Attendance updated successfully!');
            
        })
        .catch((error) => {
            console.error('Error updating attendance:', error);
        });
    } else {
        console.log(false);
    }
};

const formatDate = (dateString) => {
  const date = new Date(dateString);
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0'); // Months are 0-based in JavaScript
  const day = String(date.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
};

  const handleInputChange = (e) => {
    setSecretCode(e.target.value);
  };

  return (
    <div>
      {sessionTime ? (
        <div className="pt-10">
          <div className="flex flex-row-reverse justify-center gap-28 ">
            <div>
              <div className="mb-4 text-3xl font-bold">
                Currently a session is conducted <br />
                <span className="text-lg">by Rudra Pratap Deb Nath.</span>
              </div>
              <div className="mb-4 text-3xl font-bold">
                Would you like to provide attendance <br/> for the ongoing session?
              </div>
              <p className="text-xl font-semibold">Date : {formatDate(sessionTime.class_startDate)}</p>
              <p className="text-xl font-semibold">Starting Time: {sessionTime.class_startTime}</p>
              <p className="text-xl font-semibold">Time left: {countdown}</p>
              <p className="text-xl font-semibold">End Time: {sessionTime.class_endTime}</p>
              <form onSubmit={handleSubmit} className="">
                  <div className="mt-2">
                    <label htmlFor="attendance">Code for attendance</label>
                    <div className="mt-1 flex flex-row justify-evenly w-full">
                      <Input
                        type="text"
                        id="secret_code"
                        name="secret_code"
                        value={secretCode}
                        onChange={handleInputChange}
                        className="mr-2"
                      />
                      <button type="submit" className="bg-[#0C4A6E] text-white py-2 px-5 w-1/2 rounded-md font-semibold">
                        Submit Attendance
                      </button>
                    </div>
                  </div>
                </form>
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
