import React from "react";
import { InputText } from "primereact/inputtext";
import { Dropdown } from "primereact/dropdown";
import { Message } from "primereact/message";
import { Button } from "primereact/button";

const AddressForm = ({
  newAddress,
  setNewAddress,
  selectedProvince,
  selectedAmphure,
  selectedTambon,
  filteredAmphures,
  filteredTambons,
  handleProvinceChange,
  handleAmphureChange,
  handleTambonChange,
  errors,
  saveAddress,
  provinces,
}) => {
  return (
    <div className="p-fluid">
      {/* ที่อยู่ */}
      <label className="block font-semibold mb-1 mt-3">* ที่อยู่</label>
      <InputText
        value={newAddress.addressLine}
        onChange={(e) =>
          setNewAddress({ ...newAddress, addressLine: e.target.value })
        }
        placeholder="บ้านเลขที่ ถนน ซอย"
        className="w-full mb-2"
      />
      {errors.addressLine && (
        <Message severity="error" text={errors.addressLine} />
      )}

      {/* จังหวัด */}
      <label className="block font-semibold mb-1 mt-2">* จังหวัด/เมือง</label>
      <Dropdown
        value={selectedProvince || null}
        options={provinces?.data || []}
        onChange={(e) => e.value && handleProvinceChange(e)}
        placeholder="เลือกจังหวัด"
        optionLabel="name_th"
        className="w-full mb-2"
      />
      {errors.province && <Message severity="error" text={errors.province} />}

      {/* เขต/อำเภอ */}
      <label className="block font-semibold mb-1 mt-2">* เขต/อำเภอ</label>
      <Dropdown
        value={selectedAmphure || null}
        options={filteredAmphures || []}
        onChange={(e) => e.value && handleAmphureChange(e)}
        placeholder="เลือกเขต"
        optionLabel="name_th"
        className="w-full mb-2"
      />
      {errors.district && <Message severity="error" text={errors.district} />}

      {/* ตำบล */}
      <label className="block font-semibold mb-1 mt-2">* ตำบล</label>
      <Dropdown
        value={selectedTambon || null}
        options={filteredTambons || []}
        onChange={(e) => e.value && handleTambonChange(e)}
        placeholder="เลือกตำบล"
        optionLabel="name_th"
        className="w-full mb-2"
      />
      {errors.subdistrict && (
        <Message severity="error" text={errors.subdistrict} />
      )}

      {/* รหัสไปรษณีย์ */}
      <label className="block font-semibold mb-1 mt-2">* รหัสไปรษณีย์</label>
      <InputText
        value={newAddress.postalCode}
        onChange={(e) =>
          setNewAddress({ ...newAddress, postalCode: e.target.value })
        }
        className="w-full mb-2"
      />
      {/* ปุ่มบันทึก */}
      <Button
        label="บันทึก"
        className="p-button-primary w-full mt-3"
        onClick={() => {
          saveAddress();
        }}
      />
    </div>
  );
};

export default AddressForm;
