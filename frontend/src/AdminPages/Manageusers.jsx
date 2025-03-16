import { useEffect, useState } from "react";
import axios from "axios";
import { InputText } from "primereact/inputtext";
import { ConfirmDialog } from "primereact/confirmdialog";
import UserTable from "./Manageusers component/UserTable";
import UserDialog from "./Manageusers component/UserDialog";

const API_USERS_URL = "https://api.d-dayengineering.com/api/users";

const ManageUsers = () => {
  const [users, setUsers] = useState([]);
  const [filteredUsers, setFilteredUsers] = useState([]);
  const [search, setSearch] = useState("");
  const [editingUser, setEditingUser] = useState(null);
  const [editDialogVisible, setEditDialogVisible] = useState(false);

  // ➊ ดึงข้อมูลผู้ใช้ครั้งเดียวตอน mount
  useEffect(() => {
    fetchUsers(); // ฟังก์ชัน async ด้านล่าง
  }, []);

  const fetchUsers = async () => {
    try {
      const token = localStorage.getItem("token");
      const response = await axios.get(API_USERS_URL, {
        headers: { Authorization: `Bearer ${token}` },
      });

      // สมมติ response.data = อาร์เรย์ของ user
      setUsers(response.data);
      setFilteredUsers(response.data); // ตั้งค่าเริ่มต้นเหมือนกัน
    } catch (error) {
      console.error("Error fetching users:", error);
    }
  };

  // ➋ เมื่อ search หรือ users เปลี่ยน ให้กรองผู้ใช้แบบเรียลไทม์ใน Frontend
  useEffect(() => {
    const searchText = search.trim().toLowerCase();

    if (!searchText) {
      // ถ้าไม่มีข้อความค้นหา แสดงผู้ใช้ทั้งหมด
      setFilteredUsers([...users]);
    } else {
      const results = users.filter((user) => {
        return (
          (user.username || "").toLowerCase().includes(searchText) ||
          (user.firstname || "").toLowerCase().includes(searchText) ||
          (user.lastname || "").toLowerCase().includes(searchText) ||
          (user.email || "").toLowerCase().includes(searchText) ||
          (user.phone || "").toLowerCase().includes(searchText)
        );
      });
      setFilteredUsers(results);
    }
  }, [search, users]);

  // ➌ ฟังก์ชันแก้ไขผู้ใช้
  const handleEditUser = (user) => {
    setEditingUser(user);
    setEditDialogVisible(true);
  };

  // ➍ บันทึกผู้ใช้ (แค่ตัวอย่าง—ไม่เปลี่ยนเรื่องการกรอง)
  const handleSaveUser = async (updatedUser) => {
    try {
      const { id, ...userData } = updatedUser;
      await axios.put(`${API_USERS_URL}/${id}`, userData, {
        headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
      });

      // อัปเดต users ใน state
      setUsers((prev) =>
        prev.map((usr) => (usr.id === id ? updatedUser : usr))
      );
      setEditDialogVisible(false);
    } catch (error) {
      console.error(error);
    }
  };

  // ➎ ลบผู้ใช้
  const handleDeleteUser = async (id) => {
    try {
      await axios.delete(`${API_USERS_URL}/${id}`, {
        headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
      });
      setUsers((prev) => prev.filter((user) => user.id !== id));
    } catch (error) {
      console.error(error);
    }
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
              placeholder="ค้นหาข้อมูลผู้ใช้"
              className="w-full pl-8"
            />
          </span>
        </div>
      </div>

      <ConfirmDialog />

      {/* ➏ ส่งเฉพาะผลลัพธ์ที่กรองแล้วไปแสดงในตาราง */}
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
