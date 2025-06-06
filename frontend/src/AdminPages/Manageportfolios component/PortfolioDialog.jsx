import React, { useState, useRef, useEffect } from "react";
import { Dialog } from "primereact/dialog";
import { Button } from "primereact/button";
import { InputText } from "primereact/inputtext";
import { FileUpload } from "primereact/fileupload";

const API_URL = `${process.env.REACT_APP_API}/api/work-samples`; // 🔹 URL ของ Backend

const PortfolioDialog = ({
  visible,
  onClose,
  onWorkSampleAdded,
  onUpdate,
  selectedPortfolio,
  fetchPortfolios
}) => {
  const [localPortfolio, setLocalPortfolio] = useState(null);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [images, setImages] = useState([]);
  const [uploadedFiles, setUploadedFiles] = useState([]);
  const dialogRef = useRef(visible);

  useEffect(() => {
    if (selectedPortfolio) {
      setLocalPortfolio(selectedPortfolio);
      setTitle(selectedPortfolio.title || "");
      setDescription(selectedPortfolio.description || "");

      setImages(
        selectedPortfolio.images.map((img) =>
          img.startsWith("http")
            ? img
            : `${process.env.REACT_APP_API}/${img.startsWith("/") ? img.substring(1) : img
            }`
        )
      );

      setUploadedFiles([]);
    } else {
      setLocalPortfolio(null);
      setTitle("");
      setDescription("");
      setImages([]);
      setUploadedFiles([]);
    }
  }, [selectedPortfolio]);

  const onImageSelect = (event) => {
    const newFiles = event.files.map((file) => ({
      file,
      previewUrl: URL.createObjectURL(file),
    }));
    setUploadedFiles(newFiles);
  };

  const onRemoveFile = (event) => {
    const removedFile = event.file;
    setUploadedFiles((prevFiles) =>
      prevFiles.filter((f) => f.file !== removedFile)
    );
  };

  const handleRemoveImage = (index, e) => {
    e.preventDefault();
    e.stopPropagation();
    const updatedImages = [...images];
    updatedImages.splice(index, 1);
    setImages(updatedImages);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!title.trim() || !description.trim()) {
      alert("กรุณากรอกชื่อผลงานและคำอธิบาย");
      return;
    }

    const formData = new FormData();
    formData.append("title", title);
    formData.append("description", description);

    images.forEach((img) => {
      if (typeof img === "string" && img.trim() !== "") {
        formData.append("existingImages", img.replace(process.env.REACT_APP_API, ""));
      }
    });

    uploadedFiles.forEach((file) => {
      formData.append("images", file.file);
    });

    const token = localStorage.getItem("token");
    if (!token) {
      alert("คุณยังไม่ได้เข้าสู่ระบบ กรุณา Login ก่อน");
      return;
    }

    try {
      let response;


      if (localPortfolio) {
        response = await fetch(`${API_URL}/${localPortfolio.id}`, {
          method: "PUT",
          headers: {
            Authorization: `Bearer ${token}`,
          },
          body: formData,
        });
        if (response.status === 200) {
          const data = await response.json();
          onWorkSampleAdded(data)
          handleCloseDialog();
        }
      } else if (localPortfolio === null) {
        response = await fetch(API_URL, {
          method: "POST",
          headers: {
            Authorization: `Bearer ${token}`,
          },
          body: formData,
        });
        if (response.status === 201) {
          // const data = await response.json();
          // onWorkSampleAdded(data)
          fetchPortfolios();
          handleCloseDialog();
        }
      }


      // }

      // else {
      //   response = await fetch(API_URL, {
      //     method: "POST",
      //     headers: {
      //       Authorization: `Bearer ${token}`,
      //     },
      //     body: formData,
      //   });
      // }

      // const data = await response.json();
      // if (response.ok) {
      //   if (localPortfolio) {
      //     onUpdate(data);
      //   } else {
      //     onWorkSampleAdded(data);
      //   }
      //   handleCloseDialog();
      // } else {
      //   alert("Error: " + data.message);
      // }
    } catch (error) {
      console.error("Upload error:", error);
      alert("เกิดข้อผิดพลาดในการอัปโหลด");
    }
  };

  // ✅ ปิด Dialog และรีเซ็ตค่า
  const handleCloseDialog = () => {
    setTitle("");
    setDescription("");
    setImages([]);
    setUploadedFiles([]);
    onClose();
  };

  return (
    <Dialog
      header={localPortfolio ? "แก้ไขผลงาน" : "เพิ่มผลงานใหม่"}
      visible={visible}
      onHide={handleCloseDialog}
      style={{ width: "30vw" }}
      draggable={false}
      modal
      blockScroll
    >
      <form onSubmit={handleSubmit}>
        <div className="p-6">
          {/* ✅ Input สำหรับชื่อผลงาน */}
          <div className="w-full mb-4">
            <label className="block text-gray-700">ชื่อผลงาน</label>
            <InputText
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="ระบุชื่อผลงาน"
              className="w-full mt-2 p-2 border rounded-lg"
            />
          </div>

          {/* ✅ Input สำหรับคำอธิบาย */}
          <div className="w-full mb-4">
            <label className="block text-gray-700">คำอธิบายผลงาน</label>
            <InputText
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="ระบุคำอธิบายผลงาน"
              className="w-full mt-2 p-2 border rounded-lg"
            />
          </div>

          {images.length > 0 && (
            <div className="flex flex-wrap gap-2 mb-4">
              {images.map((img, index) => (
                <div key={index} className="relative">
                  <img
                    src={typeof img === "string" ? img : img.previewUrl}
                    alt={`uploaded-${index}`}
                    className="object-cover rounded-md"
                    style={{ width: "200px", height: "200px" }}
                  />
                  <Button
                    icon="pi pi-times"
                    className="p-button-rounded p-button-danger p-button-sm absolute top-0 right-0"
                    onClick={(e) => handleRemoveImage(index, e)}
                  />
                </div>
              ))}
            </div>
          )}

          <FileUpload
            multiple
            accept="image/*"
            maxFileSize={5000000}
            auto
            customUpload
            uploadHandler={onImageSelect}
            onRemove={onRemoveFile}
            chooseLabel="เลือกรูปภาพ"
            className="mb-4"
          />

          <div className="flex justify-content-between w-full mt-6">
            <Button
              type="button"
              label="ยกเลิก"
              className="p-button-danger w-1/3"
              onClick={handleCloseDialog}
            />
            <Button
              type="submit"
              label={localPortfolio ? "บันทึก" : "เพิ่มทันที"}
              className="p-button-primary w-1/3"
            />
          </div>
        </div>
      </form>
    </Dialog>
  );
};

export default PortfolioDialog;
