import React, { useState } from "react";
import { DataTable } from "primereact/datatable";
import { Column } from "primereact/column";
import { Tag } from "primereact/tag";
import { Button } from "primereact/button";
import { Dialog } from "primereact/dialog";
import { confirmDialog } from "primereact/confirmdialog";
import { Dropdown } from "primereact/dropdown";
import axios from "axios";
import useLocationData from "../../Hooks/useLocationData";

const API_ADDRESSES_URL = "http://localhost:1234/api/addresses";

const UserTable = ({ users, onEdit, onDelete }) => {
  const { provinces, amphures, tambons } = useLocationData();

  // จัดการ state ของ address dialog
  const [selectedUser, setSelectedUser] = useState(null);
  const [addresses, setAddresses] = useState([]);
  const [dialogVisible, setDialogVisible] = useState(false);

  // จัดการ state ของฟอร์ม address
  const [editDialogVisible, setEditDialogVisible] = useState(false);
  const [newAddress, setNewAddress] = useState({
    addressLine: "",
    province: "",
    district: "",
    subdistrict: "",
    postalCode: "",
  });
  const [selectedProvince, setSelectedProvince] = useState(null);
  const [selectedAmphure, setSelectedAmphure] = useState(null);
  const [selectedTambon, setSelectedTambon] = useState(null);

  // ➊ ฟังก์ชันโหลดที่อยู่ของผู้ใช้ (ตาม user.id) จาก server
  const fetchUserAddresses = async (userId) => {
    try {
      const token = localStorage.getItem("token");
      const response = await axios.get(`${API_ADDRESSES_URL}?userId=${userId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      const userAddresses =
        response.data.data?.filter((addr) => addr.userId === userId) || [];
      setAddresses(userAddresses);
    } catch (error) {
      console.error("❌ Error fetching addresses:", error);
    }
  };

  // ➋ เปิด Dialog “ดูที่อยู่” แล้วโหลดข้อมูล
  const openAddressDialog = async (user) => {
    setSelectedUser(user);
    setAddresses([]);
    await fetchUserAddresses(user.id);
    setDialogVisible(true);
  };

  const closeAddressDialog = () => {
    setSelectedUser(null);
    setAddresses([]);
    setDialogVisible(false);
  };

  // ➌ ฟังก์ชันเปิด Dialog “เพิ่ม/แก้ไขที่อยู่”
  const openEditDialog = (address = null) => {
    setNewAddress(
      address || {
        addressLine: "",
        province: "",
        district: "",
        subdistrict: "",
        postalCode: "",
      }
    );
    setSelectedProvince(null);
    setSelectedAmphure(null);
    setSelectedTambon(null);
    setEditDialogVisible(true);
  };

  // ➍ ฟังก์ชันจัดการเลือกจังหวัด/อำเภอ/ตำบล
  const handleProvinceChange = (e) => {
    setSelectedProvince(e.value);
    setSelectedAmphure(null);
    setSelectedTambon(null);
    setNewAddress({
      ...newAddress,
      province: e.value.name_th,
      district: "",
      subdistrict: "",
      postalCode: "",
    });
  };

  const handleAmphureChange = (e) => {
    setSelectedAmphure(e.value);
    setSelectedTambon(null);
    setNewAddress({
      ...newAddress,
      district: e.value.name_th,
      subdistrict: "",
      postalCode: "",
    });
  };

  const handleTambonChange = (e) => {
    setSelectedTambon(e.value);
    setNewAddress({
      ...newAddress,
      subdistrict: e.value.name_th,
      postalCode: String(e.value.zip_code || ""),
    });
  };

  // ➎ บันทึก/แก้ไขที่อยู่
  const saveAddress = async () => {
    try {
      if (!selectedUser?.id) {
        console.error("❌ Error: selectedUser.id is undefined!");
        return;
      }

      const token = localStorage.getItem("token");
      const addressPayload = {
        address: {
          userId: Number(selectedUser.id),
          addressLine: newAddress.addressLine?.trim() || "",
          province: newAddress.province || "",
          district: newAddress.district || "",
          subdistrict: newAddress.subdistrict || "",
          postalCode: Number(newAddress.postalCode) || 0,
          isPrimary: false,
          isShipping: false,
        },
      };

      let response;
      if (newAddress.id) {
        // อัปเดต
        response = await axios.put(
          `${API_ADDRESSES_URL}/${newAddress.id}`,
          addressPayload,
          { headers: { Authorization: `Bearer ${token}` } }
        );
      } else {
        // เพิ่มใหม่
        response = await axios.post(API_ADDRESSES_URL, addressPayload, {
          headers: { Authorization: `Bearer ${token}` },
        });
      }

      if (response.status === 200 || response.status === 201) {
        console.log("✅ Address saved successfully!");
      } else {
        console.error("❌ API response error:", response);
      }

      setEditDialogVisible(false);
      fetchUserAddresses(selectedUser.id); // โหลดใหม่
    } catch (error) {
      console.error("❌ Error saving address:", error.response?.data || error);
    }
  };

  // ➏ ลบที่อยู่
  const deleteAddress = async (addressId) => {
    try {
      const token = localStorage.getItem("token");
      await axios.delete(`${API_ADDRESSES_URL}/${addressId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      // โหลดข้อมูลใหม่
      fetchUserAddresses(selectedUser.id);
    } catch (error) {
      console.error("❌ Error deleting address:", error);
    }
  };

  // ➐ แสดงตาราง users ที่ส่งมาจาก ManageUsers (กรองแล้ว)
  return (
    <div className="bg-white shadow-md rounded-lg p-4">
      <DataTable value={users} paginator rows={5} emptyMessage="ไม่พบผู้ใช้">
        <Column field="id" header="ไอดีผู้ใช้" />
        <Column field="username" header="ชื่อผู้ใช้" />
        <Column field="firstname" header="ชื่อจริง" />
        <Column field="lastname" header="นามสกุล" />
        <Column field="email" header="อีเมล" />
        <Column field="phone" header="เบอร์โทรศัพท์" />

        <Column
          header="ที่อยู่"
          body={(rowData) => (
            <Button
              label="ดูที่อยู่"
              className="p-button-text p-button-sm"
              onClick={() => openAddressDialog(rowData)}
            />
          )}
        />
        <Column
          field="role"
          header="บทบาท"
          body={(rowData) => (
            <Tag
              value={rowData.role === "A" ? "Admin" : "User"}
              severity={rowData.role === "A" ? "danger" : "info"}
            />
          )}
        />
        <Column
          header="การจัดการ"
          body={(rowData) => (
            <div className="flex justify-content-center gap-2">
              <Button
                icon="pi pi-pencil"
                className="p-button-rounded p-button-secondary p-button-text"
                onClick={() => onEdit(rowData)}
              />
              <Button
                icon="pi pi-trash"
                className="p-button-rounded p-button-danger p-button-text"
                onClick={() =>
                  confirmDialog({
                    message: `ต้องการลบผู้ใช้ ${rowData.firstname} ${rowData.lastname} หรือไม่?`,
                    header: "Confirm Deletion",
                    icon: "pi pi-exclamation-triangle",
                    accept: () => onDelete(rowData.id),
                  })
                }
              />
            </div>
          )}
        />
      </DataTable>

      {/* Dialog แสดงที่อยู่ */}
      <Dialog
        header={`ที่อยู่ของ ${selectedUser?.firstname || ""} ${
          selectedUser?.lastname || ""
        }`}
        visible={dialogVisible}
        style={{ width: "50vw" }}
        onHide={closeAddressDialog}
      >
        <Button
          label="เพิ่มที่อยู่ใหม่"
          className="p-button-primary mb-3"
          onClick={() => openEditDialog()}
        />
        <DataTable value={addresses} emptyMessage="ไม่มีที่อยู่">
          <Column field="addressLine" header="ที่อยู่" />
          <Column field="province" header="จังหวัด" />
          <Column field="district" header="เขต/อำเภอ" />
          <Column field="subdistrict" header="ตำบล" />
          <Column field="postalCode" header="รหัสไปรษณีย์" />
          <Column
            header="การกระทำ"
            body={(rowData) => (
              <>
                <Button
                  label="แก้ไข"
                  className="p-button-text p-button-sm"
                  onClick={() => openEditDialog(rowData)}
                />
                <Button
                  label="ลบ"
                  className="p-button-text p-button-danger p-button-sm"
                  onClick={() => deleteAddress(rowData.id)}
                />
              </>
            )}
          />
        </DataTable>
      </Dialog>

      {/* Dialog เพิ่ม/แก้ไขที่อยู่ */}
      <Dialog
        header={newAddress.id ? "แก้ไขที่อยู่" : "เพิ่มที่อยู่ใหม่"}
        visible={editDialogVisible}
        style={{ width: "40vw" }}
        onHide={() => setEditDialogVisible(false)}
      >
        <div className="p-fluid">
          <label className="block font-semibold mb-1">ที่อยู่</label>
          <input
            type="text"
            value={newAddress.addressLine}
            onChange={(e) =>
              setNewAddress({ ...newAddress, addressLine: e.target.value })
            }
            className="p-inputtext w-full mb-2"
          />

          <label className="block font-semibold mb-1">จังหวัด</label>
          <Dropdown
            value={selectedProvince}
            options={provinces?.data || []}
            onChange={handleProvinceChange}
            placeholder="เลือกจังหวัด"
            optionLabel="name_th"
            className="w-full mb-2"
          />

          <label className="block font-semibold mb-1">เขต/อำเภอ</label>
          <Dropdown
            value={selectedAmphure}
            options={
              amphures?.data.filter(
                (a) => a.province_id === selectedProvince?.id
              ) || []
            }
            onChange={handleAmphureChange}
            placeholder="เลือกเขต"
            optionLabel="name_th"
            className="w-full mb-2"
          />

          <label className="block font-semibold mb-1">ตำบล</label>
          <Dropdown
            value={selectedTambon}
            options={
              tambons?.data.filter(
                (t) => t.amphure_id === selectedAmphure?.id
              ) || []
            }
            onChange={handleTambonChange}
            placeholder="เลือกตำบล"
            optionLabel="name_th"
            className="w-full mb-2"
          />

          <label className="block font-semibold mb-1">รหัสไปรษณีย์</label>
          <input
            type="text"
            value={newAddress.postalCode}
            readOnly
            className="p-inputtext w-full mb-2"
          />

          <Button
            label="บันทึก"
            className="p-button-primary w-full mt-3"
            onClick={saveAddress}
          />
        </div>
      </Dialog>
    </div>
  );
};

export default UserTable;
