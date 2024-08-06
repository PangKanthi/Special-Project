import React, { useState } from 'react';
import { InputText } from 'primereact/inputtext';
import { Password } from 'primereact/password';
import { Button } from 'primereact/button';
import { Checkbox } from 'primereact/checkbox';
import { Message } from 'primereact/message';
import 'primeflex/primeflex.css';

const Login = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [checked, setChecked] = useState(false);
    const [emailError, setEmailError] = useState('');
    const [successMessage, setSuccessMessage] = useState('');

    const validateEmail = (email) => {
        const regex = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;
        return regex.test(email);
    };

    const handleSubmit = (event) => {
        event.preventDefault();
        if (!validateEmail(email)) {
            setEmailError('กรุณากรอกอีเมลที่ถูกต้อง');
            setSuccessMessage('');
            return;
        }
        setEmailError('');
        setSuccessMessage('เข้าสู่ระบบสำเร็จ');
    };

    return (
        <div className="flex justify-content-center align-items-center " style={{ height: '80vh' }}>
            <div className="surface-card p-6 shadow-2 border-round-lg " style={{ width: '100%', maxWidth: '600px' }}>
                <h2 className="text-center mb-4 text-blue-600">เข้าสู่ระบบ</h2>
                <form className="p-fluid" onSubmit={handleSubmit}>
                    <div className="p-field mb-4">
                        <label htmlFor="email" className="block mb-2 font-semibold">อีเมล</label>
                        <InputText
                            id="email"
                            type="text"
                            placeholder='ที่อยู่อีเมล'
                            className="w-full"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                        />
                        {emailError && <Message severity="error" text={emailError} className="mt-2" />}
                    </div>
                    <div className="p-field mb-4">
                        <label htmlFor="password" className="block mb-2 font-semibold">รหัสผ่าน</label>
                        <Password
                            id="password"
                            toggleMask
                            feedback={false}
                            placeholder='รหัสผ่าน'
                            className="w-full"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                        />
                    </div>
                    <Button label="เข้าสู่ระบบ" type="submit" className="w-full p-button-info mb-4" />
                </form>
                {successMessage && <Message severity="success" text={successMessage} className="w-full mb-4" />}
                <div className="flex align-items-center mb-4">
                    <Checkbox
                        id="rememberme"
                        onChange={(e) => setChecked(e.checked)}
                        checked={checked}
                        className="mr-2"
                    />
                    <label htmlFor="rememberme">จดจำฉัน</label>
                </div>
                <div className="flex justify-content-between">
                    <a href="/register" className="text-primary">สมัครสมาชิก?</a>
                    <a href="/forgotpassword" className="text-primary">ลืมรหัสผ่าน?</a>
                </div>
            </div>
        </div>
    );
};

export default Login;
