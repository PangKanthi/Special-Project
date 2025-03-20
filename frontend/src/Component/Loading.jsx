import React, { useState, useEffect } from "react";
import { ProgressSpinner } from "primereact/progressspinner";

const Loading = () => {
  const [isDelayed, setIsDelayed] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsDelayed(true);
    }, 2000);

    return () => clearTimeout(timer);
  }, []);

  if (!isDelayed) {
    return (
      <div
        style={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          height: "100vh",
          flexDirection: "column",
          backgroundColor: "#f4f4f4",
        }}
      >
        <ProgressSpinner
          style={{ width: "50px", height: "50px" }}
          strokeWidth="8"
          animationDuration=".5s"
          aria-label="Loading"
        />
        <h3 style={{ marginTop: "20px", color: "#0a74da" }}>กำลังโหลด...</h3>
      </div>
    );
  }

  // หน้าโหลดสำเร็จแล้ว
  return (
    <div
      style={{
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        height: "100vh",
        flexDirection: "column",
        backgroundColor: "#f4f4f4",
      }}
    >
      <ProgressSpinner
        style={{ width: "50px", height: "50px" }}
        strokeWidth="8"
        animationDuration=".5s"
        aria-label="Loading"
      />
      <h3 style={{ marginTop: "20px", color: "#0a74da" }}>กำลังโหลดข้อมูล...</h3>
    </div>
  );
};

export default Loading;
