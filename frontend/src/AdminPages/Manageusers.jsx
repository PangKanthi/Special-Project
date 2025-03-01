import React, { useState } from "react";
import { ConfirmDialog, confirmDialog } from "primereact/confirmdialog";
import UserTable from "./Manageusers component/UserTable";
import UserDialog from "./Manageusers component/UserDialog";
import { InputText } from "primereact/inputtext";

const initialUsers = [
  { id: "00001", firstName: "Christine", lastName: "Brooks", address: "089 Kutch Green Apt. 448", email: "xxx@xxx.com", phone: "0xxxxxxxxx", position: "USER" },
  { id: "00002", firstName: "Rosie", lastName: "Pearson", address: "979 Immanuel Ferry Suite 526", email: "xxx@xxx.com", phone: "0xxxxxxxxx", position: "USER" },
  { id: "00003", firstName: "Darrell", lastName: "Caldwell", address: "8587 Frida Ports", email: "xxx@xxx.com", phone: "0xxxxxxxxx", position: "ADMIN" },
  { id: "00004", firstName: "Gilbert", lastName: "Johnston", address: "768 Destiny Lake Suite 600", email: "xxx@xxx.com", phone: "0xxxxxxxxx", position: "USER" },
];

const ManageUsers = () => {
  const [users, setUsers] = useState(initialUsers);
  const [search, setSearch] = useState("");
  const [editDialogVisible, setEditDialogVisible] = useState(false);
  const [editingUser, setEditingUser] = useState(null);

  const handleEditUser = () => {
    setUsers(users.map(user => (user.id === editingUser.id ? editingUser : user)));
    setEditDialogVisible(false);
  };

  const confirmDeleteUser = (id, name) => {
    confirmDialog({
      message: `Are you sure you want to delete ${name}?`,
      header: "Delete Confirmation",
      icon: "pi pi-exclamation-triangle",
      accept: () => setUsers(users.filter(user => user.id !== id)),
    });
  };

  return (
    <div className="p-6 min-h-screen bg-gray-100">
      <div className="flex items-center mb-4">
        <h1 className="text-2xl font-bold">User Management</h1>
        <div className="ml-auto w-72 pt-3">
          <span className="p-input-icon-left w-full flex items-center">
            <i className="pi pi-search pl-3 text-gray-500" />
            <InputText value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Search History" className="w-full pl-8" />
          </span>
        </div>
      </div>
      <ConfirmDialog />

      {/* ตารางแสดงข้อมูลผู้ใช้ */}
      <UserTable
        users={users.filter(user =>
          Object.values(user).some(value =>
            String(value).toLowerCase().includes(search.toLowerCase())
          )
        )} onEdit={(user) => { setEditingUser(user); setEditDialogVisible(true); }} onDelete={confirmDeleteUser}
      />

      {/* Dialog สำหรับแก้ไขข้อมูล */}
      <UserDialog
        editingUser={editingUser}
        visible={editDialogVisible}
        onHide={() => setEditDialogVisible(false)}
        onChange={setEditingUser}
        onSave={handleEditUser}
      />
    </div>
  );
};

export default ManageUsers;
