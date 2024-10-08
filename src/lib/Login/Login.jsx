import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

const Login = () => {
    const [id, setId] = useState('');
    const [password, setPassword] = useState('');
    const [role, setRole] = useState('teacher'); // Default role set to 'teacher'
    const navigate = useNavigate();

    const handleRoleChange = (event) => {
        setRole(event.target.value);
        // console.log('Selected Role:', event.target.value); // Debugging
    };

    const handleSubmit = (event) => {
        event.preventDefault();
        const formData = { id, password, role };
        console.log(formData);

        // Navigation logic
        if (role === 'teacher' && id === '5008' && password == 'teacher@08' ) {
            localStorage.setItem('userRole', role); // Save role to localStorage
            navigate('/dashboard/attendance');
        } else if (role === 'student' && (id === '19701008' || id === '19701015' || id === '19701002' || id === '19701037' || id === '19701024') && password == 'student@05')  {
            localStorage.setItem('userRole', role); // Save role to localStorage
            navigate(`/dashboard/studentPage/${id}`);
        } else if (role === 'staff' && password == 'staff@01') {
            localStorage.setItem('userRole', role); // Save role to localStorage
            navigate('/dashboard/staffPage');
        } else {
            console.log('Invalid credentials or role');
        }
    };

    return (
        <div className='h-screen flex justify-center items-center'>
            <div className=' w-[28rem]  shadow-gray-400 lg:shadow-[10px_10px_20px_0_rgba(0,0,0,0.5)] shadow-[10px_10px_10    px_0_rgba(0,0,0,0.9)]'>
            <div className=" mt-10 p-6 shadow-lg rounded-lg bg-white ">
            <h1 className="text-4xl font-bold mb-2 text-center">Attendance System</h1>
            <h3 className="text-2xl font-semibold mb-6 text-center">University of Chittagong</h3>
            <form onSubmit={handleSubmit}>
                <div className="mb-4">
                    <label htmlFor="id" className="block text-sm font-medium text-gray-700">ID</label>
                    <Input 
                        id="id" 
                        name="id" 
                        type="text" 
                        value={id}
                        onChange={(e) => setId(e.target.value)}
                        required 
                        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm" 
                    />
                </div>
                <div className="mb-4">
                    <label htmlFor="password" className="block text-sm font-medium text-gray-700">Password</label>
                    <Input 
                        id="password" 
                        name="password" 
                        type="password" 
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        required 
                        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm" 
                    />
                </div>
                <div className="mb-4">
                    <label className="block text-sm font-medium text-gray-700 mb-2">Role</label>
                    <div className="flex items-center space-x-4">
                        <div className="flex items-center">
                            <input 
                                type="radio" 
                                value="teacher" 
                                id="teacher" 
                                checked={role === 'teacher'} 
                                onChange={handleRoleChange} 
                                className="mr-2" 
                            />
                            <label htmlFor="teacher">Teacher</label>
                        </div>
                        <div className="flex items-center">
                            <input 
                                type="radio" 
                                value="student" 
                                id="student" 
                                checked={role === 'student'} 
                                onChange={handleRoleChange} 
                                className="mr-2" 
                            />
                            <label htmlFor="student">Student</label>
                        </div>
                        <div className="flex items-center">
                            <input 
                                type="radio" 
                                value="staff" 
                                id="staff" 
                                checked={role === 'staff'} 
                                onChange={handleRoleChange} 
                                className="mr-2" 
                            />
                            <label htmlFor="staff">Staff</label>
                        </div>
                    </div>
                </div>
                <div className="text-center">
                    <Button type="submit">Login</Button>
                </div>
            </form>
        </div>
        </div>
        </div>
        
        
    );
};

export default Login;
