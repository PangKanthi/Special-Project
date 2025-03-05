import React, { useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { Button } from 'primereact/button';
import { Card } from 'primereact/card';
import { Carousel } from "primereact/carousel";

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

  const imageTemplate = (imageUrl, index) => {
    return (
      <img
        key={index}
        src={imageUrl}
        alt="Product"
        style={{
          width: "100%",
          height: "200px",
          objectFit: "cover",
          borderRadius: "8px",
        }}
      />
    );
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
    <div className='px-4 sm:px-6 md:px-8 lg:pl-8 pr-8'>
      <div className='lg:flex-1 flex justify-content-between flex-wrap pt-8'>
        <div className='lg:pl-8'>
          <div className='lg:pl-5'>
            <h2>ตะกร้าสินค้า</h2>
          </div>
          {cart.map((item, index) => (
            <div key={index} className='lg:flex'>
              <div className="w-[200px] pt-5">
                {Array.isArray(item.product.images) && item.product.images.length > 0 ? (
                  <Carousel
                    value={item.product.images}  // ใช้ array ของรูป
                    numVisible={1}
                    numScroll={1}
                    itemTemplate={imageTemplate}
                    style={{ maxWidth: "400px", width: "100%" }}
                  />
                ) : (
                  <img
                    src="https://via.placeholder.com/300"
                    alt="สินค้าตัวนี้"
                    style={{
                      width: '200px',
                      height: '200px',
                      objectFit: 'cover'
                    }}
                  />
                )}
              </div>

              <div className='pl-4'>
                <div className="flex-1 text-left">
                  <h3 className="text-sm lg:text-xl">{item.product.name}</h3>
                  <p className="text-xs lg:text-base">{item.installation}</p>
                  <p className="text-xs lg:text-base flex items-center">
                    สีที่เลือก:
                    <span style={{
                      backgroundColor: item.selectedColor || "transparent",
                      borderRadius: "50%",
                      border: "1px solid #ccc",
                      display: "inline-block",
                      width: "20px",
                      height: "20px",
                      marginLeft: "10px"
                    }}>
                    </span>
                  </p>
                  <p className="text-xs lg:text-base sm:text-sm">
                    กว้าง {item.dimensions?.width || '-'} ตร.ม. |
                    ยาว {item.dimensions?.height || '-'} ตร.ม. |
                    หนา {item.dimensions?.thickness || '-'} มม.
                  </p>
                  <p className="text-sm font-bold text-red-500 lg:text-lg">฿{item.product.price.toLocaleString()}</p>
                </div>
                <Button
                  label="ลบออก"
                  size='small'
                  icon="pi pi-trash"
                  className="p-button-danger text-xs lg:mt-2"
                  onClick={() => handleRemoveItem(item.product.id)}
                />
              </div>
            </div>
          ))}
        </div>
        <div className="w-full lg:w-auto pt-7 flex justify-end">
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
                    className="flex justify-content-between mb-3 border-t border-gray-300 pt-3"
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
              className="w-full bg-blue-600 text-white py-2 text-lg font-bold rounded"
            />
          </Card>
        </div>
      </div>
    </div>
  )
}

export default ShopCart