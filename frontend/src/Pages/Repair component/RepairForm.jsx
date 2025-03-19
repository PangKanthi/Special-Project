import React, { useState } from "react";
import { InputText } from "primereact/inputtext";
import { Dropdown } from "primereact/dropdown";
import { InputTextarea } from "primereact/inputtextarea";
import { Message } from "primereact/message";
import useLocationData from "../../Hooks/useLocationData"; // Hook โหลดข้อมูลจังหวัด

const problemOptions = [
  { label: "ซ่อมเสีย", value: "ซ่อมเสีย" },
  { label: "แผ่นเสีย", value: "แผ่นเสีย" },
  { label: "รางเสีย", value: "รางเสีย" },
  { label: "มอเตอร์เสีย", value: "มอเตอร์เสีย" },
];

const RepairForm = ({
  form,
  setForm,
  addresses,
  selectedAddress,
  setSelectedAddress,
  handleAddressSelection,
  handleInputChange,
  serviceTypes,
  user,
  errors,
}) => {
  // ✅ ใช้ Hook locationData ดึงจังหวัด/อำเภอ/ตำบล
  const { provinces, amphures, tambons } = useLocationData();

  const [selectedProvince, setSelectedProvince] = useState(null);
  const [selectedAmphure, setSelectedAmphure] = useState(null);
  const [selectedTambon, setSelectedTambon] = useState(null);

  // ✅ เลือกปัญหาที่พบบ่อย
  const handleSelectProblem = (e) => {
    setForm((prev) => ({
      ...prev,
      problemDescription: e.value,
    }));
  };

  // ✅ คัดกรอง amphures/tambons ตามจังหวัด/อำเภอที่เลือก
  const filteredAmphures =
    amphures.data?.filter(
      (amphure) => amphure.province_id === selectedProvince?.id
    ) || [];

  const filteredTambons =
    tambons.data?.filter(
      (tambon) => tambon.amphure_id === selectedAmphure?.id
    ) || [];

  // ✅ ฟังก์ชันเปลี่ยนจังหวัด
  const handleProvinceChange = (e) => {
    setSelectedProvince(e.value);
    setSelectedAmphure(null);
    setSelectedTambon(null);
    handleInputChange(e, "province");
  };

  // ✅ ฟังก์ชันเปลี่ยนอำเภอ
  const handleAmphureChange = (e) => {
    setSelectedAmphure(e.value);
    setSelectedTambon(null);
    handleInputChange(e, "district");
  };

  // ✅ ฟังก์ชันเปลี่ยนตำบล
  const handleTambonChange = (e) => {
    setSelectedTambon(e.value);

    if (!e.value || !e.value.name_th) {
      return;
    }

    handleInputChange(
      { target: { id: "subdistrict", value: e.value.name_th } },
      "subdistrict"
    );
    handleInputChange(
      { target: { id: "postcode", value: e.value.zip_code } },
      "postcode"
    );
  };

  return (
    <div className="p-fluid p-formgrid p-grid pt-5" style={{ justifyContent: "center" }}>
      {/* 🔸 ประเภทการซ่อม */}
      <div className="p-field p-col-12 pt-3">
        <label htmlFor="serviceType">ประเภทการซ่อม</label>
        <Dropdown
          id="serviceType"
          value={form.serviceType}
          options={serviceTypes}
          onChange={(e) => handleInputChange(e, "serviceType")}
          placeholder="*เลือกประเภทบริการ"
        />
        {errors.serviceType && <Message severity="error" text={errors.serviceType} />}
      </div>

      {/* 🔸 รายละเอียดปัญหา */}
      <div className="p-field p-col-12 pt-3">
        <label htmlFor="problemDescription">รายละเอียดปัญหา</label>
        <Dropdown
          value={form.problemDescription || null}
          options={problemOptions}
          onChange={handleSelectProblem}
          placeholder="ปัญหาที่พบบ่อย"
          className="p-mb-2"
        />

        <InputTextarea
          id="problemDescription"
          value={form.problemDescription}
          onChange={(e) => handleInputChange(e, "problemDescription")}
          rows={3}
          placeholder="หรือพิมพ์รายละเอียดเพิ่มเติม"
        />

        {errors.problemDescription && (
          <Message severity="error" text={errors.problemDescription} />
        )}
      </div>

      {/* 🔹 Dropdown เลือกที่อยู่จัดส่ง */}
      <div className="p-fluid p-grid">
        <div className="p-field p-col-12 pt-3">
          <label htmlFor="address">เลือกที่อยู่จัดส่ง</label>
          <Dropdown
            placeholder="เลือกที่อยู่"
            value={selectedAddress ? selectedAddress.id : null}
            options={addresses}
            onChange={(e) => {
              const selected = addresses.find((addr) => addr.id === e.value);
              // ⬇️ เรียก handleAddressSelection (อัปเดต form + selectedAddress)
              handleAddressSelection(selected || null);
            }}
            optionLabel={(address) =>
              `${address.addressLine}, ตำบล${address.subdistrict}, อำเภอ${address.district}, จังหวัด${address.province}, ${address.postalCode}`
            }
            optionValue="id"
            className="w-full"
          />
        </div>

        {/* 🔹 แสดงรายละเอียดที่อยู่เฉพาะเมื่อมีการเลือกแล้ว */}
        {selectedAddress && (
          <div className="p-field p-col-12 border p-3 rounded bg-gray-100">
            <p>
              <strong>ที่อยู่:</strong> {selectedAddress.addressLine}, ตำบล
              {selectedAddress.subdistrict}, อำเภอ{selectedAddress.district},
              จังหวัด{selectedAddress.province}, {selectedAddress.postalCode}
            </p>
            <p>
              <strong>ชื่อ-นามสกุล:</strong> {user?.firstname} {user?.lastname}
            </p>
            <p>
              <strong>เบอร์โทร:</strong> {user?.phone}
            </p>
          </div>
        )}

        {/* 🔹 ถ้ายังไม่ได้เลือกที่อยู่ -> แสดงฟิลด์ให้กรอกเอง */}
        {!selectedAddress && (
          <>
            <div className="p-field p-col-12 pt-3">
              <label htmlFor="addressLine">ที่อยู่</label>
              <InputTextarea
                id="addressLine"
                value={form.addressLine}
                onChange={(e) => handleInputChange(e, "addressLine")}
                rows={2}
                placeholder="*บ้านเลขที่ ถนน ซอย"
              />
              {errors.addressLine && (
                <Message severity="error" text={errors.addressLine} />
              )}
            </div>

            <div className="p-field p-col-6 pt-3">
              <label htmlFor="province">จังหวัด/เมือง</label>
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
              {errors.province && (
                <Message severity="error" text={errors.province} />
              )}
            </div>

            <div className="p-field p-col-6 pt-3">
              <label htmlFor="district">เลือกเขต/อำเภอ</label>
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
              {errors.district && (
                <Message severity="error" text={errors.district} />
              )}
            </div>

            <div className="p-field p-col-6 pt-3">
              <label htmlFor="subdistrict">ตำบล</label>
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

            <div className="p-field p-col-6 pt-3">
              <label htmlFor="postcode">รหัสไปรษณีย์</label>
              <InputText
                id="postcode"
                value={form.postcode}
                readOnly
                placeholder="รหัสไปรษณีย์"
              />
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default RepairForm;
