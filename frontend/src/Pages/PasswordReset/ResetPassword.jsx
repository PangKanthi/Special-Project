import React, { useState } from 'react';
import { InputText } from 'primereact/inputtext';
import { Password } from 'primereact/password';
import { Button } from 'primereact/button';
import { Message } from 'primereact/message';
import 'primeflex/primeflex.css';
import axios from 'axios';
import { useLocation, useNavigate } from 'react-router-dom';

const ResetPassword = () => {
    const query = new URLSearchParams(useLocation().search);
    const email = query.get('email');
    const token = query.get('token');
    const navigate = useNavigate();

    const [newPassword, setNewPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [message, setMessage] = useState('');
    const [errorMessage, setErrorMessage] = useState('');

    const validatePassword = (password) => {
        const passwordRegex = /^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{6,24}$/;
        return passwordRegex.test(password);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setMessage('');
        setErrorMessage('');

        if (!validatePassword(newPassword)) {
            setErrorMessage("รหัสผ่านต้องมีความยาว 6-24 ตัวอักษรและประกอบด้วยตัวอักษรและตัวเลข");
            return;
        }

        if (newPassword !== confirmPassword) {
            setErrorMessage("รหัสผ่านทั้งสองช่องต้องตรงกัน");
            return;
        }

        try {
            const response = await axios.post(`http://localhost:1234/api/users/reset-password`, { email, token, newPassword });
            setMessage(response.data.message);
            setTimeout(() => navigate("/login"), 2000); // Redirect to login page after 2 seconds
        } catch (error) {
            setErrorMessage("เกิดข้อผิดพลาด โปรดลองอีกครั้ง");
        }
    };

    return (
        <div className="flex justify-content-center align-items-center" style={{ minHeight: '50vh', padding: '1rem' }}>
            <div className="surface-card p-6 shadow-2 border-round-lg" style={{ width: '100%', maxWidth: '600px' }}>
                <h2 className="text-center mb-4 text-blue-600">รีเซ็ตรหัสผ่าน</h2>
                <p className="text-center mb-4 text-500">กรอกรหัสผ่านใหม่ของคุณ</p>
                <form className="p-fluid" onSubmit={handleSubmit}>
                    <div className="p-field mb-4">
                        <label htmlFor="newPassword" className="block mb-2 font-semibold">รหัสผ่านใหม่</label>
                        <Password id="newPassword" toggleMask className="w-full" value={newPassword} onChange={(e) => setNewPassword(e.target.value)} placeholder="รหัสผ่านใหม่" feedback={false} />
                    </div>
                    <div className="p-field mb-4">
                        <label htmlFor="confirmPassword" className="block mb-2 font-semibold">ยืนยันรหัสผ่านใหม่</label>
                        <Password id="confirmPassword" toggleMask className="w-full" value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)} placeholder="ยืนยันรหัสผ่านใหม่" feedback={false} />
                    </div>
                    <Button label="เปลี่ยนรหัสผ่าน" type="submit" className="w-full p-button-info mb-4" />
                </form>
                {message && <Message severity="success" text={message} className="w-full mb-4" />}
                {errorMessage && <Message severity="error" text={errorMessage} className="w-full mb-4" />}
            </div>
        </div>
    );
};

export default ResetPassword;
