import React, { useState, useEffect } from "react";
import { InputText } from "primereact/inputtext";
import { Dropdown } from "primereact/dropdown";
import { InputTextarea } from "primereact/inputtextarea";
import { Message } from "primereact/message";
import useLocationData from "../../Hooks/useLocationData";
import moment from "moment-timezone";

const problemOptions = [
  { label: "ประตูม้วนติดขัดด้านข้าง", value: "ประตูม้วนติดขัดด้านข้าง" },
  { label: "แผ่นประตูหลุดออกจากราง", value: "แผ่นประตูหลุดออกจากราง" },
  { label: "แผ่นประตูชำรุด/เสียหาย", value: "แผ่นประตูชำรุด" },
  { label: "รางประตูชำรุด/บิดงอ", value: "รางประตูชำรุด" },
  { label: "มอเตอร์ประตูม้วนขัดข้อง", value: "มอเตอร์ประตูม้วนขัดข้อง" },
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
  completedProducts,
  selectedProduct,
  setSelectedProduct,
}) => {
  // ✅ ใช้ Hook locationData ดึงจังหวัด/อำเภอ/ตำบล
  const { provinces, amphures, tambons } = useLocationData();

  const [selectedProvince, setSelectedProvince] = useState(null);
  const [selectedAmphure, setSelectedAmphure] = useState(null);
  const [selectedTambon, setSelectedTambon] = useState(null);
  const [defaultPrice, setDefaultPrice] = useState(null);

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

  useEffect(() => {
    const fetchDefaultPrice = async () => {
      try {
        const res = await fetch(
          `${process.env.REACT_APP_API}/api/repair-requests/default-repair-price`
        );
        const data = await res.json();
        if (res.ok) {
          setDefaultPrice(data.price);
          setForm((prevForm) => ({
            ...prevForm,
            repair_price: data.price, // ✅ กำหนดราคาลงใน form
          }));
        }
      } catch (err) {
        console.error("❌ ดึงราคาตั้งต้นล้มเหลว:", err);
      }
    };

    fetchDefaultPrice();
  }, []);

  return (
    <div
      className="p-fluid p-formgrid p-grid"
      style={{ justifyContent: "center" }}
    >
      {/* 🔸 ประเภทการซ่อม */}
      <div className="p-field p-col-12">
        <h3 className="text-right">
          ค่าซ่อมเริ่มต้น {defaultPrice?.toLocaleString("th-TH") || "..."} บาท
        </h3>
        {completedProducts.length > 0 && (
          <div className="p-field p-col-12 pt-2">
            <label htmlFor="product">เลือกสินค้าที่ต้องการแจ้งซ่อม</label>
            <Dropdown
              id="product"
              value={selectedProduct}
              options={completedProducts}
              onChange={(e) => setSelectedProduct(e.value)}
              optionLabel="name"
              placeholder="เลือกสินค้าที่เคยสั่งซื้อ"
              itemTemplate={(option) => (
                <div className="flex align-items-center">
                  {option.image && (
                    <img
                      src={`${process.env.REACT_APP_API}${option.image}`}
                      alt={option.name}
                      style={{ width: 40, marginRight: 10 }}
                      onError={(e) =>
                        (e.target.src = "https://via.placeholder.com/40")
                      }
                    />
                  )}
                  <span>{option.name}</span>
                </div>
              )}
            />
            {selectedProduct && (
              <div className="p-field p-col-12 border p-3 rounded bg-gray-100 mt-2">
                <p>
                  <strong>ชื่อสินค้า:</strong> {selectedProduct.name}
                </p>
                {Array.isArray(form.product_image) &&
                  form.product_image.map((img, index) => (
                    <img
                      key={index}
                      src={`${process.env.REACT_APP_API}${img}`}
                      alt={`รูปสินค้า ${index + 1}`}
                      style={{
                        width: "120px",
                        height: "100px",
                        objectFit: "cover",
                        marginRight: "10px",
                        borderRadius: "10px",
                      }}
                    />
                  ))}
                <p>
                  <strong>สี:</strong> {selectedProduct.color}
                </p>
                <p>
                  <strong>ขนาด:</strong> {selectedProduct.width} x{" "}
                  {selectedProduct.length} เมตร
                </p>
                <p>
                  <strong>ความหนา:</strong> {selectedProduct.thickness}
                </p>
                <p>
                  <strong>ตัวเลือกติดตั้ง:</strong>{" "}
                  {selectedProduct.installOption}
                </p>
                <p>
                  <strong>จำนวน:</strong> {selectedProduct.quantity}
                </p>
                <p>
                  <strong>ราคาต่อชิ้น:</strong>{" "}
                  {selectedProduct.price?.toLocaleString()} บาท
                </p>
                {selectedProduct.completedAt &&
                  selectedProduct.warranty &&
                  (() => {
                    // แปลงเวลา completedAt เป็นโซน Asia/Bangkok
                    const completedAtBangkok = moment
                      .utc(selectedProduct.completedAt)
                      .tz("Asia/Bangkok");
                    // บวกจำนวนปีของการรับประกันเพื่อคำนวณวันหมดอายุ
                    const expiryDate = completedAtBangkok
                      .clone()
                      .add(selectedProduct.warranty, "year");
                    // เปรียบเทียบกับเวลาปัจจุบันในโซน Asia/Bangkok
                    const isUnderWarranty = moment()
                      .tz("Asia/Bangkok")
                      .isBefore(expiryDate);
                    return (
                      <p>
                        <strong>สถานะประกัน:</strong>{" "}
                        {isUnderWarranty ? "อยู่ในประกัน" : "หมดประกัน"}
                      </p>
                    );
                  })()}

              </div>
            )}
          </div>
        )}
        <div className="pt-2">
          <label htmlFor="serviceType">ประเภทการซ่อม</label>
          <Dropdown
            id="serviceType"
            value={form.serviceType}
            options={serviceTypes}
            onChange={(e) => setForm({ ...form, serviceType: e.value })}
            placeholder="*เลือกประเภทบริการ"
          />
          {errors.serviceType && (
            <Message severity="error" text={errors.serviceType} />
          )}
        </div>
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
