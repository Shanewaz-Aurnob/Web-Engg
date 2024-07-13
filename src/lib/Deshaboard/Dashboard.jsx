
import { useState } from 'react';
import { NavLink, Outlet, useOutletContext } from 'react-router-dom';

const Dashboard = () => {

    const [ongoingSession, setOngoingSession] = useState(null);

    const handleSessionCreate = (sessionDetails) => {
        setOngoingSession(sessionDetails);
      };
    return (
        <div className="lg:flex ">
            <div className="lg:w-56 bg-slate-400 p-10 ">
                <ul className="menu space-y-2">
                    <li>
                        <NavLink 
                            to='/attendance'  
                            className="block px-4 py-2 rounded-lg transition-colors duration-200 ease-in-out hover:bg-gray-200 focus:bg-gray-200"
                        >
                            TeacherPage
                        </NavLink>
                    </li>
                    <li>
                        <NavLink 
                            to="/studentPage"  
                            className="block px-4 py-2 rounded-lg transition-colors duration-200 ease-in-out hover:bg-gray-200 focus:bg-gray-200"
                        >
                            StudentPage
                        </NavLink>
                    </li> 
                    <li>
                        <NavLink 
                            to='/staffPage'  
                            className="block px-4 py-2 rounded-lg transition-colors duration-200 ease-in-out hover:bg-gray-200 focus:bg-gray-200"
                        >
                            StaffPage
                        </NavLink>
                    </li> 
                    
                </ul>
            </div>
            <div className="lg:flex-1">
                <Outlet context={{ ongoingSession, handleSessionCreate }}/>
            </div>
        </div>
    );
};

export default Dashboard;
