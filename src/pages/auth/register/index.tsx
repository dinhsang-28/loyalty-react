import { Button, Input, } from "antd";
import React, { useState } from "react";
import { UserOutlined, MailOutlined, PhoneFilled } from '@ant-design/icons';
import { PostRegister } from "@/api/auth/index.tsx";
import { useNavigate } from "react-router-dom";


const Register = () => {

    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [fullName, setFullName] = useState("");
    const [phone, setPhone] = useState("");
    const navigate = useNavigate();

    const onSubmit = async () => {
        try {
            await PostRegister({ fullname: fullName, email, phone, password, confirmPassword });
            navigate("/login");
        } catch (err) {
            console.error(err);
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4">
            <div className="w-full max-w-md rounded-2xl shadow-lg p-10 bg-white">
                {/* Header */}
                <div className="flex flex-col items-center gap-1 mb-6">
                    <div className="text-2xl font-extrabold text-green-800">LoyalHub</div>
                    <div className="text-lg font-semibold text-gray-800">Create Account</div>
                    <div className="text-sm text-gray-500 text-center">
                        Join our platform and start earning rewards
                    </div>
                </div>

                {/* Form */}
                <div className="space-y-5" >
                    {/* Email */}
                    <div className="flex flex-col gap-2">
                        <label className="text-sm font-medium text-gray-700">Full Name</label>
                        <Input
                            placeholder="John Doe"
                            // rootClassName dùng để target .ant-input bên trong wrapper (antd v5)
                            prefix={<UserOutlined />}
                            aria-label="fullname"
                            value={fullName}
                            onChange={(e) => setFullName(e.target.value)}
                        />
                    </div>
                    <div className="flex flex-col gap-2">
                        <label className="text-sm font-medium text-gray-700">Email</label>
                        <Input
                            placeholder="you@example.com"
                            // rootClassName dùng để target .ant-input bên trong wrapper (antd v5)
                            prefix={<MailOutlined />}
                            aria-label="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                        />
                    </div>
                    <div className="flex flex-col gap-2">
                        <label className="text-sm font-medium text-gray-700">Phone</label>
                        <Input
                            placeholder="Enter your phone number"
                            // rootClassName dùng để target .ant-input bên trong wrapper (antd v5)
                            prefix={<PhoneFilled />}
                            aria-label="email"
                            value={phone}
                            onChange={(e) => setPhone(e.target.value)}
                        />
                    </div>

                    {/* Password */}
                    <div className="flex flex-col gap-2">
                        <div className="flex justify-between items-center">
                            <label className="text-sm font-medium text-gray-700">Password</label>

                        </div>
                        <Input.Password
                            placeholder="Enter your password"

                            aria-label="password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                        />
                    </div>
                    <div className="flex flex-col gap-2">
                        <div className="flex justify-between items-center">
                            <label className="text-sm font-medium text-gray-700">Confirm Password</label>

                        </div>
                        <Input.Password
                            placeholder="Enter your confirm password"
                            value={confirmPassword}
                            onChange={(e) => setConfirmPassword(e.target.value)}
                            aria-label="confirm password"
                        />
                    </div>


                    {/* Submit */}
                    <div>
                        <Button
                            htmlType="submit"
                            type="primary"
                            color="cyan"
                            variant="solid"
                            onClick={onSubmit}
                            className="w-full py-3 rounded-md bg-green-800 border-0 hover:bg-green-700 shadow-md transition"
                        >
                            Create Account
                        </Button>
                    </div>

                    {/* Signup */}
                    <div className="text-sm text-center text-gray-600">
                        Already have an account? {" "}
                        <a onClick={() => navigate("/login")} className="text-green-800 font-medium hover:underline" href="#">
                            Sign in
                        </a>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default Register;