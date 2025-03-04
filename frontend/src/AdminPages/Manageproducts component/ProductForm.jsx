import React, { useRef } from "react";
import { Button } from "primereact/button";
import { InputText } from "primereact/inputtext";
import { FileUpload } from "primereact/fileupload";
import { MultiSelect } from "primereact/multiselect";
import { Dropdown } from "primereact/dropdown";
import { Dialog } from "primereact/dialog";

const ProductForm = ({
    visible,
    setVisible,
    editMode,
    newProduct,
    setNewProduct,
    handleInputChange,
    onImageUpload,
    handleSubmit,
    handleSaveEdit,
    categoryOptions,
    colorOptions,
}) => {
    const fileUploadRef = useRef(null);

    // ✅ ฟังก์ชันลบภาพทั้งจาก UI และ FileUpload
    const handleRemoveImage = (event) => {
        setNewProduct((prev) => {
            let updatedImages;

            if (event.file) {
                updatedImages = prev.images.filter(
                    (image) => image.file && image.file.name !== event.file.name
                );
            }
            else {
                updatedImages = prev.images.filter(
                    (image) => image.previewUrl !== event.previewUrl
                );
            }

            return { ...prev, images: updatedImages };
        });
    };

    // ✅ ลบภาพเมื่อใช้ปุ่ม Remove ของ FileUpload
    const onRemoveFile = (event) => {
        const fileToRemove = event.file;

        // ค้นหารูปที่มี `file` ตรงกับ `fileToRemove`
        setNewProduct(prev => {
            const updatedImages = prev.images.filter(img => img.file !== fileToRemove);
            return { ...prev, images: updatedImages };
        });
    };

    // ✅ รีเซ็ต Category Type เมื่อเปลี่ยน Product Type
    const handleProductTypeChange = (e) => {
        setNewProduct(prev => ({
            ...prev,
            is_part: e.value,
            category: "" // รีเซ็ตค่า Category Type
        }));
    };

    return (
        <Dialog
            header={editMode ? "Edit Product" : "Add New Product"}
            visible={visible}
            style={{ width: "50vw" }}
            draggable={false}
            onHide={() => setVisible(false)}
        >
            <form
                onSubmit={(e) => {
                    e.preventDefault();
                    editMode ? handleSaveEdit(e) : handleSubmit(e);
                }}
            >
                <div className="p-4">
                    <div className="flex-col items-center">
                        {/* ✅ แสดงรูปที่อัปโหลด */}
                        {newProduct.images.length > 0 && (
                            <div className="flex flex-wrap gap-2 mb-4">
                                {newProduct.images.map((img, index) => (
                                    <div key={index} className="relative">
                                        <img
                                            src={img.previewUrl || img}
                                            alt={`uploaded-${index}`}
                                            className="object-cover rounded-md"
                                            style={{ width: "200px", height: "200px", objectFit: "cover" }}
                                        />
                                        <Button
                                            icon="pi pi-times"
                                            className="p-button-rounded p-button-danger p-button-sm absolute top-0 right-0"
                                            onClick={(event) => handleRemoveImage(img, event)} // ✅ ส่ง event ไปให้ stopPropagation
                                        />
                                    </div>
                                ))}
                            </div>
                        )}

                        {/* ✅ FileUpload */}
                        <div className="w-full text-center mt-3">
                            <FileUpload
                                ref={fileUploadRef}
                                accept="image/png, image/jpeg"
                                maxFileSize={1000000}
                                multiple
                                auto
                                customUpload
                                uploadHandler={onImageUpload}
                                onRemove={onRemoveFile} // ✅ ลบไฟล์ออกจาก FileUpload และ UI
                                chooseLabel="Upload Images"
                            />
                        </div>
                    </div>

                    {/* ✅ ฟอร์มข้อมูลสินค้า */}
                    <div className="pt-3">
                        <label className="block">Product Name</label>
                        <InputText
                            name="name"
                            value={newProduct.name}
                            onChange={handleInputChange}
                            className="w-full"
                            required
                        />
                    </div>

                    <div className="pt-3">
                        <label className="block">Product Type</label>
                        <Dropdown
                            name="is_part"
                            value={newProduct.is_part}
                            options={[
                                { label: "ประตูม้วน", value: false },
                                { label: "อะไหล่ประตูม้วน", value: true },
                            ]}
                            onChange={handleProductTypeChange}
                            className="w-full"
                            placeholder="Select Product Type"
                        />
                    </div>

                    <div className="pt-3">
                        <label className="block">Category Type</label>
                        <Dropdown
                            name="category"
                            value={newProduct.category}
                            options={newProduct.is_part === false ? categoryOptions.shutter
                                : newProduct.is_part === true ? categoryOptions.shutter_parts
                                    : []}
                            onChange={handleInputChange}
                            className="w-full"
                            placeholder="Select Category Type"
                            disabled={newProduct.is_part === undefined || newProduct.is_part === ""}
                        />
                    </div>

                    <div className="pt-3">
                        <label className="block">Price</label>
                        <InputText
                            name="price"
                            value={newProduct.price}
                            onChange={handleInputChange}
                            className="w-full"
                            required
                        />
                    </div>

                    <div className="pt-3">
                        <label className="block">Stock Quantity</label>
                        <InputText
                            name="stock_quantity"
                            value={newProduct.stock_quantity}
                            onChange={handleInputChange}
                            className="w-full"
                            required
                        />
                    </div>

                    <div className="pt-3">
                        <label className="block">Available Colors</label>
                        <MultiSelect
                            name="colors"
                            value={newProduct.colors}
                            options={colorOptions}
                            onChange={handleInputChange}
                            optionLabel="label"
                            className="w-full"
                            placeholder="Select Colors"
                            display="chip"
                        />
                    </div>

                    <div className="pt-3">
                        <label className="block">Description</label>
                        <InputText
                            name="description"
                            value={newProduct.description}
                            onChange={handleInputChange}
                            className="w-full"
                        />
                    </div>

                    <div className="pt-3">
                        <label className="block">Warranty</label>
                        <InputText
                            name="warranty"
                            value={newProduct.warranty}
                            onChange={handleInputChange}
                            className="w-full"
                        />
                    </div>

                    <div className="flex justify-content-between mt-4">
                        <Button
                            label="Cancel"
                            className="p-button-danger"
                            onClick={() => setVisible(false)}
                            type="button"
                        />
                        <Button
                            label={editMode ? "Save Changes" : "Add Now"}
                            className="p-button-primary"
                            type="submit"
                        />
                    </div>
                </div>
            </form>
        </Dialog>
    );
};

export default ProductForm;
