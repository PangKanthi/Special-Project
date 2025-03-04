import React, { useState } from "react";
import { Button } from "primereact/button";
import { Dialog } from "primereact/dialog";
import AddressForm from "./AddressPage component/AddressForm";
import useAddressForm from "./AddressPage component/useAddressForm";
import { DataTable } from "primereact/datatable";
import { Column } from "primereact/column";

const AddressPage = () => {
    const {
        newAddress, setNewAddress, selectedProvince, selectedAmphure, selectedTambon,
        filteredAmphures, filteredTambons, handleProvinceChange, handleAmphureChange,
        handleTambonChange, errors, validateForm, addresses, setAddresses, provinces
    } = useAddressForm();

    const [visible, setVisible] = useState(false);
    const [isEditing, setIsEditing] = useState(false);
    const [editIndex, setEditIndex] = useState(null);

    const handleSave = () => {
        if (validateForm()) {
            if (isEditing && editIndex !== null) {
                const updatedAddresses = [...addresses];
                updatedAddresses[editIndex] = { ...newAddress };
                setAddresses(updatedAddresses);
            } else {
                setAddresses([...addresses, newAddress]);
            }
            setVisible(false);
            resetForm();
        }
    };

    const handleEdit = (rowData, index) => {
        setNewAddress({ ...rowData });
        setIsEditing(true);
        setEditIndex(index);
        setVisible(true);
    };

    const handleDelete = (index) => {
        setAddresses(addresses.filter((_, i) => i !== index));
    };

    const resetForm = () => {
        setNewAddress({
            firstName: "",
            lastName: "",
            phone: "",
            address: "",
            province: "",
            district: "",
            subDistrict: "",
            postalCode: "",
            apartment: "",
        });
        setIsEditing(false);
        setEditIndex(null);
    };

    const actionTemplate = (rowData, { rowIndex }) => (
        <div className="flex gap-2">
            <Button label="แก้ไข" className="p-button-sm p-button-text p-button-secondary" onClick={() => handleEdit(rowData, rowIndex)} />
            <Button label="ลบ" className="p-button-sm p-button-text p-button-danger" onClick={() => handleDelete(rowIndex)} />
        </div>
    );

    return (
        <div className="p-4">
            <Button icon="pi pi-plus" label="เพิ่มที่อยู่ใหม่" onClick={() => { resetForm(); setVisible(true); }} />
            <Dialog
                header={isEditing ? "แก้ไขที่อยู่" : "เพิ่มที่อยู่ใหม่"}
                visible={visible} style={{ width: "450px" }}
                onHide={() => 
                setVisible(false)}
            >
                <AddressForm {...{
                    newAddress, setNewAddress, selectedProvince, selectedAmphure, selectedTambon,
                    filteredAmphures, filteredTambons, handleProvinceChange, handleAmphureChange,
                    handleTambonChange, errors, saveAddress: handleSave, validateForm, provinces, setAddresses
                }} />
            </Dialog>

            <div className="mt-4">
                <DataTable value={addresses}>
                    <Column field="firstName" header="ชื่อจริง"></Column>
                    <Column field="lastName" header="นามสกุล"></Column>
                    <Column field="phone" header="เบอร์โทร"></Column>
                    <Column field="address" header="ที่อยู่"></Column>
                    <Column field="province" header="จังหวัด"></Column>
                    <Column field="district" header="เขต/อำเภอ"></Column>
                    <Column field="subDistrict" header="ตำบล"></Column>
                    <Column field="postalCode" header="รหัสไปรษณีย์"></Column>
                    <Column body={actionTemplate} header="การกระทำ"></Column>
                </DataTable>
            </div>
        </div>
    );
};

export default AddressPage;
