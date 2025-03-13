import { useEffect, useState } from "react";
import axios from "axios";
import { InputText } from "primereact/inputtext";
import { ConfirmDialog } from "primereact/confirmdialog";
import UserTable from "./Manageusers component/UserTable";
import UserDialog from "./Manageusers component/UserDialog";

const API_USERS_URL = "http://localhost:1234/api/users";

const ManageUsers = () => {
  const [users, setUsers] = useState([]);
  const [filteredUsers, setFilteredUsers] = useState([]);
  const [search, setSearch] = useState("");
  const [editingUser, setEditingUser] = useState(null);
  const [editDialogVisible, setEditDialogVisible] = useState(false);

  useEffect(() => {
    if (!search.trim()) {
      setFilteredUsers([...users].sort((a, b) => a.id - b.id));
    } else {
      const filtered = users.filter(
        (user) =>
          user.username?.toLowerCase().includes(search.toLowerCase()) ||
          user.firstname?.toLowerCase().includes(search.toLowerCase()) ||
          user.lastname?.toLowerCase().includes(search.toLowerCase()) ||
          user.email?.toLowerCase().includes(search.toLowerCase()) ||
          user.address?.toLowerCase().includes(search.toLowerCase())
      );
      setFilteredUsers(filtered.sort((a, b) => a.id - b.id));
    }
  }, [search, users]);

  const handleEditUser = (user) => {
    setEditingUser(user);
    setEditDialogVisible(true);
  };

  const handleSaveUser = async (updatedUser) => {
    try {
      const { id, ...userData } = updatedUser;
      await axios.put(`${API_USERS_URL}/${id}`, userData, {
        headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
      });

      setUsers(users.map((user) => (user.id === id ? updatedUser : user)));
      setEditDialogVisible(false);
    } catch (error) {}
  };

  const handleDeleteUser = async (id) => {
    try {
      await axios.delete(`${API_USERS_URL}/${id}`, {
        headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
      });

      setUsers(users.filter((user) => user.id !== id));
      setFilteredUsers(filteredUsers.filter((user) => user.id !== id));
    } catch (error) {}
  };

  return (
    <div className="p-6 min-h-screen bg-gray-100">
      <div className="flex items-center mb-4">
        <h1 className="text-2xl font-bold">การจัดการผู้ใช้</h1>
        <div className="ml-auto w-72 pt-3">
          <span className="p-input-icon-left w-full flex items-center">
            <i className="pi pi-search pl-3 text-gray-500" />
            <InputText
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="ค้นหาผู้ใช้"
              className="w-full pl-8"
            />
          </span>
        </div>
      </div>

      <ConfirmDialog />

      <UserTable
        users={filteredUsers}
        onEdit={handleEditUser}
        onDelete={handleDeleteUser}
      />

      <UserDialog
        editingUser={editingUser}
        visible={editDialogVisible}
        onHide={() => setEditDialogVisible(false)}
        onSave={handleSaveUser}
      />
    </div>
  );
};

export default ManageUsers;
