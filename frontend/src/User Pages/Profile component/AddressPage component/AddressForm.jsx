import React from "react";
import { InputText } from "primereact/inputtext";
import { Dropdown } from "primereact/dropdown";
import { Message } from "primereact/message";
import { Button } from "primereact/button";

const AddressForm = ({ newAddress, setNewAddress, selectedProvince, selectedAmphure, selectedTambon, filteredAmphures, filteredTambons, handleProvinceChange, handleAmphureChange, handleTambonChange, errors, saveAddress, provinces  }) => {
    return (
        <div className="p-fluid">
            {/* ชื่อจริง */}
            <label className="block font-semibold mb-1">* ชื่อจริง</label>
            <InputText value={newAddress.firstName} onChange={(e) => setNewAddress({ ...newAddress, firstName: e.target.value })} placeholder="กรอกชื่อจริง" className="w-full mb-2" />
            {errors.firstName && <Message severity="error" text={errors.firstName} />}

            {/* นามสกุล */}
            <label className="block font-semibold mb-1 mt-2">* นามสกุล</label>
            <InputText value={newAddress.lastName} onChange={(e) => setNewAddress({ ...newAddress, lastName: e.target.value })} placeholder="กรอกนามสกุล" className="w-full mb-2" />
            {errors.lastName && <Message severity="error" text={errors.lastName} />}

            {/* โทรศัพท์ */}
            <label className="block font-semibold mb-1 mt-2">* โทรศัพท์</label>
            <div className="flex">
                <span className="p-inputgroup-addon">+66</span>
                <InputText value={newAddress.phone} onChange={(e) => setNewAddress({ ...newAddress, phone: e.target.value })} placeholder="กรอกเบอร์โทรศัพท์" className="w-full" />
            </div>
            {errors.phone && <Message severity="error" text={errors.phone} className="mt-2" />}

            {/* ที่อยู่ */}
            <label className="block font-semibold mb-1 mt-3">* ที่อยู่</label>
            <InputText value={newAddress.address} onChange={(e) => setNewAddress({ ...newAddress, address: e.target.value })} placeholder="บ้านเลขที่ ถนน ซอย" className="w-full mb-2" />
            {errors.address && <Message severity="error" text={errors.address} />}

            {/* จังหวัด */}
            <label className="block font-semibold mb-1 mt-2">* จังหวัด/เมือง</label>
            <Dropdown value={selectedProvince} options={provinces?.data || []} onChange={handleProvinceChange} placeholder="เลือกจังหวัด" optionLabel="name_th" className="w-full mb-2" />
            {errors.province && <Message severity="error" text={errors.province} />}

            {/* เขต/อำเภอ */}
            <label className="block font-semibold mb-1 mt-2">* เขต/อำเภอ</label>
            <Dropdown value={selectedAmphure} options={filteredAmphures} onChange={handleAmphureChange} placeholder="เลือกเขต" optionLabel="name_th" className="w-full mb-2" disabled={!selectedProvince} />
            {errors.district && <Message severity="error" text={errors.district} />}

            {/* ตำบล */}
            <label className="block font-semibold mb-1 mt-2">* ตำบล</label>
            <Dropdown value={selectedTambon} options={filteredTambons} onChange={handleTambonChange} placeholder="เลือกตำบล" optionLabel="name_th" className="w-full mb-2" disabled={!selectedAmphure} />
            {errors.subDistrict && <Message severity="error" text={errors.subDistrict} />}

            {/* รหัสไปรษณีย์ */}
            <label className="block font-semibold mb-1 mt-2">* รหัสไปรษณีย์</label>
            <InputText value={newAddress.postalCode} readOnly className="w-full mb-2" />

            {/* ปุ่มบันทึก */}
            <Button label="บันทึก" className="p-button-primary w-full mt-3" onClick={saveAddress} />
        </div>
    );
};

export default AddressForm;
