import React, { useState } from 'react';
import { InputText } from 'primereact/inputtext';
import { Password } from 'primereact/password';
import { Button } from 'primereact/button';
import { Message } from 'primereact/message';
import 'primeflex/primeflex.css';

const Register = () => {
    const [formData, setFormData] = useState({
        name: '',
        surname: '',
        email: '',
    });

    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');

    const [errors, setErrors] = useState({
        name: '',
        surname: '',
        email: '',
        password: '',
        confirmPassword: ''
    });

    const validateName = (name) => /^[\u0E00-\u0E7F\s]{1,50}$/.test(name);
    const validateEmail = (email) => /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(email);
    const validatePassword = (password) => /^[A-Za-z0-9!@#$%^&*()_+]{6,24}$/.test(password);

    const handleChange = (e) => {
        const { id, value } = e.target;
        setFormData({ ...formData, [id]: value });
    };

    const handleSubmit = (e) => {
        e.preventDefault();

        const newErrors = {
            name: validateName(formData.name) ? '' : 'ชื่อต้องเป็นภาษาไทย',
            surname: validateName(formData.surname) ? '' : 'นามสกุลต้องเป็นภาษาไทย',
            email: validateEmail(formData.email) ? '' : 'รูปแบบอีเมลไม่ถูกต้อง',
            password: validatePassword(password) ? '' : 'รหัสผ่านต้องมีความยาว 6-24 ตัวอักษรและประกอบด้วยตัวอักษรและตัวเลข',
            confirmPassword: confirmPassword === password ? '' : 'รหัสผ่านไม่ตรงกัน'
        };

        setErrors(newErrors);

        if (!Object.values(newErrors).some(error => error)) {
            console.log('Form submitted successfully:', { ...formData, password });
        }
    };

    return (
        <div className="flex justify-content-center align-items-center" style={{ height: '80vh' }}>
            <div className="surface-card p-6 shadow-2 border-round-lg" style={{ width: '100%', maxWidth: '600px' }}>
                <h2 className="text-center mb-4 text-blue-600">สมัครสมาชิก</h2>
                <form className="p-fluid" onSubmit={handleSubmit}>
                    <div className="p-field mb-4">
                        <label htmlFor="name" className="block mb-2 font-semibold">ชื่อ</label>
                        <InputText
                            id="name"
                            type="text"
                            className="w-full"
                            placeholder='ชื่อภาษาไทย'
                            value={formData.name}
                            onChange={handleChange}
                        />
                        {errors.name && <Message severity="error" text={errors.name} className="mt-2"/>}
                    </div>
                    <div className="p-field mb-4">
                        <label htmlFor="surname" className="block mb-2 font-semibold">นามสกุล</label>
                        <InputText
                            id="surname"
                            type="text"
                            className="w-full"
                            placeholder='นามสกุลภาษาไทย'
                            value={formData.surname}
                            onChange={handleChange}
                        />
                        {errors.surname && <Message severity="error" text={errors.surname} className="mt-2"/>}
                    </div>
                    <div className="p-field mb-4">
                        <label htmlFor="email" className="block mb-2 font-semibold">อีเมล</label>
                        <InputText
                            id="email"
                            type="text"
                            className="w-full"
                            placeholder='ที่อยู่อีเมล'
                            value={formData.email}
                            onChange={handleChange}
                        />
                        {errors.email && <Message severity="error" text={errors.email} className="mt-2"/>}
                    </div>
                    <div className="p-field mb-4">
                        <label htmlFor="password" className="block mb-2 font-semibold">รหัสผ่าน</label>
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
                        {errors.password && <Message severity="error" text={errors.password} className="mt-2"/>}
                    </div>
                    <div className="p-field mb-6">
                        <label htmlFor="confirmPassword" className="block mb-2 font-semibold">ยืนยันรหัสผ่าน</label>
                        <Password
                            id="confirmPassword"
                            toggleMask
                            feedback={false}
                            className="w-full"
                            placeholder='ยืนยันรหัสผ่าน'
                            value={confirmPassword}
                            onChange={(e) => setConfirmPassword(e.target.value)}
                        />
                        {errors.confirmPassword && <Message severity="error" text={errors.confirmPassword} className="mt-2"/>}
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
