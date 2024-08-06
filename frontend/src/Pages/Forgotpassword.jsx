import React, { useState } from 'react';
import { InputText } from 'primereact/inputtext';
import { Button } from 'primereact/button';
import { Message } from 'primereact/message';
import 'primeflex/primeflex.css';

const Forgotpassword = () => {
    const [email, setEmail] = useState('');
    const [error, setError] = useState('');

    const validateEmail = (email) => /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(email);

    const handleSubmit = (e) => {
        e.preventDefault();

        if (!validateEmail(email)) {
            setError('รูปแบบอีเมลไม่ถูกต้อง');
        } else {
            setError('');
            console.log('Email submitted:', email);
        }
    };

    return (
        <div className="flex justify-content-center align-items-center" style={{ height: '80vh' }}>
            <div className="surface-card p-6 shadow-2 border-round" style={{ width: '100%', maxWidth: '600px' }}>
                <h2 className="text-center mb-4 text-blue-600">ลืมรหัสผ่าน</h2>
                <p className="mb-4 font-light text-500">กรอกที่อยู่อีเมลของคุณเพื่อรับรหัสผ่านใหม่</p>
                <form className="p-fluid" onSubmit={handleSubmit}>
                    <div className="p-field mb-4">
                        <label htmlFor="email" className="block mb-2 font-semibold">อีเมล</label>
                        <InputText
                            id="email"
                            type="text"
                            className="w-full"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                        />
                        {error && <Message severity="error" text={error} className="mt-2"/>}
                    </div>
                    <Button label="ยืนยัน" type="submit" className="w-full p-button-info mb-4" />
                </form>
            </div>
        </div>
    );
};

export default Forgotpassword;
