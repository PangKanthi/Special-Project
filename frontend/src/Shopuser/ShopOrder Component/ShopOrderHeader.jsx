import React from "react";
import { Button } from "primereact/button";
import { Dropdown } from "primereact/dropdown";

function ShopOrderHeader({
  addresses,
  address,
  selectedAddressIndex,
  setSelectedAddressIndex,
}) {
  // ถ้าไม่มีที่อยู่เลย
  if (!address) {
    return (
      <div className="lg:pl-5">
        <h1>สั่งซื้อ</h1>
        <div className="mb-3">
          <h3>ที่อยู่จัดส่ง</h3>
          <p>ยังไม่มีข้อมูลที่อยู่</p>
        </div>
      </div>
    );
  }

  const formatAddress = (addr) => {
    const line = addr.addressLine || "ไม่ระบุ";
    const apt = addr.apartment ? `, ${addr.apartment}` : "";
    const sd = addr.subdistrict ? `ต.${addr.subdistrict}` : "";
    const dt = addr.district ? `อ.${addr.district}` : "";
    const pv = addr.province ? `จ.${addr.province}` : "";
    const pc = addr.postalCode || "";
    return `${line}${apt}, ${sd}, ${dt}, ${pv} ${pc}`;
  };

  // เตรียม options สำหรับ PrimeReact Dropdown
  const addressOptions = addresses.map((addr, idx) => ({
    label: formatAddress(addr),
    value: idx, // เก็บ index
  }));

  // สร้างข้อความเต็มเพื่อแสดงในหน้า
  const fullAddress = formatAddress(address);

  return (
    <div className="lg:pl-5">
      <h1>สั่งซื้อ</h1>
      <div className="mb-3">
        <h3>เลือกที่อยู่ที่ต้องการจัดส่ง</h3>

        {addresses.length > 1 && (
          <div className="mb-2" style={{ maxWidth: "400px" }}>
            <Dropdown
              value={selectedAddressIndex}
              options={addressOptions}
              onChange={(e) => setSelectedAddressIndex(e.value)}
              placeholder="เลือกที่อยู่"
              className="w-full"
            />
          </div>
        )}

        <div
          style={{
            border: "1px solid #ddd",
            padding: "15px",
            backgroundColor: "#f9f9f9",
          }}
        >
          <p>
            <strong>{address.contactName || "ชื่อผู้รับ"}</strong> |{" "}
            {address.phone || "เบอร์โทร"}
          </p>
          <p>{fullAddress}</p>
        </div>
      </div>
    </div>
  );
}

export default ShopOrderHeader;
