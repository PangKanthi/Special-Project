import React from 'react'
import { useLocation, useNavigate  } from 'react-router-dom'
import { Button } from 'primereact/button';
import { Card } from 'primereact/card';


function ShopOrder() {
    const location = useLocation();
    const navigate = useNavigate();
    const { cart } = location.state || {};

    const mockAddress = {
        name: 'Ben Tennyson',
        phone: '+66 985413645',
        address: 'เลขที่ 155/55, หมู่ 50, หมู่บ้าน โดเรม่อน, ตำบล บางงง, อำเภอ งง 11120'
    };

    if (!cart || cart.lenght === 0) {
        return <p>ไม่มีสินค้าในตะกร้า</p>
    }

    const handleOrderConfirmation = () => {
        const orderDetails = {
            mockAddress,
            cart,
            orderDate: new Date().toLocaleString('th-TH', { timeZone: 'Asia/Bangkok' }),
            orderNumber: `ORD${Math.floor(100000 + Math.random() * 900000)}`,
        };

        navigate('/shop-order-info', { state: { orderDetails } });
    };

    return (
        <div className='flex justify-content-center pt-6'>
            <div className='pr-8'>
                <div className='pl-5'>
                    <h1>สั่งซื้อ</h1>
                    <div className='mb-3'>
                        <h3>ที่อยู่จัดส่ง</h3>
                        <div
                            style={{
                                border: '1px solid #ddd',
                                padding: '15px',
                                backgroundColor: '#f9f9f9',
                            }}
                        >
                            <p><strong>{mockAddress.name}</strong> | {mockAddress.phone}</p>
                            <p>{mockAddress.address}</p>
                            <Button
                                label="แก้ไข"
                                className="p-button-text p-button-sm"
                                style={{ float: 'right', marginTop: '-20px' }}
                            />
                        </div>
                    </div>
                </div>
                {cart.map((item, index) => (
                    <div key={index} className='flex'>
                        <div>
                            <img src={item.product.image} alt={item.product.name} style={{ width: '300px', height: '300px', }} />
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
                            >
                            </div>
                            <p>{item.installation}</p>
                            <p>กว้าง {item.dimensins.width} ตร.ม. | ยาว {item.dimensins.height} ตร.ม. | หนา {item.dimensins.thickness} มม.</p>
                            <p>ราคา: {item.product.price}</p>
                            <p>จำนวน: {item.quantity}</p>
                        </div>
                    </div>
                ))}
                <div>
                    <p>วิธีการชำระเงิน</p>
                </div>
                <div style={{ border: '1px solid #ddd', padding: '15px', backgroundColor: '#f9f9f9', height: '100px' }}>

                </div>
                <div className='md:text-center pt-5'>
                    <Button
                        label="สั่งซื้อ"
                        onClick={handleOrderConfirmation}
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
                </div>
            </div>
            <div className='pt-8 pl-8'>
                <Card
                    style={{
                        width: '500px',
                        borderRadius: '10px',
                        boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)',
                        padding: '10px',
                        backgroundColor: '#f6f6f6',
                        height: '250px'
                    }}
                >
                    {cart.map((item, index) => {
                        const totalPrice = parseInt(item.product.price.replace(/,| บาท/g, '')) * item.quantity;
                        const installationFee = item.installation === 'ติดตั้ง' ? 150 : 0;
                        const finalPrice = totalPrice + installationFee;

                        return (
                            <div key={index}>
                                <div className="flex justify-content-between">
                                    <p>ยอดรวม</p>
                                    <p>฿{totalPrice}</p>
                                </div>
                                <div className="flex justify-content-between mb-2">
                                    <p>ค่าธรรมเนียมการติดตั้ง</p>
                                    <p>฿{installationFee}</p>
                                </div>
                                <div
                                    className="flex justify-content-between mb-3 text-xl"
                                    style={{ borderTop: '1px solid #ddd', paddingTop: '15px' }}
                                >
                                    <strong>ยอดรวม</strong>
                                    <strong>฿{finalPrice}</strong>
                                </div>
                            </div>
                        );
                    })}
                </Card>
            </div>
        </div>
    )
}

export default ShopOrder