import React from "react";
import { DataTable } from "primereact/datatable";
import { Column } from "primereact/column";
import { Tag } from "primereact/tag";
import { Button } from "primereact/button";

const UserTable = ({ users, onEdit, onDelete }) => {
  const positionTemplate = (rowData) => (
    <Tag value={rowData.position} severity={rowData.position === "ADMIN" ? "danger" : "info"} />
  );

  const actionTemplate = (rowData) => (
    <div className="flex justify-content-center gap-2">
      <Button icon="pi pi-pencil" className="p-button-rounded p-button-secondary p-button-text" onClick={() => onEdit(rowData)} />
      <Button icon="pi pi-trash" className="p-button-rounded p-button-danger p-button-text" onClick={() => onDelete(rowData.id, rowData.firstName + ' ' + rowData.lastName)} />
    </div>
  );

  return (
    <div className="bg-white shadow-md rounded-lg p-4">
      <DataTable value={users} paginator rows={5}>
        <Column field="id" header="ID" />
        <Column field="firstName" header="First Name" />
        <Column field="lastName" header="Last Name" />
        <Column field="address" header="Address" />
        <Column field="email" header="Email" />
        <Column field="phone" header="Phone" />
        <Column field="position" header="Position" body={positionTemplate} />
        <Column header="Action" body={actionTemplate} align="center" />
      </DataTable>
    </div>
  );
};

export default UserTable;
