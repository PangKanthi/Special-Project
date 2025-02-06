import React, { useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { Button } from 'primereact/button';
import { Card } from 'primereact/card';

function ShopCart() {
  const location = useLocation();
  const navigate = useNavigate();

  // แบบใหม่ดึงมาใช้แบบนี้ได้ใช้แบบนี้ได้เลยไม่ต้องระบุ
  const initialCart = location.state ? [location.state] : [];
  const [cart, setCart] = useState(initialCart);

  const handleRemoveItem = (productId) => {
    const updatedCart = cart.filter(item => item.product.id !== productId);
    setCart(updatedCart);

    if (updatedCart.length === 0) {
      navigate('/automatic');
    }
  };

  if (cart.length === 0) {
    return <p>ไม่มีสินค้าในตะกร้า</p>;
  }
  const handleOrder = () => {
    navigate('/shop-order', {
      state: {
        cart
      }
    });
  }

  return (
    <div className='pl-8 pr-8'>
      <div className='flex justify-content-between pt-8'>
        <div className='pl-8'>
          <div className='pl-5'>
            <h2>ตะกร้าสินค้า</h2>
          </div>
          {cart.map((item, index) => (
            <div key={index} className='flex'>
              <div>
                <img src={item.product.image} alt={item.product.name} style={{ width: '300px', height: '300px', }} />
              </div>
              <div>
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
                <p>กว้าง {item.dimensins.width} ตร.ม. | ยาว {item.dimensins.height} ตร.ม. | หนา {item.dimensins.thickness} มม.</p>
                <p>ราคา: {item.product.price}</p>
                <p>จำนวน: {item.quantity}</p>
                <Button
                  label="ลบออก"
                  size='small'
                  className="p-button-danger"
                  icon="pi pi-trash"
                  style={{ marginTop: '10px' }}
                  onClick={() => handleRemoveItem(item.product.id)}
                />
              </div>
            </div>
          ))}
        </div>
        <div className='pr-8 pt-7'>
          <Card
            style={{
              width: '500px',
              borderRadius: '10px',
              boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)',
              padding: '20px',
              backgroundColor: '#f6f6f6',
            }}
          >
            {cart.map((item, index) => {
              const totalPrice =
                typeof item.product.price === "number"
                  ? item.product.price * item.quantity
                  : parseInt(item.product.price.replace(/,| บาท/g, ''), 10) * item.quantity;

              const installationFee = item.installation === 'ติดตั้ง' ? 150 : 0;
              const finalPrice = totalPrice + installationFee;

              return (
                <div key={index}>
                  <div className="flex justify-content-between">
                    <p>ยอดรวม</p>
                    <p>฿{totalPrice.toLocaleString()}</p>
                  </div>
                  <div className="flex justify-content-between mb-2">
                    <p>ค่าธรรมเนียมการติดตั้ง</p>
                    <p>฿{installationFee.toLocaleString()}</p>
                  </div>
                  <div
                    className="flex justify-content-between mb-3"
                    style={{ borderTop: '1px solid #ddd', paddingTop: '15px' }}
                  >
                    <strong>ยอดรวม</strong>
                    <strong>฿{finalPrice.toLocaleString()}</strong>
                  </div>
                </div>
              );
            })}
            <Button
              label="สั่งซื้อ"
              onClick={handleOrder}
              style={{
                width: '100%',
                backgroundColor: '#0a74da',
                color: '#ffffff',
                padding: '10px',
                fontSize: '16px',
                fontWeight: 'bold',
                borderRadius: '5px',
              }}
            />
          </Card>
        </div>
      </div>
    </div>
  )
}

export default ShopCart