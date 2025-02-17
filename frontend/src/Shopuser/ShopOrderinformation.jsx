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
    <div className="px-4 sm:px-6 md:px-8 lg:pl-8 pr-8">
      <div className="lg:flex-1 flex justify-content-between flex-wrap pt-8">
        <div className='lg:pl-8'>
          <div className='lg:pl-5'>
            <h1>รายละเอียด</h1>
          </div>
            {cart.map((item, index) => (
              <div key={index} className='flex'>
                <div>
                  <img
                    src={item.product.image}
                    alt={item.product.name}
                    style={{ width: '300px', height: '300px', }}
                    className="w-[120px] sm:w-[150px] md:w-[200px] max-w-full h-auto object-contain"
                  />
                </div>
                <div className='lg:pt-4'>
                  <div className="flex-1 text-left">
                    <h3 className="text-sm lg:text-xl">{item.product.name}</h3>
                    <p className="text-xs lg:text-base">{item.installation}</p>
                    <p className="text-xs lg:text-base sm:text-sm">
                    กว้าง {item.dimensins?.width || '-'} ตร.ม. | ยาว {item.dimensins?.height || '-'} ตร.ม. | หนา {item.dimensins?.thickness || '-'} มม.
                    </p>
                    <p className="text-sm lg:text-lg">฿{item.product.price.toLocaleString()}</p>
                  </div>
                  <p className='text-xs lg:text-base'>จำนวน: {item.quantity}</p>
                </div>
              </div>
            ))}
          </div>

        <div className='lg:pr-7'>
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
              const totalPrice =
                typeof item.product.price === "number"
                  ? item.product.price * item.quantity
                  : parseInt(item.product.price.replace(/,| บาท/g, ''), 10) * item.quantity;

              const installationFee = item.installation === 'ติดตั้ง' ? 150 : 0;
              const deliveryFee = 150; // ค่าจัดส่ง
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
                    style={{ borderTop: '1px solid #ddd', marginTop: '20px', paddingTop: '20px' }}
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
