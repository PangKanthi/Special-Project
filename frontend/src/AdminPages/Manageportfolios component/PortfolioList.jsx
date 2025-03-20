import React, { useRef } from "react";
import { Card } from "primereact/card";
import { Button } from "primereact/button";
import { confirmDialog, ConfirmDialog } from "primereact/confirmdialog";
import { Toast } from "primereact/toast";

const PortfolioList = ({ portfolios, onDelete, onEdit }) => {
  const toast = useRef(null);
  const onDeleteWorkSample = async (id) => {

    const token = localStorage.getItem("token");

    try {
        onDelete(id);
    } catch (error) {
      console.error("Error deleting work sample:", error);
      toast.current.show({
        severity: "error",
        summary: "Error",
        detail: "Error deleting work sample",
        life: 3000,
      });
    }
  };

  const confirmDelete = (id) => {
    confirmDialog({
      message: "คุณแน่ใจหรือไม่ว่าต้องการลบงานนี้?",
      header: "Confirm Delete",
      icon: "pi pi-exclamation-triangle",
      acceptLabel: "Yes, Delete",
      rejectLabel: "Cancel",
      acceptClassName: "p-button-danger",
      accept: () => onDeleteWorkSample(id),
    });
  };

  return (
    <div>
      <ConfirmDialog />
      <Toast ref={toast} />

      <div className="grid lg:grid-cols-4 md:grid-cols-3 sm:grid-cols-2 grid-cols-1 gap-4">
        {portfolios.map((portfolio) => (
          <Card
            key={portfolio.id}
            className="shadow-md rounded-lg overflow-hidden max-w-sm mx-auto"
          >
            <div
              className="bg-gray-300 flex items-center justify-center mx-auto"
              style={{ width: "350px", height: "350px", objectFit: "cover" }}
            >
              {portfolio.images && portfolio.images.length > 0 ? (
                <img
                src={`${process.env.REACT_APP_API}${portfolio.images[0]}`}
                  alt="work"
                  className="w-full h-full object-cover"
                />
              ) : (
                <span className="text-gray-500">ไม่มีรูปภาพ</span>
              )}
            </div>

            <div className="p-4 text-center">
              <h5 className="font-bold text-lg">
                {portfolio.title || "XXXXX"}
              </h5>
              <p className="text-gray-500 text-sm truncate">
                {portfolio.description || "XXXXXXXXXXXXXXXXXXXXXXXXXX"}
              </p>
            </div>

            <div className="flex justify-content-center gap-2 p-3 border-t">
              <Button
                icon="pi pi-pencil"
                className="p-button-text p-button-sm"
                onClick={() => onEdit(portfolio)}
              />
              <Button
                icon="pi pi-trash"
                className="p-button-text p-button-danger p-button-sm"
                onClick={() => confirmDelete(portfolio.id)}
              />
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default PortfolioList;
