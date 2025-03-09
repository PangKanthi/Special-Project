import React from "react";
import { Card } from "primereact/card";
import { FileUpload } from "primereact/fileupload";
import { ProgressSpinner } from "primereact/progressspinner";
import { Message } from "primereact/message";
import { Button } from "primereact/button";

function SlipPayment({
  form,
  setForm,
  loading,
  errorMessage,
  orderStatus,
  handleCheckSlip,
  handleOrderConfirmation,
}) {
  const handleImageUpload = (event) => {
    const uploadedFiles = event.files.map((file) => ({
      file,
      previewUrl: URL.createObjectURL(file),
    }));
    setForm((prevForm) => ({
      ...prevForm,
      images: [...prevForm.images, ...uploadedFiles],
    }));
  };

  const handleRemoveImage = (event) => {
    setForm((prevForm) => {
      const updatedImages = prevForm.images.filter(
        (image) => image.file.name !== event.file.name
      );
      return { ...prevForm, images: updatedImages };
    });
  };

  return (
    <div style={{ width: "100%" }}>
      <Card
        style={{
          width: "100%",
          maxWidth: "500px",
          height: "auto",
          maxHeight: "800px",
          borderRadius: "10px",
          padding: "20px",
          backgroundColor: "#f6f6f6",
        }}
      >
        <div>
          <p>บัญชี กสิกร</p>
        </div>
        <div>
          <p>เลขบัญชี 0591344439</p>
        </div>
        <div>
          <p>ชื่อบัญชี กันต์ธี จิตรแก้ว</p>
        </div>

        <div className="p-field p-col-12 pt-2">
          <label>เพิ่มรูปภาพสลิปโอนเงิน</label>
          <div className="pt-2">
            <FileUpload
              name="images"
              mode="advanced"
              accept="image/*"
              maxFileSize={1000000}
              customUpload
              uploadHandler={handleImageUpload}
              onRemove={handleRemoveImage}
              chooseLabel="เลือกไฟล์"
              auto
            />
          </div>
        </div>

        <h2 className="text-lg font-bold mt-4">สถานะการโอนเงิน</h2>

        {loading && (
          <ProgressSpinner style={{ width: "50px", height: "50px" }} />
        )}

        {!loading && orderStatus && (
          <div
            className={`p-3 rounded-lg mt-2 text-white ${
              orderStatus === "PAID" ? "bg-green-500" : "bg-yellow-500"
            }`}
          >
            {orderStatus === "PAID"
              ? "✅ การชำระเงินสำเร็จ"
              : "⏳ รอการตรวจสอบ"}
          </div>
        )}

        {errorMessage && (
          <Message severity="error" text={errorMessage} className="mt-2" />
        )}

        <div className="pt-3">
          <Button
            label="ตรวจสอบสลิป"
            onClick={handleCheckSlip}
            className="bg-yellow-500 text-white py-2 text-lg font-bold rounded"
          />
        </div>
        {!form.images.length && (
          <Message
            severity="warn"
            text="กรุณาอัปโหลดสลิปก่อนกดตรวจสอบ"
            className="mt-2"
          />
        )}
      </Card>

      <div className="md:text-center pt-5">
        <Button
          label="ยืนยันการสั่งซื้อ"
          onClick={handleOrderConfirmation}
          className="w-full bg-blue-600 text-white py-2 text-lg font-bold rounded"
        />
      </div>
    </div>
  );
}

export default SlipPayment;
