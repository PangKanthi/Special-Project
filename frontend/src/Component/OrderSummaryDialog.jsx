import React, { useState } from "react";
import { Dialog } from "primereact/dialog";
import { DataTable } from "primereact/datatable";
import { Column } from "primereact/column";
import { Button } from "primereact/button";
import jsPDF from "jspdf";
import html2canvas from "html2canvas";

const OrderSummaryDialog = ({
  visible,
  onHide,
  selectedOrder,
  bomDetailsMap,
}) => {
  const [expandedRows, setExpandedRows] = useState(null);
  const isOnlyParts = selectedOrder.order_items.every(item => item.product.is_part);
  const rowExpansionTemplate = (data) => {
    if (data.product.is_part) return null;
    const bomDetails =
      bomDetailsMap && bomDetailsMap[data.id] ? bomDetailsMap[data.id] : [];
    return (
      <div className="p-3">
        <h5
          style={{ fontSize: "20px", marginBottom: "0.5rem", color: "black" }}
        >
          รายการอะไหล่ (BOM)
        </h5>
        {bomDetails.length > 0 ? (
          <DataTable value={bomDetails}>
            <Column
              header="ชื่ออะไหล่"
              body={(rowData) => rowData?.part?.name || "-"}
              style={{ fontSize: "18px", color: "black" }}
            />
            <Column
              header="จำนวนที่ใช้"
              body={(rowData) => rowData.quantity ?? "-"}
              style={{ fontSize: "18px", color: "black" }}
            />
            <Column
              header="หน่วย"
              field="unit"
              style={{ fontSize: "18px", color: "black" }}
            />
          </DataTable>
        ) : (
          <p style={{ fontSize: "18px", color: "black" }}>
            ไม่มี BOM สำหรับรายการนี้
          </p>
        )}
      </div>
    );
  };

  // ฟังก์ชันสำหรับพิมพ์ PDF แบบ A4
  const handlePrintPDF = () => {
    const input = document.getElementById("orderSummaryContent");
    html2canvas(input, { scale: 3 }).then((canvas) => {
      const imgData = canvas.toDataURL("image/png");
      const pdf = new jsPDF("p", "mm", "a4"); // A4: 210 x 297 mm
      const margin = 5; // margin 5 มม.
      const pageWidth = pdf.internal.pageSize.getWidth();
      const imgWidth = pageWidth - margin * 2;
      const imgHeight = (canvas.height * imgWidth) / canvas.width;
      pdf.addImage(imgData, "PNG", margin, margin, imgWidth, imgHeight);
      pdf.save(`order_${selectedOrder.id}.pdf`);
    });
  };

  const totalAmount = selectedOrder.total_amount;
  const totalBeforeVAT = (totalAmount / 1.07).toFixed(2);
  const vatAmount = (totalAmount - totalBeforeVAT).toFixed(2);

  return (
    <Dialog
      header="สรุปออเดอร์"
      visible={visible}
      onHide={onHide}
      style={{ width: "90vw" }}
      maximizable
    >
      <div
        id="orderSummaryContent"
        style={{
          padding: "10mm",
          fontSize: "22px",
          lineHeight: "1.4",
          color: "black",
          position: "relative",
        }}
      >
        {/* inline CSS สำหรับตารางทั้งหมด */}
        <style>{`
  #orderSummaryContent table,
  #orderSummaryContent th,
  #orderSummaryContent td {
    border: 1px solid black !important;
    border-collapse: collapse !important;
    color: black;
  }
`}</style>

        {/* ส่วนโลโก้และข้อมูลบริษัท */}
        <div
          style={{
            position: "relative",
            marginBottom: "15mm",
            height: "120px",
          }}
        >
          {/* โลโก้ทางซ้ายบน */}
          <img
            src="../assets/logo.png"
            alt="logo"
            style={{
              position: "absolute",
              top: "0",
              left: "0",
              width: "200px",
              height: "150px",
              objectFit: "contain",
            }}
          />
          {/* ข้อความบริษัทจัดกลาง */}
          <div
            style={{
              position: "absolute",
              top: 0,
              left: 0,
              right: 0,
              textAlign: "center",
              color: "black",
            }}
          >
            <div
              style={{
                fontSize: "36px",
                fontWeight: "bold",
                lineHeight: "1.2",
                marginTop: "10px",
              }}
            >
              ห้างหุ้นส่วนจำกัด ดี เดย์ ประตูม้วน
            </div>
            <div
              style={{ fontSize: "26px", lineHeight: "1.2", marginTop: "5px" }}
            >
              422/63 หมู่ที่ 5 ตำบลเขาคันทรง
              <br />
              อำเภอศรีราชา จังหวัดชลบุรี 20110
              <br />
              โทร 083-015-1893, 086-033-5224
            </div>
          </div>
        </div>

        {/* แสดง Order Id */}
        <div
          style={{
            textAlign: "right",
            fontSize: "24px",
            fontWeight: "bold",
          }}
        >
          หมายเลขคำสั่งซื้อ: {selectedOrder.id}
        </div>
        <div
          style={{
            textAlign: "right",
            marginBottom: "10mm",
            fontSize: "24px",
            fontWeight: "bold",
          }}
        >
          วันที่สั่งซื้อ:{" "}
          {new Date(selectedOrder.order_date).toLocaleDateString("th-TH", {
            year: "numeric",
            month: "long",
            day: "numeric",
          })}
        </div>

        {/* ข้อมูลลูกค้า */}
        <div style={{ marginBottom: "10mm" }}>
          <h3 style={{ fontSize: "26px", marginBottom: "5mm" }}>
            ข้อมูลลูกค้า
          </h3>
          <table style={{ width: "100%", fontSize: "22px" }}>
            <tbody>
              <tr>
                <td style={{ padding: "3mm" }}>ชื่อ-สกุล</td>
                <td style={{ padding: "3mm" }}>
                  {selectedOrder.user.firstname} {selectedOrder.user.lastname}
                </td>
              </tr>
              <tr>
                <td style={{ padding: "3mm" }}>เบอร์โทร</td>
                <td style={{ padding: "3mm" }}>{selectedOrder.user.phone}</td>
              </tr>
            </tbody>
          </table>

          {/* ข้อมูลที่อยู่จัดส่ง */}
          <h3
            style={{ fontSize: "26px", marginTop: "10mm", marginBottom: "5mm" }}
          >
            ข้อมูลที่อยู่จัดส่ง
          </h3>
          <table style={{ width: "100%", fontSize: "22px" }}>
            <tbody>
              <tr>
                <td style={{ padding: "3mm" }}>ที่อยู่</td>
                <td style={{ padding: "3mm" }}>
                  {selectedOrder.address.addressLine}
                </td>
              </tr>
              <tr>
                <td style={{ padding: "3mm" }}>ตำบล/แขวง</td>
                <td style={{ padding: "3mm" }}>
                  {selectedOrder.address.subdistrict}
                </td>
              </tr>
              <tr>
                <td style={{ padding: "3mm" }}>อำเภอ/เขต</td>
                <td style={{ padding: "3mm" }}>
                  {selectedOrder.address.district}
                </td>
              </tr>
              <tr>
                <td style={{ padding: "3mm" }}>จังหวัด</td>
                <td style={{ padding: "3mm" }}>
                  {selectedOrder.address.province}
                </td>
              </tr>
              <tr>
                <td style={{ padding: "3mm" }}>รหัสไปรษณีย์</td>
                <td style={{ padding: "3mm" }}>
                  {selectedOrder.address.postalCode}
                </td>
              </tr>
            </tbody>
          </table>
        </div>

        {/* รายละเอียดออเดอร์ */}
        <div>
          <h3 style={{ fontSize: "26px", marginBottom: "5mm" }}>
            ข้อมูลสินค้าในออเดอร์
          </h3>
          <DataTable
            value={selectedOrder.order_items}
            responsiveLayout="scroll"
            expandedRows={expandedRows}
            onRowToggle={(e) => setExpandedRows(e.data)}
            rowExpansionTemplate={rowExpansionTemplate}
            dataKey="id"
            style={{ fontSize: "22px" }}
          >
            <Column expander style={{ width: "3em" }} />
            <Column
              field="product.name"
              header="ชื่อสินค้า"
              style={{ fontSize: "22px" }}
            />
            <Column
              field="quantity"
              header="จำนวน"
              style={{ fontSize: "22px" }}
            />
            <Column
              field="price"
              header="ราคา/ชิ้น"
              body={(rowData) => Number(rowData.price).toLocaleString()}
              style={{ fontSize: "22px" }}
            />
            <Column
              header="ขนาด (กว้าง x ยาว x ความหนา)"
              body={(rowData) =>
                rowData.product.is_part
                  ? "-"
                  : `${rowData.width || "-"} x ${rowData.length || "-"} x ${
                      rowData.thickness || "-"
                    }`
              }
              style={{ fontSize: "22px" }}
            />
          </DataTable>
        </div>

        <div style={{ marginTop: "10mm", textAlign: "right", fontSize: "22px" }}>
          <strong>
            VAT 7%: {Number(vatAmount).toLocaleString()} บาท
          </strong>
        </div>

        <div
          style={{ marginTop: "10mm", textAlign: "right", fontSize: "22px" }}
        >
          <strong>
            ยอดรวมทั้งหมด: {Number(selectedOrder.total_amount).toLocaleString()}{" "}
            บาท
          </strong>
        </div>
      </div>
      <div className="p-d-flex p-jc-end p-mt-3">
        <Button
          label="พิมพ์ PDF"
          icon="pi pi-print"
          onClick={handlePrintPDF}
          className="p-button-primary"
          style={{ fontSize: "20px", padding: "10px 20px" }}
        />
      </div>
    </Dialog>
  );
};

export default OrderSummaryDialog;
