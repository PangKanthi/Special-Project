import React from "react";
import { Dropdown } from "primereact/dropdown";

function ShopOrderHeader({
  addresses,
  selectedAddress,
  setSelectedAddress,
  setSelectedAddressIndex,
  user,
}) {
  if (!addresses || addresses.length === 0) {
    return (
      <div className="lg:pl-5">
        <h1 className="text-2xl font-bold">📦 รายละเอียดการจัดส่ง</h1>
        <div className="mb-3">
          <h3 className="text-lg font-semibold">🏠 ที่อยู่จัดส่ง</h3>
          <p className="text-red-500">
            ⚠️ ยังไม่มีข้อมูลที่อยู่ กรุณาเพิ่มที่อยู่ก่อนทำการสั่งซื้อ
          </p>
        </div>
      </div>
    );
  }

  const currentAddress = selectedAddress || addresses[0];

  return (
    <div className="lg:pl-5">
      <h1 className="text-2xl font-bold mb-3">รายละเอียดการจัดส่ง</h1>

      <div className="mb-3">
        <h3 className="text-lg font-semibold">เลือกที่อยู่จัดส่ง</h3>

        {addresses.length > 1 && (
          <div className="mb-2" style={{ maxWidth: "400px" }}>
            <Dropdown
              placeholder="เลือกที่อยู่"
              value={selectedAddress ? selectedAddress.id : null}
              options={addresses}
              onChange={(e) => {
                const selected = addresses.find((addr) => addr.id === e.value);
                setSelectedAddress(selected);
                setSelectedAddressIndex(addresses.indexOf(selected));
              }}
              optionLabel={(address) =>
                `${address.addressLine}, ตำบล${address.subdistrict}, อำเภอ${address.district}, จังหวัด${address.province}, ${address.postalCode}`
              }
              optionValue="id"
              className="w-full"
            />
          </div>
        )}

        <div className="border p-3 rounded bg-gray-100">
          <p>
            <strong>ที่อยู่ :</strong> {currentAddress.addressLine}, ตำบล
            {currentAddress.subdistrict}, อำเภอ{currentAddress.district},
            จังหวัด
            {currentAddress.province}, {currentAddress.postalCode}
          </p>
          <p>
            <strong>ชื่อ-นามสกุล:</strong> {user?.firstname} {user?.lastname}
          </p>
          <p>
            <strong>เบอร์โทร :</strong> {user?.phone}
          </p>
        </div>
      </div>
    </div>
  );
}

export default ShopOrderHeader;
