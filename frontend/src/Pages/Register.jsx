import React, { useState } from 'react';
import { InputText } from 'primereact/inputtext';
import { Password } from 'primereact/password';
import { Button } from 'primereact/button';
import { Message } from 'primereact/message';
import 'primeflex/primeflex.css';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const Register = () => {

    const navigate = useNavigate();

    const [formData, setFormData] = useState({
        firstname: '',
        lastname: '',
        email: '',
        username: ''
    });

    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');

    const [errors, setErrors] = useState({
        firstname: '',
        lastname: '',
        email: '',
        username: '',
        password: '',
        confirmPassword: ''
    });

    const validateName = (firstname) => /^[\u0E00-\u0E7F\s]{1,50}$/.test(firstname);
    const validateEmail = (email) => /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(email);
    const validateUserid = (username) => /^[a-zA-Z0-9]+$/.test(username);
    const validatePassword = (password) => /^[A-Za-z0-9!@#$%^&*()_+]{6,24}$/.test(password);

    const handleChange = (e) => {
        const { id, value } = e.target;
        setFormData({ ...formData, [id]: value });
    };

    const handleSubmit = async (e) => {

        e.preventDefault();

        const newErrors = {
            firstname: validateName(formData.firstname) ? '' : 'ชื่อต้องเป็นภาษาไทย',
            lastname: validateName(formData.lastname) ? '' : 'นามสกุลต้องเป็นภาษาไทย',
            email: validateEmail(formData.email) ? '' : 'รูปแบบอีเมลไม่ถูกต้อง',
            username: validateUserid(formData.username) ? '' : 'ชื่อผู้ใช้ต้องเป็นตัวอักษรภาษาอังกฤษและตัวเลข',
            password: validatePassword(password) ? '' : 'รหัสผ่านต้องมีความยาว 6-24 ตัวอักษรและประกอบด้วยตัวอักษรและตัวเลข',
            confirmPassword: confirmPassword === password ? '' : 'รหัสผ่านไม่ตรงกัน'
        };

        setErrors(newErrors);

        if (!Object.values(newErrors).some(error => error)) {
            console.log('Form submitted successfully:', { ...formData, password });

            let url = 'http://localhost:1234/api/auth/register';

            try {
                const response = await axios.post(url, { ...formData, password });
                if (response.data.success) {
                    alert(response.data.message);
                    navigate("/login");
                }
                else {
                    alert(response.data.message);
                }
            } catch (error) {
                alert(error);
            }
        }
    };

    return (
        <div className="flex justify-content-center align-items-center" style={{ height: '80vh' }}>
            <div className="surface-card p-6 shadow-2 border-round-lg" style={{ width: '100%', maxWidth: '600px' }}>
                <h2 className="text-center mb-4 text-blue-600">สมัครสมาชิก</h2>
                <form className="p-fluid" onSubmit={handleSubmit}>

                    <div className="p-field mb-4">
                        <label htmlFor="username" className="block mb-2 font-semibold pi pi-user"> ชื่อผู้ใช้</label>
                        <InputText
                            id="username"
                            type="text"
                            className="w-full"
                            placeholder='ชื่อผู้ใช้'
                            value={formData.username}
                            onChange={handleChange}
                        />
                        {errors.username && <Message severity="error" text={errors.username} className="mt-2" />}
                    </div>

                    <div className="p-field mb-4">
                        <label htmlFor="firstname" className="block mb-2 font-semibold pi pi-user-edit"> ชื่อ</label>
                        <InputText
                            id="firstname"
                            type="text"
                            className="w-full"
                            placeholder='ชื่อภาษาไทย'
                            value={formData.firstname}
                            onChange={handleChange}
                        />
                        {errors.firstname && <Message severity="error" text={errors.firstname} className="mt-2" />}
                    </div>

                    <div className="p-field mb-4">
                        <label htmlFor="lastname" className="block mb-2 font-semibold pi pi-user-edit"> นามสกุล</label>
                        <InputText
                            id="lastname"
                            type="text"
                            className="w-full"
                            placeholder='นามสกุลภาษาไทย'
                            value={formData.lastname}
                            onChange={handleChange}
                        />
                        {errors.lastname && <Message severity="error" text={errors.lastname} className="mt-2" />}
                    </div>
                    <div className="p-field mb-4">
                        <label htmlFor="email" className="block mb-2 font-semibold pi pi-envelope"> อีเมล</label>
                        <InputText
                            id="email"
                            type="text"
                            className="w-full"
                            placeholder='ที่อยู่อีเมล'
                            value={formData.email}
                            onChange={handleChange}
                        />
                        {errors.email && <Message severity="error" text={errors.email} className="mt-2" />}
                    </div>
                    <div className="p-field mb-4">
                        <label htmlFor="password" className="block mb-2 font-semibold pi pi-lock"> รหัสผ่าน</label>
                        <Password
                            id="password"
                            toggleMask
                            className="w-full"
                            placeholder='รหัสผ่านภาษาอังกฤษและตัวเลข'
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            promptLabel="กรอกรหัสผ่าน"
                            weakLabel="ง่ายเกินไป"
                            mediumLabel="ปลอดภัย"
                            strongLabel="ปลอดภัยมาก"
                        />
                        {errors.password && <Message severity="error" text={errors.password} className="mt-2" />}
                    </div>
                    <div className="p-field mb-6">
                        <label htmlFor="confirmPassword" className="block mb-2 font-semibold pi pi-lock"> ยืนยันรหัสผ่าน</label>
                        <Password
                            id="confirmPassword"
                            toggleMask
                            feedback={false}
                            className="w-full"
                            placeholder='ยืนยันรหัสผ่าน'
                            value={confirmPassword}
                            onChange={(e) => setConfirmPassword(e.target.value)}
                        />
                        {errors.confirmPassword && <Message severity="error" text={errors.confirmPassword} className="mt-2" />}
                    </div>
                    <Button label="สมัครสมาชิก" type="submit" className="w-full p-button-info mb-4" />
                </form>
                <div className="flex justify-content-center">
                    <a href="/login" className="text-500">ย้อนกลับ</a>
                </div>
            </div>
        </div>
    );
};

export default Register;
