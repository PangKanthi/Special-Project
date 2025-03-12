import React, { useEffect, useState } from "react";
import { DataTable } from "primereact/datatable";
import { Column } from "primereact/column";
import { Tag } from "primereact/tag";
import { Button } from "primereact/button";
import axios from "axios";
import { InputText } from "primereact/inputtext";
import { Dialog } from "primereact/dialog";
import { confirmDialog } from "primereact/confirmdialog";
import { Dropdown } from "primereact/dropdown";
import useLocationData from "../../Hooks/useLocationData";

const API_USERS_URL = "http://localhost:1234/api/users";
const API_ADDRESSES_URL = "http://localhost:1234/api/addresses";

const UserTable = ({ users, onEdit, onDelete }) => {
  const { provinces, amphures, tambons } = useLocationData();
  const [userList, setUserList] = useState([]);
  const [selectedUser, setSelectedUser] = useState(null);
  const [addresses, setAddresses] = useState([]);
  const [dialogVisible, setDialogVisible] = useState(false);
  const [editDialogVisible, setEditDialogVisible] = useState(false);
  const [selectedProvince, setSelectedProvince] = useState(null);
  const [selectedAmphure, setSelectedAmphure] = useState(null);
  const [selectedTambon, setSelectedTambon] = useState(null);

  const [newAddress, setNewAddress] = useState({
    addressLine: "",
    province: "",
    district: "",
    subdistrict: "",
    postalCode: "",
  });

  const fetchUsers = async () => {
    try {
      const token = localStorage.getItem("token");

      // ดึงข้อมูล users
      const usersResponse = await axios.get(API_USERS_URL, {
        headers: { Authorization: `Bearer ${token}` },
      });

      setUserList(usersResponse.data);
    } catch (error) {
      console.error("❌ Error fetching users:", error);
    }
  };
  const fetchUserAddresses = async (userId) => {
    try {
      const token = localStorage.getItem("token");

      // ✅ ดึงข้อมูลเฉพาะของผู้ใช้ที่เลือก
      const response = await axios.get(
        `${API_ADDRESSES_URL}?userId=${userId}`,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      // ✅ กรองข้อมูลเฉพาะที่อยู่ของ userId ที่เลือก
      const userAddresses =
        response.data.data?.filter((address) => address.userId === userId) ||
        [];

      setAddresses(userAddresses);
    } catch (error) {
      console.error("❌ Error fetching addresses:", error);
    }
  };

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

  useEffect(() => {
    fetchUsers();
  }, []);

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

  const saveAddress = async () => {
    try {
      if (!selectedUser?.id) {
        console.error("❌ Error: selectedUser.id is undefined!");
        return;
      }

      const token = localStorage.getItem("token");

      // ✅ ตรวจสอบโครงสร้าง JSON ก่อนส่ง
      const addressPayload = {
        address: {
          userId: Number(selectedUser.id), // ✅ แปลงเป็น Number ให้แน่ใจ
          addressLine: newAddress.addressLine?.trim() || "",
          province: newAddress.province || "",
          district: newAddress.district || "",
          subdistrict: newAddress.subdistrict || "",
          postalCode: Number(newAddress.postalCode) || 0, // ✅ แปลงเป็นตัวเลข
          isPrimary: false,
          isShipping: false,
        },
      };

      console.log("📤 Sending address payload:", addressPayload); // ✅ ตรวจสอบค่าใน Console

      let response;
      if (newAddress.id) {
        response = await axios.put(
          `${API_ADDRESSES_URL}/${newAddress.id}`,
          addressPayload,
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );
      } else {
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
      fetchUserAddresses(selectedUser.id); // ✅ โหลดข้อมูลใหม่
    } catch (error) {
      console.error("❌ Error saving address:", error.response?.data || error);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  const deleteAddress = async (addressId) => {
    try {
      const token = localStorage.getItem("token");
      await axios.delete(`${API_ADDRESSES_URL}/${addressId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      fetchUserAddresses(selectedUser.id);
    } catch (error) {
      console.error("❌ Error deleting address:", error);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  return (
    <div className="bg-white shadow-md rounded-lg p-4">
      <DataTable
        value={userList}
        paginator
        rows={5}
        emptyMessage="No users found"
      >
        <Column field="id" header="ID" />
        <Column field="username" header="Username" />
        <Column field="firstname" header="First Name" />
        <Column field="lastname" header="Last Name" />
        <Column field="email" header="Email" />
        <Column field="phone" header="Phone" />

        <Column
          header="Addresses"
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
          header="Role"
          body={(rowData) => (
            <Tag
              value={rowData.role === "A" ? "Admin" : "User"}
              severity={rowData.role === "A" ? "danger" : "info"}
            />
          )}
        />
        <Column
          header="Action"
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
                    message: `Are you sure you want to delete ${rowData.firstname} ${rowData.lastname}?`,
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
      <Dialog
        header={newAddress.id ? "แก้ไขที่อยู่" : "เพิ่มที่อยู่ใหม่"}
        visible={editDialogVisible}
        style={{ width: "40vw" }}
        onHide={() => setEditDialogVisible(false)}
      >
        <div className="p-fluid">
          <label className="block font-semibold mb-1">ที่อยู่</label>
          <InputText
            value={newAddress.addressLine}
            onChange={(e) =>
              setNewAddress({ ...newAddress, addressLine: e.target.value })
            }
            className="w-full mb-2"
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
          <InputText
            value={newAddress.postalCode}
            readOnly
            className="w-full mb-2"
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
