import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom'
import { Button } from 'primereact/button';
import { Card } from 'primereact/card';
import { FileUpload } from "primereact/fileupload";
import { Carousel } from "primereact/carousel";


function ShopOrder() {
    const navigate = useNavigate();
    const [cart, setCart] = useState([]);

    const [form, setForm] = useState({
        images: [],
    });

    useEffect(() => {
        const storedCart = JSON.parse(localStorage.getItem("cart")) || [];
        setCart(storedCart);
    }, []);

    const mockAddress = {
        name: 'Ben Tennyson',
        phone: '+66 985413645',
        address: 'เลขที่ 155/55, หมู่ 50, หมู่บ้าน โดเรม่อน, ตำบล บางงง, อำเภอ งง 11120'
    };

    if (!cart || cart.lenght === 0) {
        return <p>ไม่มีสินค้าในตะกร้า</p>
    }

    const handleOrderConfirmation = async () => {
        if (form.images.length === 0) {
            alert("กรุณาอัปโหลดสลิปการโอนเงินก่อนทำการสั่งซื้อ");
            return;
        }

        const formData = new FormData();

        // เพิ่มสินค้าในคำสั่งซื้อ
        cart.forEach((item, index) => {
            formData.append(`cart[${index}]`, JSON.stringify(item));
        });

        // เพิ่มรูปภาพสลิป
        form.images.forEach((img) => {
            formData.append("paymentSlip", img.file);
        });

        try {
            const response = await fetch("http://localhost:1234/api/orders", {
                method: "POST",
                headers: {
                    Authorization: `Bearer ${localStorage.getItem("token")}`,
                },
                body: formData,
            });

            if (response.ok) {
                const orderData = await response.json();

                // ✅ ล้างตะกร้าและแจ้งอัปเดต
                localStorage.removeItem("cart");
                window.dispatchEvent(new Event("cartUpdated"));

                // ✅ ไปยังหน้า ShopOrderInformation พร้อมส่งข้อมูลคำสั่งซื้อไปด้วย
                navigate('/shop-order-info', { state: { orderDetails: orderData } });

            } else {
                const errorData = await response.json();
                alert(`เกิดข้อผิดพลาด: ${errorData.error}`);
            }
        } catch (err) {
            alert("เกิดข้อผิดพลาดในการเชื่อมต่อเซิร์ฟเวอร์");
        }
    };


    // ✅ คำนวณยอดรวมสินค้าและค่าติดตั้ง
    const totalProductPrice = cart.reduce((sum, item) => {
        const price = typeof item.product.price === "number"
            ? item.product.price
            : parseInt(item.product.price.replace(/,| บาท/g, ''), 10);

        return sum + (price * item.quantity);
    }, 0);

    const totalInstallationFee = cart.reduce((sum, item) => (
        sum + (item.installation === 'ติดตั้ง' ? 150 : 0)
    ), 0);

    const grandTotal = totalProductPrice + totalInstallationFee;

    // ✅ ฟังก์ชันเพิ่มไฟล์ลง state
    const handleImageUpload = (event) => {
        const uploadedFiles = event.files.map((file) => ({
            file,
            previewUrl: URL.createObjectURL(file),
        }));

        setForm((prevForm) => ({
            ...prevForm,
            images: [...prevForm.images, ...uploadedFiles],
        }));
    };

    // ✅ ฟังก์ชันลบรูปภาพออกจาก state
    const handleRemoveImage = (event) => {
        setForm((prevForm) => {
            const updatedImages = prevForm.images.filter(
                (image) => image.file.name !== event.file.name
            );

            return { ...prevForm, images: updatedImages };
        });
    };

    const imageTemplate = (imageUrl, index) => {
        return (
            <img
                key={index}
                src={imageUrl}
                alt="Product"
                style={{
                    width: "300px",       // กำหนดความกว้าง
                    height: "300px",      // กำหนดความสูงเท่ากัน
                    objectFit: "auto", // ป้องกันการครอบตัดรูป
                    borderRadius: "8px",
                    backgroundColor: "#fff" // เพิ่มพื้นหลังให้รูปที่โปร่งใส
                }}
            />
        );
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
                    <div key={index} className='lg:flex'>
                        <div className="w-[200px] lg:pt-6">
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
                        <div className='lg:pt-4'>
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
                        {/* ✅ แสดงยอดรวมของสินค้า */}
                        <div className="flex justify-content-between text-lg">
                            <p>ยอดรวม</p>
                            <p>฿{totalProductPrice.toLocaleString()}</p>
                        </div>

                        {/* ✅ แสดงค่าธรรมเนียมการติดตั้ง */}
                        <div className="flex justify-content-between mb-3">
                            <p>ค่าธรรมเนียมการติดตั้ง</p>
                            <p>฿{totalInstallationFee.toLocaleString()}</p>
                        </div>

                        {/* ✅ เส้นคั่น */}
                        <div className="border-t border-gray-300 my-3"></div>

                        <div
                            className="flex justify-content-between mb-3 border-t border-gray-300 pt-3"
                            style={{ borderTop: '1px solid #ddd', paddingTop: '15px' }}
                        >
                            <strong>ยอดรวม</strong>
                            <strong>฿{grandTotal.toLocaleString()}</strong>
                        </div>
                    </Card>
                </div>
                <div className='pt-4 '>
                    <div>
                        <strong>วิธีการชำระเงิน</strong>
                    </div>
                    <div className='w-full lg:w-auto flex justify-end pt-3'>
                        <Card
                            style={{
                                width: '500px',
                                height: '500px',
                                borderRadius: '10px',
                                padding: '20px',
                                backgroundColor: '#f6f6f6',
                            }}
                        >
                            <div>
                                <p>บัญชี กสิกร</p>
                            </div>
                            <div>
                                <p>เลขบัญชี 0591344439</p>
                            </div>
                            <div>
                                <p>ชื่อบัญชี กันต์ธี จิตรแก้ว</p>
                            </div>
                            <div className="p-field p-col-12 pt-2">
                                <label>เพิ่มรูปภาพ</label>
                                <div className="pt-2">
                                    <FileUpload
                                        name="images"
                                        mode="advanced"
                                        accept="image/*"
                                        maxFileSize={1000000}
                                        customUpload
                                        uploadHandler={handleImageUpload}
                                        onRemove={handleRemoveImage}
                                        chooseLabel="เลือกไฟล์"
                                    />
                                </div>
                            </div>
                            <div className='pt-3'>
                                <Button
                                    label="ยืนยันการโอนเงิน"
                                    onClick={handleOrderConfirmation}
                                    className="w-full bg-blue-600 text-white py-2 text-lg font-bold rounded"
                                />
                            </div>
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