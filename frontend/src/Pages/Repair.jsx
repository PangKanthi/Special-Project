import React, { useState } from 'react';
import { InputText } from 'primereact/inputtext';
import { Dropdown } from 'primereact/dropdown';
import { Button } from 'primereact/button';
import { InputTextarea } from 'primereact/inputtextarea';
import { FileUpload } from 'primereact/fileupload';
import 'primeflex/primeflex.css';

const Repair = () => {
  const [form, setForm] = useState({
    firstName: '',
    lastName: '',
    phone: '',
    province: '',
    district: '',
    postcode: '',
    address: '',
    additionalInfo: '',
  });

  const provinces = [
    { label: 'Bangkok', value: 'bangkok' },
    { label: 'Chiang Mai', value: 'chiangmai' },
  ];

  const handleInputChange = (e, field) => {
    setForm({
      ...form,
      [field]: e.target.value,
    });
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', paddingTop: '50px' }}>
      <h2 style={{ fontSize: '2rem', fontWeight: 'bold', marginBottom: '20px' }}>แจ้งซ่อม</h2>
      <div style={{ width: '100%', maxWidth: '1200px', backgroundColor: '#F5F5F5', padding: '2rem', borderRadius: '10px', boxShadow: '0 2px 8px rgba(0,0,0,0.1)' }}>
        <p style={{ color: 'red', fontSize: '18px', marginBottom: '1rem', textAlign: 'left', paddingLeft: '5px' }}>
          *หมายเหตุ กรุณาระบุให้ชัดเจนเพื่อป้องกันความผิดพลาด
        </p>
        <div style={{ maxWidth: '600px', margin: '0 auto' }}>
          <div className="p-fluid p-formgrid p-grid pt-5" style={{ justifyContent: 'center' }}>
            <div className="p-field p-col-6">
              <label htmlFor="firstName">ชื่อจริง</label>
              <div className='pt-2'>
                <InputText id="firstName" value={form.firstName} onChange={(e) => handleInputChange(e, 'firstName')} placeholder="*ชื่อจริง" />
              </div>
            </div>
            <div className="p-field p-col-6 pt-2">
              <label htmlFor="lastName">นามสกุล</label>
              <div className='pt-2'>
                <InputText id="lastName" value={form.lastName} onChange={(e) => handleInputChange(e, 'lastName')} placeholder="*นามสกุล" />
              </div>
            </div>
            <div className="p-field p-col-12 pt-2">
              <label htmlFor="phone">โทรศัพท์</label>
              <div className="p-inputgroup pt-2">
                <span className="p-inputgroup-addon">+66</span>
                <InputText id="phone" value={form.phone} onChange={(e) => handleInputChange(e, 'phone')} placeholder="*โทรศัพท์" />
              </div>
            </div>
            <div className="p-field p-col-6 pt-2">
              <label htmlFor="province">จังหวัด/เมือง</label>
              <div className='pt-2'>
                <Dropdown id="province" value={form.province} options={provinces} onChange={(e) => handleInputChange(e, 'province')} placeholder="*จังหวัด/เมือง" />
              </div>
            </div>
            <div className="p-field p-col-6 pt-2">
              <label htmlFor="district">เขต</label>
              <div className='pt-2'>
                <Dropdown id="district" value={form.district} options={provinces} onChange={(e) => handleInputChange(e, 'district')} placeholder="*เขต" />
              </div>
            </div>
            <div className="p-field p-col-6 pt-2">
              <label htmlFor="postcode">รหัสไปรษณีย์</label>
              <div className='pt-2'>
                <InputText id="postcode" value={form.postcode} onChange={(e) => handleInputChange(e, 'postcode')} placeholder="*รหัสไปรษณีย์" />
              </div>
            </div>
            <div className="p-field p-col-12 pt-2">
              <label htmlFor="address">ที่อยู่</label>
              <div className='pt-2'>
                <InputText id="address" value={form.address} onChange={(e) => handleInputChange(e, 'address')} placeholder="*ที่อยู่" />
              </div>
            </div>
            <div className="p-field p-col-12 pt-2">
              <label htmlFor="additionalAddress">อพาร์ทเมนท์ ห้องชุด (ไม่บังคับ)</label>
              <div className='pt-2'>
                <InputText id="additionalAddress" value={form.additionalAddress} onChange={(e) => handleInputChange(e, 'additionalAddress')} />
              </div>
            </div>
            <div className="p-field p-col-12 pt-2">
              <label>เพิ่มรูปภาพ</label>
              <div className='pt-2'>
                <FileUpload name="demo[]" mode="basic" accept="image/*" maxFileSize={1000000} chooseLabel="เพิ่มรูปภาพ" />
              </div>
            </div>
            <div className="p-field p-col-12 pt-2">
              <label htmlFor="additionalInfo">ข้อมูลเพิ่มเติม</label>
              <div className='pt-2'>
                <InputTextarea id="additionalInfo" value={form.additionalInfo} onChange={(e) => handleInputChange(e, 'additionalInfo')} rows={4} placeholder="*ข้อมูลเพิ่มเติม" />
              </div>
            </div>
          </div>
          <Button label="บันทึก" className="p-button-primary p-button-block" style={{ marginTop: '1rem' }} />
        </div>
      </div>
    </div >
  );
};

export default Repair;
