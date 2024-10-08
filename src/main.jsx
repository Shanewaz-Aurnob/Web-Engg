import React from 'react';
import ReactDOM from 'react-dom/client'
import './index.css'
import {
  createBrowserRouter,
  RouterProvider,
} from "react-router-dom";
import App from './lib/App';
import StudentPage from './lib/Student/StudentPage';
import Dashboard from './lib/Deshaboard/Dashboard';
import Attendance from './lib/Teacher/Attendance';
import CourseDetails from './lib/Teacher/CourseDetails';
import StaffPage from './lib/Staff/StaffPage';
import SemesterDetails from './lib/Staff/SemesterDetails';
import Login from './lib/Login/Login';

const router = createBrowserRouter([
  {
    path: "/",
    element: <App></App>,
    children: [
      {
        path:'/',
        element:<Login></Login>
      } 
    ]
    
  },
  {
    path: "/dashboard",
    element: <Dashboard></Dashboard>,
    children:[
      {
        path:"/dashboard/attendance",
        element:<Attendance></Attendance>
      },
      {
        path:"/dashboard/studentPage/:id",
        element: <StudentPage></StudentPage>
      },
      {
        path: '/dashboard/courseDetails/:id',
        element:<CourseDetails></CourseDetails>,
      },
      {
        path:'/dashboard/staffPage',
        element:<StaffPage></StaffPage>
      },
      {
        path:'/dashboard/semDetails/:id',
        element:<SemesterDetails></SemesterDetails>,
        loader: () =>fetch('/data.json')
      },
    ]
  }
]);


ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <RouterProvider router={router} />
  </React.StrictMode>,
)
