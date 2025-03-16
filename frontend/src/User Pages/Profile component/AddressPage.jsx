import React, { useState } from "react";
import { Button } from "primereact/button";
import { Dialog } from "primereact/dialog";
import AddressForm from "./AddressPage component/AddressForm";
import useAddressForm from "./AddressPage component/useAddressForm";
import { DataTable } from "primereact/datatable";
import { Column } from "primereact/column";

const AddressPage = () => {
  const {
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
    validateForm,
    fetchAddresses,
    addresses,
    setAddresses,
    provinces,
    resetForm,
  } = useAddressForm();

  const [visible, setVisible] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [editIndex, setEditIndex] = useState(null);

  const handleSave = async () => {
    if (!validateForm()) return;

    try {
      if (isEditing && newAddress.id) {
        // PUT: อัปเดตที่อยู่
        const response = await fetch(
          `${process.env.REACT_APP_API}/api/addresses/${newAddress.id}`,
          {
            method: "PUT",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${localStorage.getItem("token")}`,
            },
            body: JSON.stringify({
              address: {
                addressLine: newAddress.addressLine,
                province: newAddress.province,
                district: newAddress.district,
                subdistrict: newAddress.subdistrict,
                postalCode: parseInt(newAddress.postalCode, 10),
              },
            }),
          }
        );
        if (!response.ok) throw new Error("Failed to update address");
      } else {
        const response = await fetch(`${process.env.REACT_APP_API}/api/addresses`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
          body: JSON.stringify({
            address: {
              addressLine: newAddress.addressLine,
              province: newAddress.province,
              district: newAddress.district,
              subdistrict: newAddress.subdistrict,
              postalCode: parseInt(newAddress.postalCode, 10),
            },
          }),
        });
      }

      setVisible(false);
      resetForm();
      fetchAddresses();
    } catch (error) {
      console.error("❌ Error saving address:", error);
    }
  };

  const handleEdit = (rowData) => {
    setNewAddress({
      id: rowData.id,
      addressLine: rowData.addressLine,
      province: rowData.province,
      district: rowData.district,
      subdistrict: rowData.subdistrict,
      postalCode: rowData.postalCode,
    });
    setIsEditing(true);
    setVisible(true);
  };

  const handleDelete = async (id) => {
    try {
      await fetch(`${process.env.REACT_APP_API}/api/addresses/${id}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });
      fetchAddresses(); // โหลดข้อมูลใหม่จาก backend
    } catch (error) {
      console.error("Error deleting address:", error);
    }
  };

  const actionTemplate = (rowData, { rowIndex }) => (
    <div className="flex gap-2">
      <Button
        label="แก้ไข"
        className="p-button-sm p-button-text p-button-secondary"
        onClick={() => handleEdit(rowData, rowIndex)}
      />
      <Button
        label="ลบ"
        className="p-button-sm p-button-text p-button-danger"
        onClick={() => handleDelete(rowData.id)}
      />
    </div>
  );

  return (
    <div className="p-4">
      <Button
        icon="pi pi-plus"
        label="เพิ่มที่อยู่ใหม่"
        onClick={() => {
          resetForm();
          setVisible(true);
        }}
      />
      <Dialog
        header={isEditing ? "แก้ไขที่อยู่" : "เพิ่มที่อยู่ใหม่"}
        visible={visible}
        draggable={false}
        style={{ width: "450px" }}
        onHide={() => {
          resetForm();
          setVisible(false);
        }}
      >
        <AddressForm
          {...{
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
            saveAddress: handleSave,
            validateForm,
            provinces,
            setAddresses,
          }}
        />
      </Dialog>

      <div className="mt-4">
        <DataTable value={addresses}>
          <Column field="addressLine" header="ที่อยู่"></Column>
          <Column field="province" header="จังหวัด"></Column>
          <Column field="district" header="เขต/อำเภอ"></Column>
          <Column field="subdistrict" header="ตำบล"></Column>
          <Column field="postalCode" header="รหัสไปรษณีย์"></Column>
          <Column body={actionTemplate} header="การกระทำ"></Column>
        </DataTable>
      </div>
    </div>
  );
};

export default AddressPage;
