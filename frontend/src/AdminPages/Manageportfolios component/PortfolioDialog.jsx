import React, { useState, useRef, useEffect } from 'react';
import { Dialog } from 'primereact/dialog';
import { Button } from 'primereact/button';
import { InputText } from 'primereact/inputtext';
import { FileUpload } from 'primereact/fileupload';

const PortfolioDialog = ({ visible, onClose, onWorkSampleAdded, onUpdate, selectedPortfolio }) => {
    const [localPortfolio, setLocalPortfolio] = useState(null);
    const [description, setDescription] = useState("");
    const [images, setImages] = useState([]);
    const imagesRef = useRef([]);
    const [uploadedFiles, setUploadedFiles] = useState([]);
    const dialogRef = useRef(visible); // ✅ ใช้ ref เพื่อตรวจสอบ visibility

    useEffect(() => {
        console.log("Dialog visibility changed:", visible);
        dialogRef.current = visible;
    }, [visible]);

    // ✅ โหลดข้อมูลเมื่อเปิด Dialog
    const handleOpenDialog = (portfolio) => {
        if (portfolio) {
            setLocalPortfolio(portfolio);
            setDescription(portfolio.description || "");
            imagesRef.current = [...portfolio.images];
            setImages([...imagesRef.current]);
            setUploadedFiles([]);
        } else {
            setLocalPortfolio(null);
            setDescription("");
            imagesRef.current = [];
            setImages([]);
            setUploadedFiles([]);
        }
    };

    // ✅ อัปโหลดรูปใหม่และแทนที่รูปเก่า
    const onImageSelect = (event) => {
        const newFiles = event.files.map(file => ({
            file,
            previewUrl: URL.createObjectURL(file),
        }));

        setUploadedFiles(newFiles);
        setImages(newFiles.map(img => img.previewUrl));
    };

    // ✅ ลบไฟล์ที่อัปโหลดใหม่
    const onRemoveFile = (event) => {
        const removedFile = event.file;
        setUploadedFiles(prevFiles => {
            const updatedFiles = prevFiles.filter(f => f.file !== removedFile);
            setImages(updatedFiles.map(f => f.previewUrl));
            return updatedFiles;
        });
    };

    // ✅ ลบรูปจากรายการ (ไม่ให้ Dialog ปิด)
    const handleRemoveImage = (index, e) => {
        e.preventDefault();
        e.stopPropagation();
        
        setTimeout(() => {
            setImages(prevImages => prevImages.filter((_, i) => i !== index));
        }, 0);
    };

    // ✅ บันทึกข้อมูลใหม่หรืออัปเดต
    const handleSubmit = (e) => {
        e.preventDefault();
        if (!description.trim() || (uploadedFiles.length === 0 && images.length === 0)) {
            alert("กรุณากรอกรายละเอียดและอัปโหลดรูปภาพ");
            return;
        }

        const finalImages = uploadedFiles.length > 0 ? uploadedFiles.map(f => f.previewUrl) : images;

        const workSample = {
            id: localPortfolio ? localPortfolio.id : Date.now(),
            title: `Sample ${Date.now()}`,
            description,
            images: finalImages,
        };

        if (localPortfolio) {
            onUpdate(workSample);
        } else {
            onWorkSampleAdded(workSample);
        }

        handleCloseDialog();
    };

    // ✅ ปิด Dialog และเคลียร์ค่า
    const handleCloseDialog = () => {
        setLocalPortfolio(null);
        setDescription("");
        imagesRef.current = [];
        setImages([]);
        setUploadedFiles([]);
        onClose();
    };

    return (
        <Dialog
            header={localPortfolio ? "Edit Work Sample" : "Upload Work Sample"}
            visible={visible}
            onHide={() => {
                console.log("Dialog is closing");
                handleCloseDialog();
            }}
            onShow={() => handleOpenDialog(selectedPortfolio)}
            style={{ width: "30vw" }}
            dismissableMask={false}
            modal={true}
            blockScroll={true}
        >
            <form onSubmit={handleSubmit}>
                <div className="p-6">
                    {images.length > 0 && (
                        <div className="flex flex-wrap gap-2 mb-4">
                            {images.map((img, index) => (
                                <div key={index} className="relative">
                                    <img src={img} alt={`uploaded-${index}`} className="object-cover rounded-md" style={{ width: "200px", height: "200px", objectFit: "cover" }} />
                                    <div 
                                        className="absolute top-0 right-0"
                                        onMouseDown={(e) => {
                                            e.preventDefault();
                                            e.stopPropagation();
                                        }}
                                    >
                                        <Button
                                            icon="pi pi-times"
                                            className="p-button-rounded p-button-danger p-button-sm"
                                            tabIndex={-1}
                                            onClick={(e) => handleRemoveImage(index, e)}
                                        />
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}

                    {/* ✅ FileUpload ที่ใช้เก็บไฟล์ใหม่ */}
                    <FileUpload
                        multiple
                        accept="image/*"
                        maxFileSize={1000000}
                        auto
                        customUpload
                        uploadHandler={onImageSelect}
                        onRemove={onRemoveFile}
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
                        <Button type="button" label="Cancel" className="p-button-danger w-1/3" onClick={handleCloseDialog} />
                        <Button type="submit" label={localPortfolio ? "Save" : "Add Now"} className="p-button-primary w-1/3" />
                    </div>
                </div>
            </form>
        </Dialog>
    );
};

export default PortfolioDialog;
