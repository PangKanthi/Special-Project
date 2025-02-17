import React from 'react'
import { useLocation, useNavigate } from 'react-router-dom'
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
        <div className='lg:flex justify-content-center pt-6'>
            <div className='px-4 sm:px-6 md:px-8 lg:mr-8'>
                <div className='lg:pl-5'>
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
            <div className='pl-5 pr-5 lg:pt-7'>
                <div className="w-full lg:w-auto justify-content-center flex">
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
                                        className="flex justify-content-between mb-3 text-xl"
                                        style={{ borderTop: '1px solid #ddd', paddingTop: '15px' }}
                                    >
                                        <strong>ยอดรวม</strong>
                                        <strong>฿{finalPrice.toLocaleString()}</strong>
                                    </div>
                                </div>
                            );
                        })}
                    </Card>
                </div>
                <div className='pt-4'>
                    <div>
                        <strong>วิธีการชำระเงิน</strong>
                    </div>
                    <div className='w-full lg:w-auto flex justify-end pt-3'>
                        <Card
                            style={{
                                width: '500px',
                                height: '100px',
                                borderRadius: '10px',
                                padding: '20px',
                                backgroundColor: '#f6f6f6',
                            }}
                        >
                        </Card>
                    </div>
                    <div className='md:text-center pt-5'>
                        <Button
                            label="สั่งซื้อ"
                            onClick={handleOrderConfirmation}
                            className="w-full bg-blue-600 text-white py-2 text-lg font-bold rounded"
                        />
                    </div>
                </div>
            </div>
        </div>
    )
}

export default ShopOrder