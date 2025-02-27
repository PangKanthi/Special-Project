import React, { useState } from "react";
import { InputText } from "primereact/inputtext";
import { Button } from "primereact/button";
import { DataTable } from "primereact/datatable";
import { Column } from "primereact/column";
import { Tag } from "primereact/tag";
import "primereact/resources/themes/lara-light-blue/theme.css"; 
import "primereact/resources/primereact.min.css"; 
import "primeicons/primeicons.css"; 

const usersData = [
  { id: "00001", name: "Christine Brooks", address: "089 Kutch Green Apt. 448", email: "xxx@xxx.com", phone: "0xxxxxxxxx", position: "USER" },
  { id: "00002", name: "Rosie Pearson", address: "979 Immanuel Ferry Suite 526", email: "xxx@xxx.com", phone: "0xxxxxxxxx", position: "USER" },
  { id: "00003", name: "Darrell Caldwell", address: "8587 Frida Ports", email: "xxx@xxx.com", phone: "0xxxxxxxxx", position: "ADMIN" },
  { id: "00004", name: "Gilbert Johnston", address: "768 Destiny Lake Suite 600", email: "xxx@xxx.com", phone: "0xxxxxxxxx", position: "USER" },
  { id: "00005", name: "Alan Cain", address: "042 Mylene Throughway", email: "xxx@xxx.com", phone: "0xxxxxxxxx", position: "USER" },
  { id: "00006", name: "Alfred Murray", address: "543 Weinmann Mountain", email: "xxx@xxx.com", phone: "0xxxxxxxxx", position: "USER" },
  { id: "00007", name: "Maggie Sullivan", address: "New Scottieberg", email: "xxx@xxx.com", phone: "0xxxxxxxxx", position: "USER" },
  { id: "00008", name: "Rosie Todd", address: "New Jon", email: "xxx@xxx.com", phone: "0xxxxxxxxx", position: "USER" },
  { id: "00009", name: "Dollie Hines", address: "124 Lyla Forge Suite 975", email: "xxx@xxx.com", phone: "0xxxxxxxxx", position: "USER" },
];

const ManageUsers = () => {
  const [search, setSearch] = useState("");

  const filteredUsers = usersData.filter((user) =>
    user.name.toLowerCase().includes(search.toLowerCase())
  );

  const positionTemplate = (rowData) => {
    return (
      <Tag value={rowData.position} severity={rowData.position === "ADMIN" ? "danger" : "info"} />
    );
  };

  const actionTemplate = () => {
    return (
      <div className="flex gap-2">
        <Button icon="pi pi-pencil" className="p-button-rounded p-button-secondary p-button-text" />
        <Button icon="pi pi-trash" className="p-button-rounded p-button-danger p-button-text" />
      </div>
    );
  };

  return (
    <div className="p-6 min-h-screen bg-gray-100">
      <div className="flex justify-between items-center mb-4">
        <h1 className="text-2xl font-bold">User Management</h1>
        <div className="flex gap-4 items-center">
          <span className="p-input-icon-left">
            <i className="pi pi-search" />
            <InputText
              type="text"
              placeholder="Search User"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-72"
            />
          </span>
          <Button icon="pi pi-user-plus" label="Add New Member" className="p-button-primary" />
        </div>
      </div>

      <div className="bg-white shadow-md rounded-lg p-4">
        <DataTable value={filteredUsers} paginator rows={5} responsiveLayout="scroll">
          <Column field="id" header="ID" />
          <Column field="name" header="Name" />
          <Column field="address" header="Address" />
          <Column field="email" header="Email" />
          <Column field="phone" header="Phone" />
          <Column field="position" header="Position" body={positionTemplate} />
          <Column header="Action" body={actionTemplate} align="center" />
        </DataTable>
      </div>

      <div className="mt-4 text-gray-500 text-sm">
        Showing {filteredUsers.length} of {usersData.length}
      </div>
    </div>
  );
};

export default ManageUsers;
