import React, { useState } from 'react';
import { InputText } from 'primereact/inputtext';
import { Dropdown } from 'primereact/dropdown';
import { InputTextarea } from 'primereact/inputtextarea';
import { Message } from 'primereact/message';
import useLocationData from '../../Hooks/useLocationData'; // ✅ นำเข้า Hook โหลดข้อมูลจังหวัด

const RepairForm = ({ form, handleInputChange, serviceTypes, orders, errors }) => {
    const { provinces, amphures, tambons } = useLocationData(); // ✅ โหลดข้อมูลจาก JSON
    const [selectedProvince, setSelectedProvince] = useState(null);
    const [selectedAmphure, setSelectedAmphure] = useState(null);
    const [selectedTambon, setSelectedTambon] = useState(null);

    // กรองอำเภอเฉพาะจังหวัดที่เลือก
    const filteredAmphures = amphures.data?.filter(amphure => amphure.province_id === selectedProvince?.id) || [];

    // กรองตำบลเฉพาะอำเภอที่เลือก
    const filteredTambons = tambons.data?.filter(tambon => tambon.amphure_id === selectedAmphure?.id) || [];

    // อัปเดตจังหวัดที่เลือก
    const handleProvinceChange = (e) => {
        setSelectedProvince(e.value);
        setSelectedAmphure(null);
        setSelectedTambon(null);
        handleInputChange(e, 'province');
    };

    // อัปเดตอำเภอที่เลือก
    const handleAmphureChange = (e) => {
        setSelectedAmphure(e.value);
        setSelectedTambon(null);
        handleInputChange(e, 'district');
    };

    // อัปเดตตำบลที่เลือกและตั้งค่ารหัสไปรษณีย์
    const handleTambonChange = (e) => {
        setSelectedTambon(e.value);
        handleInputChange({ target: { id: 'postcode', value: e.value.zip_code } }, 'postcode');
    };

    return (
        <div className="p-fluid p-formgrid p-grid pt-5" style={{ justifyContent: 'center' }}>
            <div className="p-field p-col-6">
                <label htmlFor="firstName">ชื่อจริง</label>
                <div className='pt-2'>
                    <InputText id="firstName" value={form.firstName} onChange={(e) => handleInputChange(e, 'firstName')} placeholder="*ชื่อจริง" />
                    {errors.firstName && <Message severity="error" text={errors.firstName} />}
                </div>
            </div>

            <div className="p-field p-col-6 pt-3">
                <label htmlFor="lastName">นามสกุล</label>
                <div className='pt-2'>
                    <InputText id="lastName" value={form.lastName} onChange={(e) => handleInputChange(e, 'lastName')} placeholder="*นามสกุล" />
                    {errors.lastName && <Message severity="error" text={errors.lastName} />}
                </div>
            </div>

            <div className="p-field p-col-12 pt-3">
                <label htmlFor="phone">โทรศัพท์</label>
                <div className="p-inputgroup pt-2">
                    <span className="p-inputgroup-addon">+66</span>
                    <InputText id="phone" value={form.phone} onChange={(e) => handleInputChange(e, 'phone')} placeholder="*โทรศัพท์" />
                    {errors.phone && <Message severity="error" text={errors.phone} />}
                </div>
            </div>

            {/* ที่อยู่หลัก (addressLine) */}
            <div className="p-field p-col-12 pt-3">
                <label htmlFor="addressLine">ที่อยู่จัดส่ง</label>
                <div className='pt-2'>
                    <InputTextarea id="addressLine" value={form.addressLine} onChange={(e) => handleInputChange(e, 'addressLine')} rows={2} placeholder="*บ้านเลขที่ ถนน ซอย" />
                    {errors.addressLine && <Message severity="error" text={errors.addressLine} />}
                </div>
            </div>

            {/* จังหวัด/เมือง */}
            <div className="p-field p-col-6 pt-3">
                <label htmlFor="province">จังหวัด/เมือง</label>
                <div className='pt-2'>
                    <Dropdown 
                        id="province" 
                        value={selectedProvince} 
                        options={provinces.data} 
                        onChange={handleProvinceChange} 
                        placeholder="*เลือกจังหวัด" 
                        optionLabel="name_th" 
                        className="w-full"
                        disabled={provinces.isLoading}
                    />
                    {errors.province && <Message severity="error" text={errors.province} />}
                </div>
            </div>

            {/* เขต/อำเภอ */}
            <div className="p-field p-col-6 pt-3">
                <label htmlFor="district">เขต/อำเภอ</label>
                <div className='pt-2'>
                    <Dropdown 
                        id="district" 
                        value={selectedAmphure} 
                        options={filteredAmphures} 
                        onChange={handleAmphureChange} 
                        placeholder="*เลือกเขต/อำเภอ" 
                        optionLabel="name_th" 
                        className="w-full"
                        disabled={!selectedProvince || amphures.isLoading}
                    />
                    {errors.district && <Message severity="error" text={errors.district} />}
                </div>
            </div>

            {/* ตำบล */}
            <div className="p-field p-col-6 pt-3">
                <label htmlFor="subdistrict">ตำบล</label>
                <div className='pt-2'>
                    <Dropdown 
                        id="subdistrict" 
                        value={selectedTambon} 
                        options={filteredTambons} 
                        onChange={handleTambonChange} 
                        placeholder="*เลือกตำบล" 
                        optionLabel="name_th" 
                        className="w-full"
                        disabled={!selectedAmphure || tambons.isLoading}
                    />
                </div>
            </div>

            {/* รหัสไปรษณีย์ */}
            <div className="p-field p-col-6 pt-3">
                <label htmlFor="postcode">รหัสไปรษณีย์</label>
                <div className='pt-2'>
                    <InputText id="postcode" value={form.postcode} readOnly placeholder="รหัสไปรษณีย์" />
                </div>
            </div>

            <div className="p-field p-col-12 pt-3">
                <label htmlFor="serviceType">ประเภทการซ่อม</label>
                <div className='pt-2'>
                    <Dropdown id="serviceType" value={form.serviceType} options={serviceTypes} onChange={(e) => handleInputChange(e, 'serviceType')} placeholder="*เลือกประเภทบริการ" />
                    {errors.serviceType && <Message severity="error" text={errors.serviceType} />}
                </div>
            </div>
        </div>
    );
};

export default RepairForm;
