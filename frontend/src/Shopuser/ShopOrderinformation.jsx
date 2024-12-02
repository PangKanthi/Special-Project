import React from 'react';
import { useLocation } from 'react-router-dom';
import { Card } from 'primereact/card';

function ShopOrderInformation() {
  const location = useLocation();
  const { orderDetails } = location.state || {};
  const { mockAddress, cart, orderDate, orderNumber } = orderDetails || {};

  if (!cart || cart.length === 0) {
    return <p>ไม่มีสินค้าในคำสั่งซื้อ</p>;
  }

  return (
    <div className="pl-8 pr-8 pt-7">
      <div className='pl-6'>
        <h1>รายละเอียด</h1>
      </div>
      <div className="flex justify-content-between gap-8">
        {/* ส่วนซ้าย: สินค้า */}
        <div style={{ width: '65%' }}>
          {cart.map((item, index) => (
            <div key={index}>
              <div className="flex gap-4">
                <div>
                  <img
                    src={item.product.image}
                    alt={item.product.name}
                    style={{ width: '300px', height: '300px' }}
                  />
                </div>
                <div className='pt-3'>
                  <h3>{item.product.name}</h3>
                  <div
                    style={{
                      backgroundColor: item.color,
                      width: '20px',
                      height: '20px',
                      borderRadius: '50%',
                    }}
                  ></div>
                  <p>{item.installation}</p>
                  <p>
                    กว้าง {item.dimensins.width} ตร.ม. | ยาว {item.dimensins.height} ตร.ม. | หนา{' '}
                    {item.dimensins.thickness} มม.
                  </p>
                  <p>ราคา: {item.product.price}</p>
                  <p>จำนวน: {item.quantity}</p>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* ส่วนขวา: ข้อมูลจัดส่งและสรุปยอด */}
        <div style={{ width: '30%' }}>
          <Card
            style={{
              padding: '20px',
              borderRadius: '10px',
              backgroundColor: '#f9f9f9',
            }}
          >
            <h1>ข้อมูลจัดส่ง</h1>
            <div>
              <p>
                <strong>{mockAddress.name}</strong> | {mockAddress.phone}
              </p>
              <p>{mockAddress.address}</p>
            </div>
            <h2>ข้อมูลการสั่งซื้อ</h2>
            <p>หมายเลขคำสั่งซื้อ: <strong>{orderNumber}</strong></p>
            <p>วันที่สั่งซื้อ: <strong>{orderDate}</strong></p>
            {cart.map((item, index) => {
              const totalPrice = parseInt(item.product.price.replace(/,| บาท/g, '')) * item.quantity;
              const installationFee = item.installation === 'ติดตั้ง' ? 150 : 0;
              const deliveryFee = 150; // Mock delivery fee
              const vat = ((totalPrice + installationFee + deliveryFee) * 7) / 100;
              const finalPrice = totalPrice + installationFee + deliveryFee + vat;

              return (
                <div key={index}>
                  <div className="flex justify-content-between">
                    <p>ยอดรวม</p>
                    <p>฿{totalPrice.toLocaleString()}</p>
                  </div>
                  <div className="flex justify-content-between">
                    <p>ค่าธรรมเนียมการติดตั้ง</p>
                    <p>฿{installationFee.toLocaleString()}</p>
                  </div>
                  <div className="flex justify-content-between">
                    <p>ค่าธรรมเนียมการเดินทาง</p>
                    <p>฿{deliveryFee.toLocaleString()}</p>
                  </div>
                  <div className="flex justify-content-between">
                    <p>VAT 7%</p>
                    <p>฿{vat.toLocaleString()}</p>
                  </div>
                  <div
                    className="flex justify-content-between text-xl"
                    style={{ borderTop: '1px solid #ddd', marginTop: '15px', paddingTop: '15px' }}
                  >
                    <strong>ยอดรวม</strong>
                    <strong>฿{finalPrice.toLocaleString()}</strong>
                  </div>
                </div>
              );
            })}
          </Card>
        </div>
      </div>
    </div>
  );
}

export default ShopOrderInformation;
