import React, { useState, useEffect } from 'react';
import { Dialog } from 'primereact/dialog';
import { Button } from 'primereact/button';
import { InputText } from 'primereact/inputtext';
import { FileUpload } from 'primereact/fileupload';

const PortfolioDialog = ({ visible, onClose, onWorkSampleAdded, onUpdate, selectedPortfolio }) => {
    const [description, setDescription] = useState("");
    const [images, setImages] = useState([]); // ✅ เก็บรูปทั้งหมด (ทั้งเก่าและใหม่)

    // ✅ โหลดข้อมูลเก่ามาแสดง
    useEffect(() => {
        if (selectedPortfolio) {
            setDescription(selectedPortfolio.description || "");
            setImages(selectedPortfolio.images || []);
        } else {
            setDescription("");
            setImages([]);
        }
    }, [selectedPortfolio]);

    // ✅ อัปโหลดรูปใหม่
    const onImageSelect = (event) => {
        const newFiles = event.files.map(file => ({
            file,
            previewUrl: URL.createObjectURL(file),
        }));

        setImages(prevImages => [...prevImages, ...newFiles.map(img => img.previewUrl)]);
    };

    // ✅ ลบรูปเก่าออก
    const handleRemoveImage = (index) => {
        setImages(images.filter((_, i) => i !== index));
    };

    // ✅ ฟังก์ชันจัดการเมื่อกด Submit
    const handleSubmit = (e) => {
        e.preventDefault(); // ✅ ป้องกันการรีเฟรชหน้า
        if (!description.trim() || images.length === 0) {
            alert("กรุณากรอกรายละเอียดและอัปโหลดรูปภาพ");
            return;
        }

        const workSample = {
            id: selectedPortfolio ? selectedPortfolio.id : Date.now(),
            title: `Sample ${Date.now()}`,
            description,
            images,
        };

        if (selectedPortfolio) {
            onUpdate(workSample);
        } else {
            onWorkSampleAdded(workSample);
        }

        setDescription("");
        setImages([]);
        onClose();
    };

    return (
        <Dialog header={selectedPortfolio ? "Edit Work Sample" : "Upload Work Sample"} visible={visible} onHide={onClose} style={{ width: "30vw" }}>
            {/* ✅ ใช้ form ครอบ Dialog */}
            <form onSubmit={handleSubmit}>
                <div className="p-6">
                    {/* ✅ แสดงรูปที่มีอยู่ข้างนอก FileUpload พร้อมปุ่มลบ */}
                    <div className="flex flex-wrap gap-2 mb-4">
                        {images.map((img, index) => (
                            <div key={index} className="relative">
                                <img src={img} alt={`uploaded-${index}`} className="w-20 h-20 object-cover rounded-md" style={{ width: "200px", height: "200px", objectFit: "cover" }} />
                                <Button 
                                    icon="pi pi-times"
                                    className="p-button-rounded p-button-danger p-button-sm absolute top-0 right-0"
                                    onClick={() => handleRemoveImage(index)} 
                                />
                            </div>
                        ))}
                    </div>

                    {/* ✅ FileUpload สำหรับอัปโหลดรูปใหม่ */}
                    <FileUpload 
                        multiple 
                        accept="image/*"
                        maxFileSize={1000000}
                        auto
                        customUpload
                        uploadHandler={onImageSelect}
                        chooseLabel="Choose Photos"
                        className="mb-4"
                    />

                    <div className="w-full mt-4">
                        <label className="block text-gray-700">Description</label>
                        <InputText
                            value={description}
                            onChange={(e) => setDescription(e.target.value)}
                            placeholder="Enter your description"
                            className="w-full mt-2 p-2 border rounded-lg"
                        />
                    </div>

                    <div className="flex justify-content-between w-full mt-6">
                        <Button type="button" label="Cancel" className="p-button-danger w-1/3" onClick={onClose} />
                        <Button type="submit" label={selectedPortfolio ? "Save" : "Add Now"} className="p-button-primary w-1/3" />
                    </div>
                </div>
            </form>
        </Dialog>
    );
};

export default PortfolioDialog;
