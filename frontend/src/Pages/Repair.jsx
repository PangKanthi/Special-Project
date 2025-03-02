import React, { useState } from 'react';
import { Button } from 'primereact/button';
import RepairForm from './Repair component/RepairForm';
import ImageUploader from './Repair component/ImageUploader';
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
    serviceType: '',
    orderId: ''
  });

  const [errors, setErrors] = useState({});

  const provinces = [
    { label: 'Bangkok', value: 'bangkok' },
    { label: 'Chiang Mai', value: 'chiangmai' },
  ];

  const districts = [
    { label: 'เขต 1', value: 'district_1' },
    { label: 'เขต 2', value: 'district_2' },
  ];

  const serviceTypes = [
    { label: 'ไฟฟ้า', value: 'electrical' },
    { label: 'ประปา', value: 'plumbing' },
    { label: 'เครื่องใช้ไฟฟ้า', value: 'appliance' }
  ];

  const orders = [
    { label: 'Order #001', value: 1 },
    { label: 'Order #002', value: 2 },
    { label: 'Order #003', value: 3 }
  ];

  // ฟังก์ชัน Validate ข้อมูล
  const validateThaiName = (name) => /^[\u0E00-\u0E7F\s]{1,50}$/.test(name);
  const validatePhone = (phone) => /^0[0-9]{9}$/.test(phone); // ตรวจสอบเบอร์ไทย
  const validateNotEmpty = (value) => value.trim() !== '';
  const validateNumeric = (value) => /^[0-9]+$/.test(value);

  const handleInputChange = (e, field) => {
    const value = e.target.value;
    setForm({
      ...form,
      [field]: value,
    });

    // ตรวจสอบค่าทันทีที่กรอก
    setErrors({
      ...errors,
      [field]: validateRepairField(field, value)
    });
  };

  // ฟังก์ชัน Validate แต่ละช่องแยกกัน
  const validateRepairField = (field, value) => {
    switch (field) {
      case "firstName":
      case "lastName":
        return validateThaiName(value) ? '' : 'กรุณากรอกชื่อเป็นภาษาไทย';
      case "phone":
        return validatePhone(value) ? '' : 'กรุณากรอกหมายเลขโทรศัพท์ให้ถูกต้อง';
      case "address":
        return validateNotEmpty(value) ? '' : 'กรุณากรอกที่อยู่';
      case "serviceType":
        return validateNotEmpty(value) ? '' : 'กรุณาเลือกประเภทการซ่อม';
      case "orderId":
        return validateNumeric(value) ? '' : 'หมายเลขคำสั่งซื้อต้องเป็นตัวเลข';
      case "problem_description":
        return validateNotEmpty(value) ? '' : 'กรุณากรอกรายละเอียดปัญหา';
      default:
        return '';
    }
  };


  const handleSubmit = async (e) => {
    e.preventDefault();

    const newErrors = validateRepairField(form);
    setErrors(newErrors);

    if (!Object.values(newErrors).some(error => error)) {
      console.log('ฟอร์มถูกต้อง:', form);
      // ทำการส่งข้อมูลไปเซิร์ฟเวอร์
    }
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', paddingTop: '50px' }}>
      <h2 style={{ fontSize: '2rem', fontWeight: 'bold', marginBottom: '20px' }}>แจ้งซ่อม</h2>
      <div style={{ width: '100%', maxWidth: '800px', backgroundColor: '#F5F5F5', padding: '2rem', borderRadius: '10px', boxShadow: '0 2px 8px rgba(0,0,0,0.1)' }}>
        <p style={{ color: 'red', fontSize: '18px', marginBottom: '1rem', textAlign: 'left', paddingLeft: '5px' }}>
          *หมายเหตุ กรุณาระบุให้ชัดเจนเพื่อป้องกันความผิดพลาด
        </p>
        <div style={{ maxWidth: '600px', margin: '0 auto' }}>
          <RepairForm
            form={form}
            handleInputChange={handleInputChange}
            provinces={provinces}
            districts={districts}
            serviceTypes={serviceTypes}
            orders={orders}
            errors={errors}
          />
          <ImageUploader />
        </div>

        <div className="flex justify-content-center">
          <Button label="บันทึก" className="p-button-primary p-button-block" style={{ marginTop: '1rem' }} onClick={handleSubmit} />
        </div>
      </div>
    </div>
  );
};

export default Repair;
