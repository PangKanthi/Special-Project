import React, { useState, useRef, useEffect } from 'react';
import { Dialog } from 'primereact/dialog';
import { Button } from 'primereact/button';
import { InputText } from 'primereact/inputtext';
import { FileUpload } from 'primereact/fileupload';
import axios from 'axios';

const PortfolioDialog = ({ visible, onClose, onWorkSampleAdded }) => {
    const [images, setImages] = useState([]); 
    const [description, setDescription] = useState("");
    const [loading, setLoading] = useState(false);
    const fileUploadRef = useRef(null);

    useEffect(() => {
        if (!visible) {
            setImages([]);
            setDescription("");
        }
    }, [visible]);

    // ✅ ฟังก์ชันอัปโหลดรูปภาพ (ป้องกันการอัปโหลดซ้ำ)
    const onImageUpload = (event) => {
        console.log("📸 Images uploaded:", event.files);

        const uploadedFiles = event.files.map((file) => ({
            file,
            previewUrl: URL.createObjectURL(file),
        }));

        setImages((prevImages) => {
            const existingFiles = prevImages.map(img => img.file.name);
            const newFiles = uploadedFiles.filter(img => !existingFiles.includes(img.file.name));
            return [...prevImages, ...newFiles];
        });
    };

    // ✅ ฟังก์ชันลบรูปภาพที่เลือก
    const handleRemoveImage = (event) => {
        console.log("🗑 Removing image:", event.file.name);
        setImages((prevImages) =>
            prevImages.filter((img) => img.file.name !== event.file.name)
        );
    };

    // ✅ ฟังก์ชันส่งข้อมูลไป Backend (ใช้ images ที่เป็น array)
    const handleSubmit = async () => {
        if (!description || images.length === 0) {
            alert("กรุณากรอกรายละเอียดและอัปโหลดรูปภาพอย่างน้อย 1 รูป");
            return;
        }

        setLoading(true);
        try {
            const formData = new FormData();
            images.forEach(img => formData.append("images", img.file));  
            formData.append("description", description);

            // ✅ Debug: ดูว่า formData มีข้อมูลถูกต้องไหม
            for (let pair of formData.entries()) {
                console.log("📤 Sending data:", pair[0], pair[1]);
            }

            const response = await axios.post(`/api/work-samples`, formData, {
                headers: { "Content-Type": "multipart/form-data" }
            });

            alert("✅ เพิ่มผลงานสำเร็จ!");
            onWorkSampleAdded(response.data);
            setImages([]);
            setDescription("");
            onClose();
        } catch (error) {
            console.error("❌ Error uploading work sample:", error);
            alert("❌ เกิดข้อผิดพลาดในการอัปโหลด");
        } finally {
            setLoading(false);
        }
    };

    return (
        <Dialog header="Upload Work Sample" draggable={false} visible={visible} onHide={onClose} style={{ width: "30vw" }}>
            <div className="items-center gap-4 p-6">
                <div className="w-full text-center">
                    <FileUpload
                        ref={fileUploadRef}
                        mode="advanced"
                        multiple
                        accept="image/*"
                        maxFileSize={1000000}
                        customUpload
                        uploadHandler={onImageUpload}
                        chooseLabel="Upload Photos"
                        className="mb-4"
                        onRemove={handleRemoveImage}
                    />
                </div>

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
                    <Button label="Cancel" className="p-button-danger w-1/3" onClick={onClose} disabled={loading} />
                    <Button label={loading ? "Uploading..." : "Add Now"} className="p-button-primary w-1/3" onClick={handleSubmit} disabled={loading} />
                </div>
            </div>
        </Dialog>
    );
};

export default PortfolioDialog;
