import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { InputText } from 'primereact/inputtext';
import { Password } from 'primereact/password';
import { Button } from 'primereact/button';
import { Checkbox } from 'primereact/checkbox';
import { Message } from 'primereact/message';
import 'primeflex/primeflex.css';

const Login = () => {
    const [userid, setUserid] = useState('');
    const [password, setPassword] = useState('');
    const [checked, setChecked] = useState(false);
    const [UseridError, setUseridError] = useState('');
    const [successMessage, setSuccessMessage] = useState('');
    const navigate = useNavigate();

    const validateUserid = (userid) => {
        const regex = /^[a-zA-Z0-9]+$/;
        return regex.test(userid);
    };

    const handleSubmit = (event) => {
        event.preventDefault();
        if (!validateUserid(userid)) {
            setUseridError('กรุณากรอกชื่อผู้ใช้ที่ถูกต้อง (เฉพาะตัวอักษรภาษาอังกฤษและตัวเลข)');
            setSuccessMessage('');
            return;
        }
        if (userid === 'admin' && password === '1234') {
            navigate('/homeadmin');
            return;
        }
        setUseridError('');
        setSuccessMessage('เข้าสู่ระบบสำเร็จ');
    };

    return (
        <div className="flex justify-content-center align-items-center" style={{ height: '80vh' }}>
            <div className="surface-card p-6 shadow-2 border-round-lg" style={{ width: '100%', maxWidth: '600px' }}>
                <h2 className="text-center mb-4 text-blue-600">เข้าสู่ระบบ</h2>
                <div className="pages-detail text-center mb-2">กรุณาเข้าสู่ระบบก่อนทำการสั่งซื้อ</div>
                <form className="p-fluid" onSubmit={handleSubmit}>
                    <div className="p-field mb-4">
                        <label htmlFor="userid" className="block mb-2 font-semibold pi pi-user "> ชื่อผู้ใช้</label>
                        <InputText
                            id="userid"
                            type="text"
                            placeholder='ชื่อผู้ใช้'
                            className="w-full "
                            value={userid}
                            onChange={(e) => setUserid(e.target.value)}
                        />
                        {UseridError && <Message severity="error" text={UseridError} className="mt-2" />}
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
