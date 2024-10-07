
import { useState } from 'react';
import { Link, NavLink, Outlet} from 'react-router-dom';
import { Button } from "@/components/ui/button";

const Dashboard = () => {

    const [ongoingSession, setOngoingSession] = useState(null);

    const handleSessionCreate = (sessionDetails) => {
        setOngoingSession(sessionDetails);
      };
    return (
        <div className="lg:flex " >
            <div className="lg:w-56 bg-slate-400 p-10 ">
                <ul className="menu space-y-2" style={{ position: 'absolute', top: '-10000px', left: '-10000px', width: '100%', height: 'auto' }}>
                    <li>
                        <NavLink 
                            to='/dashboard/attendance'  
                            className="block px-4 py-2 rounded-lg transition-colors duration-200 ease-in-out hover:bg-gray-200 focus:bg-gray-200"
                        >
                            TeacherPage
                        </NavLink>
                    </li>
                    <li>
                        <NavLink 
                            to="/dashboard/studentPage"  
                            className="block px-4 py-2 rounded-lg transition-colors duration-200 ease-in-out hover:bg-gray-200 focus:bg-gray-200"
                        >
                            StudentPage
                        </NavLink>
                    </li> 
                    <li>
                        <NavLink 
                            to='/dashboard/staffPage'  
                            className="block px-4 py-2 rounded-lg transition-colors duration-200 ease-in-out hover:bg-gray-200 focus:bg-gray-200"
                        >
                            StaffPage
                        </NavLink>
                    </li> 
                </ul>

                <Link to='/ ' >
                      <Button>Logout</Button>
                    </Link>
            </div>
            <div className="lg:flex-1">
                <Outlet context={{ ongoingSession, handleSessionCreate }}/>
            </div>
        </div>
    );
};

export default Dashboard;
