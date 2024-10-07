import { useState } from 'react';
// import { Label } from "@/components/ui/label"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input";

const Login = () => {
    const [id, setId] = useState('');
    const [password, setPassword] = useState('');
    const [role, setRole] = useState('teacher'); // Default role set to 'teacher'

    const handleRoleChange = (event) => {
        setRole(event.target.value);
    };

    const handleSubmit = (event) => {
        event.preventDefault();
        const formData = [id, password, role];
        console.log(formData);
        // Handle form submission logic here
    };

    return (
        <div className="max-w-md mx-auto mt-10 p-6 shadow-lg rounded-lg bg-white">
            <h1 className="text-2xl font-bold mb-6 text-center">Login</h1>
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
                    <RadioGroup value={role} onChange={handleRoleChange}>
                        <div className="flex items-center space-x-2">
                            <RadioGroupItem value="teacher" id="teacher" />
                            <label htmlFor="teacher">Teacher</label>
                        </div>
                        <div className="flex items-center space-x-2">
                            <RadioGroupItem value="student" id="student" />
                            <label htmlFor="student">Student</label>
                        </div>
                        <div className="flex items-center space-x-2">
                            <RadioGroupItem value="staff" id="staff" />
                            <label htmlFor="staff">Staff</label>
                        </div>
                    </RadioGroup>
                </div>
                <div className="text-center">
                    <Button type="submit" >Login</Button>
                </div>
            </form>
        </div>
    );
};

export default Login;
