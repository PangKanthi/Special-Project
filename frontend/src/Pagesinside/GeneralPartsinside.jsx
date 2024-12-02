import React, { useState } from 'react'
import { useParams } from 'react-router-dom';
import { Button } from 'primereact/button';
import { InputText } from 'primereact/inputtext';
import { Dialog } from 'primereact/dialog';
import spare1 from '../assets/images/spare1.png';
import spare2 from '../assets/images/spare2.png';
import spare3 from '../assets/images/spare3.png';
import spare4 from '../assets/images/spare4.png';

const productData = [
    {
        id: 1,
        image: spare1,
        name: 'จานเพลาประตูม้วน',
        price: '1,200 บาท ',
    },
    {
        id: 2,
        image: spare2,
        name: 'ตัวตั้งสปริง',
        price: '750 บาท',
    },
    {
        id: 3,
        image: spare3,
        name: 'เสารางประตูหรือเสาข้าง',
        price: '1,100 บาท',
    },
    {
        id: 4,
        image: spare4,
        name: 'หูรับเพลาขวา พร้อมตัวล็อค',
        price: '300 บาท',
    },

    {
        id: 5,
        image: spare1,
        name: 'จานเพลาประตูม้วน',
        price: '1,200 บาท ',
    },
    {
        id: 6,
        image: spare2,
        name: 'ตัวตั้งสปริง',
        price: '750 บาท',
    },
    {
        id: 7,
        image: spare3,
        name: 'เสารางประตูหรือเสาข้าง',
        price: '1,100 บาท',
    },
    {
        id: 8,
        image: spare4,
        name: 'หูรับเพลาขวา พร้อมตัวล็อค',
        price: '300 บาท',
    },
]

function GeneralPartsinside() {
    const { id } = useParams();
    const product = productData.find((item) => item.id === parseInt(id));
    const [quantity, setQuantity] = useState(1);
    const [showDialog, setShowDialog] = useState(false);

    const handleIncrease = () => {
        setQuantity((prev) => prev + 1);
    };

    const handleDecrease = () => {
        setQuantity((prev) => (prev > 1 ? prev - 1 : 1));
    };

    return (
        <div className="pl-8 pr-8">
            <div className="flex justify-content-center pt-8">
                <div className="border-round-lg bg-white shadow-2">
                    <img src={product.image} alt={product.name} style={{ width: '350px', height: '350px' }} />
                </div>
                <div className='pl-8 pt-2'>
                    <h1>{product.name}</h1>
                    <p style={{ color: 'red', fontWeight: 'blod', fontSize: '20px' }}>{product.price}</p>
                    <p>จำนวน</p>
                    <div className="flex align-items-center">
                        <Button
                            label="-"
                            className="p-button-secondary"
                            onClick={handleDecrease}
                            style={{
                                width: '30px',
                                height: '30px',
                                backgroundColor: '#ffffff',
                                color: '#000000',
                                fontSize: '30px',
                                justifyContent: 'center',
                                paddingBottom: '14px'
                            }}
                        />
                        <InputText
                            value={quantity}
                            readOnly
                            style=
                            {{
                                width: '57px',
                                height: '30px',
                                textAlign: 'center',
                                fontSize: '16px',
                                fontWeight: 'bold',
                                border: '1px solid #424242',
                            }}
                        />
                        <Button
                            label="+"
                            className="p-button-secondary"
                            onClick={handleIncrease}
                            style=
                            {{
                                width: '30px',
                                height: '30px',
                                backgroundColor: '#ffffff',
                                color: '#000000',
                                fontSize: '30px',
                                justifyContent: 'center',
                                paddingBottom: '14px'
                            }}
                        />
                    </div>
                    <p
                        onClick={() => setShowDialog(true)}
                        style={{ color: 'red', cursor: 'pointer', textDecoration: 'underline', fontSize: '17px' }}
                    >
                        *รายละเอียดและคำแจ้งเตือนเมื่อซื้อ
                    </p>
                    <Dialog
                        visible={showDialog}
                        style={{ width: '1080px', height: '840px' }}
                        onHide={() => setShowDialog(false)}
                    >
                        <div className='flex flex-colum justify-content-center'>
                            <img src={product.image} alt={product.name} style={{ width: '300px', marginBottom: '10px' }} />
                            <div className='pt-8'>
                                <h1>{product.name}</h1>
                            </div>
                        </div>
                        <div className='pl-5 pr-5'>
                            <div>
                                <h3>รายละเอียด</h3>
                            </div>
                            <div className='pt-8'>
                                <h3>การรับประกัน</h3>
                            </div>
                        </div>

                    </Dialog>
                    
                    <Button
                        label='ซื้อ'
                        raised
                        style={{
                            backgroundColor: '#0a74da',
                            color: '#ffffff',
                            textAlign: 'center',
                            width: '150px'
                        }}
                    />
                    <Button
                        label='เพิ่มลงตะกล้า'
                        raised
                        style={{
                            marginLeft: '5px',
                            backgroundColor: '#ffffff',
                            color: '#000000',
                            textAlign: 'center',
                            width: '150px',
                            border: '1px solid #ffffff'
                        }}
                    />
                </div>
            </div>

        </div>
    )
}
export default GeneralPartsinside