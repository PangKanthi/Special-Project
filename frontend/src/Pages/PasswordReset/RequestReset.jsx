import React, { useState } from 'react';
import { InputText } from 'primereact/inputtext';
import { Button } from 'primereact/button';
import { Message } from 'primereact/message';
import 'primeflex/primeflex.css';
import axios from 'axios';

const RequestReset = () => {
    const [email, setEmail] = useState('');
    const [message, setMessage] = useState('');
    const [errorMessage, setErrorMessage] = useState('');

    const handleSubmit = async (e) => {
        e.preventDefault();
        setMessage('');
        setErrorMessage('');

        try {
            const response = await axios.post("https://api.d-dayengineering.com/api/users/request-password-reset", { email });
            setMessage(response.data.message);
        } catch (error) {
            setErrorMessage("เกิดข้อผิดพลาด โปรดลองอีกครั้ง");
        }
    };

    return (
        <div className="flex justify-content-center align-items-center" style={{ minHeight: '50vh', padding: '1rem' }}>
            <div className="surface-card p-6 shadow-2 border-round-lg" style={{ width: '100%', maxWidth: '600px' }}>
                <h2 className="text-center mb-4 text-blue-600">ลืมรหัสผ่าน</h2>
                <p className="text-center mb-4 text-500">กรอกอีเมลของคุณเพื่อรับลิงก์รีเซ็ตรหัสผ่าน</p>
                <form className="p-fluid" onSubmit={handleSubmit}>
                    <div className="p-field mb-4">
                        <label htmlFor="email" className="block mb-2 font-semibold">อีเมล</label>
                        <InputText id="email" type="email" className="w-full" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="อีเมลของคุณ" />
                    </div>
                    <Button label="ส่งคำขอ" type="submit" className="w-full p-button-info mb-4" />
                </form>
                {message && <Message severity="success" text={message} className="w-full mb-4" />}
                {errorMessage && <Message severity="error" text={errorMessage} className="w-full mb-4" />}
            </div>
        </div>
    );
};

export default RequestReset;
