import React, { useState } from "react";
import { PhoneFilled } from '@ant-design/icons';
import { Input, Button } from "antd";
import { PostLogin } from "../../../api/auth/index.tsx";
import { useNavigate } from "react-router-dom";
const Login = () => {
    const [phone, setPhone] = useState("");
    const [password, setPassword] = useState("");
    const navigate = useNavigate();


    const onSubmit = async () => {
        try {
            const data = await PostLogin({ phone, password });
            if (data.token) {
                localStorage.setItem("token", data.token);
            }
            navigate("/dashboard/loyalty");
        } catch (err) {
            console.error(err);
        }
    };

    // useEffect(() => {
    //     console.log("Login state changed:", { phone, password });
    // }, [phone, password]);
    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4">
            <div className="w-full max-w-md rounded-2xl shadow-lg p-10 bg-white">
                {/* Header */}
                <div className="flex flex-col items-center gap-1 mb-6">
                    <div className="text-2xl font-extrabold text-green-800">LoyalHub</div>
                    <div className="text-lg font-semibold text-gray-800">Sign In</div>
                    <div className="text-sm text-gray-500 text-center">
                        Enter your credentials to access your account
                    </div>
                </div>

                {/* Form */}
                <div className="space-y-5" >
                    {/* Email */}
                    <div className="flex flex-col gap-2">
                        <label className="text-sm font-medium text-gray-700">Phone</label>
                        <Input
                            placeholder="Enter your phone number"
                            // rootClassName dùng để target .ant-input bên trong wrapper (antd v5)
                            value={phone}
                            onChange={(e) => setPhone(e.target.value)}
                            aria-label="phone"
                            prefix={<PhoneFilled />}
                        />
                    </div>

                    {/* Password */}
                    <div className="flex flex-col gap-2">
                        <div className="flex justify-between items-center">
                            <label className="text-sm font-medium text-gray-700">Password</label>
                            <a className="text-sm text-green-800 hover:underline" href="#">
                                Forgot Password
                            </a>
                        </div>
                        <Input.Password
                            placeholder="Enter your password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            aria-label="password"
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
                            Sign In
                        </Button>
                    </div>

                    {/* Signup */}
                    <div className="text-sm text-center text-gray-600">
                        Don't have an account?{" "}
                        <a onClick={() => navigate("/register")} className="text-green-800 font-medium hover:underline" href="#">
                            Sign up
                        </a>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Login;
