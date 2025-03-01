import React from "react";
import { Dialog } from "primereact/dialog";
import { InputText } from "primereact/inputtext";
import { Dropdown } from "primereact/dropdown";
import { Button } from "primereact/button";

const UserDialog = ({ editingUser, visible, onHide, onChange, onSave }) => {
    const positionOptions = [
        { label: "User", value: "USER" },
        { label: "Admin", value: "ADMIN" },
    ];

    return (
        <Dialog visible={visible} onHide={onHide}  draggable={false} blockScroll={true} header="Edit User" modal className="w-2/3">
            <div className="p-6 flex gap-4">
                <div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700">First Name</label>
                        <InputText
                            value={editingUser?.firstName || ""}
                            onChange={(e) => onChange({ ...editingUser, firstName: e.target.value })}
                            placeholder="Enter first name"
                            className="w-full mt-2"
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mt-3">Last Name</label>
                        <InputText
                            value={editingUser?.lastName || ""}
                            onChange={(e) => onChange({ ...editingUser, lastName: e.target.value })}
                            placeholder="Enter last name"
                            className="w-full mt-2"
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mt-3">Phone Number</label>
                        <InputText
                            value={editingUser?.phone || ""}
                            onChange={(e) => onChange({ ...editingUser, phone: e.target.value })}
                            placeholder="Enter phone number"
                            className="w-full mt-2"
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mt-3">Position</label>
                        <Dropdown
                            value={editingUser?.position || "USER"}
                            options={positionOptions}
                            onChange={(e) => onChange({ ...editingUser, position: e.value })}
                            className="w-full mt-2"
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mt-3">Your Email</label>
                        <InputText
                            value={editingUser?.email || ""}
                            onChange={(e) => onChange({ ...editingUser, email: e.target.value })}
                            placeholder="Enter your email"
                            className="w-full mt-2"
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mt-3">Address</label>
                        <InputText
                            value={editingUser?.address || ""}
                            onChange={(e) => onChange({ ...editingUser, address: e.target.value })}
                            placeholder="Enter address"
                            className="w-full mt-2"
                        />
                    </div>
                </div>
            </div>
            <div className="flex justify-content-center gap-4 mt-6">
                <Button label="Cancel" className="p-button-danger" onClick={onHide} />
                <Button label="Save" className="p-button-primary" onClick={onSave} />
            </div>
        </Dialog>
    );
};

export default UserDialog;
