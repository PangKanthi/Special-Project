import React, { useEffect, useState } from "react";
import { Dialog } from "primereact/dialog";
import { InputText } from "primereact/inputtext";
import { Dropdown } from "primereact/dropdown"; // ✅ เพิ่ม Dropdown
import { Button } from "primereact/button";

const UserDialog = ({ editingUser, visible, onHide, onSave }) => {
  const [localUser, setLocalUser] = useState({});
  const [errorMessages, setErrorMessages] = useState({});

  // ✅ รายการ Role ที่เลือกได้
  const roleOptions = [
    { label: "User", value: "U" },
    { label: "Admin", value: "A" },
  ];

  useEffect(() => {
    if (editingUser) {
      setLocalUser({
        id: editingUser.id,
        username: editingUser.username || "",
        firstname: editingUser.firstname || "",
        lastname: editingUser.lastname || "",
        phone: editingUser.phone || "",
        email: editingUser.email || "",
        role: editingUser.role || "U", // ✅ ตั้งค่า Default เป็น "User"
      });
    }
  }, [editingUser]);

  const handleChange = (key, value) => {
    setLocalUser((prev) => ({
      ...prev,
      [key]: value,
    }));

    setErrorMessages((prev) => ({
      ...prev,
      [key]: validateField(key, value),
    }));
  };

  const validateField = (key, value) => {
    switch (key) {
      case "username":
        return value.length >= 3
          ? ""
          : "❌ Username ต้องมีอย่างน้อย 3 ตัวอักษร";
      case "firstname":
        return value.length >= 2
          ? ""
          : "❌ First Name ต้องมีอย่างน้อย 2 ตัวอักษร";
      case "lastname":
        return value.length >= 2
          ? ""
          : "❌ Last Name ต้องมีอย่างน้อย 2 ตัวอักษร";
      case "email":
        return /\S+@\S+\.\S+/.test(value) ? "" : "❌ กรุณากรอกอีเมลให้ถูกต้อง";
      case "phone":
        return value === "" || /^\d{10}$/.test(value)
          ? ""
          : "❌ เบอร์โทรต้องเป็นตัวเลข 10 หลัก";
      case "role":
        return ["U", "A"].includes(value)
          ? ""
          : "❌ กรุณาเลือก Role ที่ถูกต้อง";
      default:
        return "";
    }
  };

  const handleSave = () => {
    const newErrors = {
      username: validateField("username", localUser.username),
      firstname: validateField("firstname", localUser.firstname),
      lastname: validateField("lastname", localUser.lastname),
      email: validateField("email", localUser.email),
      phone: validateField("phone", localUser.phone),
      role: validateField("role", localUser.role),
    };

    setErrorMessages(newErrors);

    if (Object.values(newErrors).some((msg) => msg !== "")) {
      alert("กรุณากรอกข้อมูลให้ถูกต้องก่อนบันทึก!");
      return;
    }

    onSave(localUser);
  };

  return (
    <Dialog
      visible={visible}
      onHide={onHide}
      header="Edit User"
      modal
      className="w-auto"
      draggable={false}
    >
      <div className="p-6 flex flex-column gap-4 w-auto">
        <div>
          <label className="block text-sm font-medium w-11">Username</label>
          <InputText
            value={localUser.username}
            onChange={(e) => handleChange("username", e.target.value)}
            placeholder="Enter username"
            className="w-full mt-2"
          />
          {errorMessages.username && (
            <p className="text-red-500">{errorMessages.username}</p>
          )}
        </div>
        <div>
          <label className="block text-sm font-medium">First Name</label>
          <InputText
            value={localUser.firstname}
            onChange={(e) => handleChange("firstname", e.target.value)}
            placeholder="Enter first name"
            className="w-full mt-2"
          />
          {errorMessages.firstname && (
            <p className="text-red-500">{errorMessages.firstname}</p>
          )}
        </div>
        <div>
          <label className="block text-sm font-medium">Last Name</label>
          <InputText
            value={localUser.lastname}
            onChange={(e) => handleChange("lastname", e.target.value)}
            placeholder="Enter last name"
            className="w-full mt-2"
          />
          {errorMessages.lastname && (
            <p className="text-red-500">{errorMessages.lastname}</p>
          )}
        </div>
        <div>
          <label className="block text-sm font-medium">Phone</label>
          <InputText
            value={localUser.phone}
            onChange={(e) => handleChange("phone", e.target.value)}
            placeholder="Enter phone number"
            className="w-full mt-2"
          />
          {errorMessages.phone && (
            <p className="text-red-500">{errorMessages.phone}</p>
          )}
        </div>
        <div>
          <label className="block text-sm font-medium">Email</label>
          <InputText
            value={localUser.email}
            onChange={(e) => handleChange("email", e.target.value)}
            placeholder="Enter email"
            className="w-full mt-2"
          />
          {errorMessages.email && (
            <p className="text-red-500">{errorMessages.email}</p>
          )}
        </div>
        <div>
          <label className="block text-sm font-medium">Role</label>
          <Dropdown
            value={localUser.role}
            options={roleOptions}
            onChange={(e) => handleChange("role", e.value)}
            placeholder="Select Role"
            className="w-full mt-2"
          />
          {errorMessages.role && (
            <p className="text-red-500">{errorMessages.role}</p>
          )}
        </div>
        <div className="flex justify-center gap-2 mt-6">
          <Button label="Cancel" className="p-button-danger" onClick={onHide} />
          <Button
            label="Save"
            className="p-button-primary"
            onClick={handleSave}
          />
        </div>
      </div>
    </Dialog>
  );
};

export default UserDialog;
