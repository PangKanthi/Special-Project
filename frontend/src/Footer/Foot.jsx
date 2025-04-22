import React from "react";
import "primeflex/primeflex.css";
import { Divider } from "primereact/divider";

const Footer = () => {
  return (
    <div style={{
      backgroundColor: "#0a74da",
      color: "#ffffff",
      padding: "20px 10px",
      textAlign: "center",
      boxShadow: "0px -4px 8px rgba(0, 0, 0, 0.2)",
    }}>
      <div className="grid align-items-center">
        <div className="col-12 md:col-2 flex justify-content-center align-items-center">
          <div style={{
            backgroundColor: "#ffffff",
            padding: "12px",
            borderRadius: "10px",
            boxShadow: "0px 3px 6px rgba(0, 0, 0, 0.1)",
          }}>
            <img src="../assets/logo.png" alt="Company Logo" style={{ width: "80px" }} /> {/* ✅ ลดขนาดโลโก้ */}
          </div>
        </div>

        <div className="col-12 md:col-2 flex justify-content-center align-items-center">
          <h3 style={{ fontWeight: "bold", marginBottom: "0", fontSize: "16px" }}>หจก. ดีเดย์ ประตูม้วน (สำนักงานใหญ่)</h3>
        </div>

        <div className="col-12 md:col-3">
          <h4 style={{ fontSize: "14px", borderBottom: "1px solid #ffffff", display: "inline-block", paddingBottom: "3px" }}>เกี่ยวกับเรา</h4>
          <p style={{ fontSize: "12px", lineHeight: "1.4" }}>
            จำหน่ายติดตั้งประตูม้วนไฟฟ้าลิ่ม ระยอง ติดตั้งประตูม้วนทุกชนิด ใช้งานสะดวก ใช้วัสดุคุณภาพ ราคาไม่แพง
          </p>
          <p style={{ fontSize: "14px", fontWeight: "bold" }}>เบอร์โทร 083-015-1893</p>
        </div>

        <div className="col-12 md:col-3">
          <h4 style={{ fontSize: "14px", borderBottom: "1px solid #ffffff", display: "inline-block", paddingBottom: "3px" }}>ติดต่อเรา</h4>
          <p style={{ fontSize: "12px", lineHeight: "1.4" }}>ดีเดย์ ประตูม้วน ระยอง</p>
          <p style={{ fontSize: "12px" }}>422/63 หมู่ 5 ต.เขาคันทรง อ.ศรีราชา จ.ชลบุรี 20230</p>
          <p style={{ fontSize: "14px", fontWeight: "bold" }}>เบอร์โทร 086-033-5224</p>
          <p style={{ fontSize: "12px", color: "#ffeb3b", cursor: "pointer" }}>
            ✉ Email: Ddayshutter@Hotmail.com
          </p>
        </div>

        <div className="col-12 md:col-2">
          <h4 style={{ fontSize: "14px", borderBottom: "1px solid #ffffff", display: "inline-block", paddingBottom: "3px" }}>เวลาทำการ</h4>
          <p style={{ fontSize: "12px" }}>จันทร์-เสาร์</p>
          <p style={{ fontSize: "14px", fontWeight: "bold" }}>เวลา 8:30 - 17:30 น.</p>
        </div>
      </div>

      <Divider style={{ marginTop: "10px", backgroundColor: "#ffffff" }} />

      <p style={{ fontSize: "10px", opacity: "0.8" }}>
        © 2024 ดีเดย์ ประตูม้วน | All Rights Reserved
      </p>
    </div>
  );
};

export default Footer;
