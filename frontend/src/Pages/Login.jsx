import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { InputText } from 'primereact/inputtext';
import { Password } from 'primereact/password';
import { Button } from 'primereact/button';
import { Checkbox } from 'primereact/checkbox';
import { Message } from 'primereact/message';
import 'primeflex/primeflex.css';
import axios from 'axios';

const Login = () => {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [checked, setChecked] = useState(false);
    const [usernameError, setUsernameError] = useState('');
    const [successMessage, setSuccessMessage] = useState('');
    const [errorMessage, setErrorMessage] = useState('');
    const [isLoggedIn, setIsLoggedIn] = useState(false);
    const navigate = useNavigate();
    
    useEffect(() => {
        if (localStorage.getItem('token')) {
            setIsLoggedIn(true);
            navigate("/home");
        }
    }, [navigate]);

    const validateUsername = (username) => {
        const regex = /^[a-zA-Z0-9]+$/;
        return regex.test(username);
    };

    const handleSubmit = async (event) => {
        event.preventDefault();
        setErrorMessage('');
        setSuccessMessage('');
    
        try {
            const response = await axios.post("https://api.d-dayengineering.com/api/auth/login", { username, password });
            console.log("🔑 Login Response:", response.data); // ตรวจสอบข้อมูลที่ได้รับจาก API
    
            if (response.data.success) {
                localStorage.setItem('token', response.data.data.token);
    
                setIsLoggedIn(true);
                setSuccessMessage(response.data.message);
    
                if (response.data.data.role === 'A') {
                    setTimeout(() => navigate("/homeadmin"), 1000);
                } else {
                    setTimeout(() => navigate("/home"), 1000);
                }
            } else {
                setErrorMessage(response.data.message);
            }
        } catch (error) {
            setErrorMessage(error.response?.data?.message || 'เกิดข้อผิดพลาดในการเชื่อมต่อ');
        }
    };

    return (
        <div className="flex justify-content-center align-items-center" style={{ minHeight: '50vh', padding: '1rem' }}>
            <div className="surface-card p-6 shadow-2 border-round-lg" style={{ width: '100%', maxWidth: '600px' }}>
                <h2 className="text-center mb-4 text-blue-600">เข้าสู่ระบบ</h2>
                <div className="pages-detail text-center mb-2">กรุณาเข้าสู่ระบบก่อนทำการสั่งซื้อ</div>
                <form className="p-fluid" onSubmit={handleSubmit}>
                    <div className="p-field mb-4">
                        <label htmlFor="username" className="block mb-2 font-semibold pi pi-user"> ชื่อผู้ใช้</label>
                        <InputText
                            id="username"
                            type="text"
                            placeholder='ชื่อผู้ใช้'
                            className="w-full"
                            value={username}
                            onChange={(e) => setUsername(e.target.value)}
                            disabled={isLoggedIn}
                        />
                        {usernameError && <Message severity="error" text={usernameError} className="mt-2" />}
                    </div>

                    <div className="p-field mb-4">
                        <label htmlFor="password" className="block mb-2 font-semibold pi pi-lock"> รหัสผ่าน</label>
                        <Password
                            id="password"
                            toggleMask
                            feedback={false}
                            placeholder='รหัสผ่าน'
                            className="w-full"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            disabled={isLoggedIn}
                        />
                    </div>

                    {!isLoggedIn && (
                        <Button label="เข้าสู่ระบบ" type="submit" className="w-full p-button-info mb-4" />
                    )}

                    {successMessage && <Message severity="success" text={successMessage} className="w-full mb-4" />}
                    {errorMessage && <Message severity="error" text={errorMessage} className="w-full mb-4" />}
                </form>

                {!isLoggedIn && (
                    <div className="flex align-items-center mb-4">
                        <Checkbox
                            id="rememberme"
                            onChange={(e) => setChecked(e.checked)}
                            checked={checked}
                            className="mr-2"
                        />
                        <label htmlFor="rememberme">จดจำฉัน</label>
                    </div>
                )}

                {!isLoggedIn && (
                    <div className="flex justify-content-between">
                        <a href="/register" className="text-primary">สมัครสมาชิก?</a>
                        <a href="/requestreset" className="text-primary">ลืมรหัสผ่าน?</a>
                    </div>
                )}
            </div>
        </div>
    );
};

export default Login;
