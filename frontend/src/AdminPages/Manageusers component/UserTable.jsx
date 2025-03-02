import React, { useEffect, useState } from "react";
import { DataTable } from "primereact/datatable";
import { Column } from "primereact/column";
import { Tag } from "primereact/tag";
import { Button } from "primereact/button";
import axios from "axios";
import UserDialog from "./UserDialog";
import { confirmDialog } from "primereact/confirmdialog";

const API_BASE_URL = "http://localhost:1234/api/users";

const UserTable = ({ users, onEdit, onDelete }) => {
  const [setUsers] = useState([]);
  const [editingUser, setEditingUser] = useState(null);
  const [dialogVisible, setDialogVisible] = useState(false);

  const fetchUsers = async () => {
    try {
      const token = localStorage.getItem("token");

      const usersResponse = await axios.get(API_BASE_URL, {
        headers: { Authorization: `Bearer ${token}` },
      });

      setUsers(usersResponse.data);
    } catch (error) {

    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  const editUser = (user) => {
    setEditingUser(user);
    setDialogVisible(true);
  };

  const saveUser = async (updatedUser) => {
    if (!validateUserInput(updatedUser)) return;

    try {
      const { id, ...userData } = updatedUser;
      const userUrl = `${API_BASE_URL}/${id}`;

      await axios.put(userUrl, userData, {
        headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
      });

      fetchUsers();
      setDialogVisible(false);
    } catch (error) {
      
    }
  };

  const deleteUser = async (id, name) => {
    confirmDialog({
      message: `Are you sure you want to delete ${name}?`,
      header: "Confirm Deletion",
      icon: "pi pi-exclamation-triangle",
      accept: async () => {
        try {
          await axios.delete(`${API_BASE_URL}/${id}`, {
            headers: {
              Authorization: `Bearer ${localStorage.getItem("token")}`,
            },
          });
          fetchUsers();
        } catch (error) {
          
        }
      },
    });
  };

  const validateUserInput = (user) => {
    if (!user.username || user.username.length < 3) {
      alert("❌ Username ต้องมีอย่างน้อย 3 ตัวอักษร");
      return false;
    }
    if (!user.firstname || user.firstname.length < 2) {
      alert("❌ First Name ต้องมีอย่างน้อย 2 ตัวอักษร");
      return false;
    }
    if (!user.lastname || user.lastname.length < 2) {
      alert("❌ Last Name ต้องมีอย่างน้อย 2 ตัวอักษร");
      return false;
    }
    if (!user.email.includes("@") || !user.email.includes(".")) {
      alert("❌ กรุณากรอกอีเมลให้ถูกต้อง");
      return false;
    }
    if (user.phone && !/^\d{10}$/.test(user.phone)) {
      alert("❌ เบอร์โทรต้องเป็นตัวเลข 10 หลัก");
      return false;
    }
    return true;
  };

  return (
    <div className="bg-white shadow-md rounded-lg p-4">
      <DataTable value={users} paginator rows={5} emptyMessage="No users found">
        <Column field="id" header="ID" />
        <Column field="username" header="Username" />
        <Column field="firstname" header="First Name" />
        <Column field="lastname" header="Last Name" />
        <Column field="email" header="Email" />
        <Column field="phone" header="Phone" />
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
                    accept: () => onDelete(rowData.id), // ✅ เรียก onDelete
                  })
                }
              />
            </div>
          )}
        />
      </DataTable>
    </div>
  );
};

export default UserTable;
