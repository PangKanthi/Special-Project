import React, { useState } from 'react'
import { useParams } from 'react-router-dom';
import { Button } from 'primereact/button';
import { InputText } from 'primereact/inputtext';
import { Dialog } from 'primereact/dialog';
import { useNavigate } from 'react-router-dom';
import product1 from '../assets/images/product1.png';
import product2 from '../assets/images/product2.png';
import product3 from '../assets/images/product3.png';
import product4 from '../assets/images/product4.png';

const InsideproductAuto = [
  {
    id: 1,
    image: product1,
    name: 'ประตูเหล็กทึบ',
    description: 'รายละเอียดสินค้า: กว้างxยาว',
    price: '600,000 บาท',
  },
  {
    id: 2,
    image: product2,
    name: 'ประตูม้วนอัตโนมัติ',
    description: 'รายละเอียดสินค้า: กว้างxยาว',
    price: '850,000 บาท',
  },
  {
    id: 3,
    image: product3,
    name: 'ประตูม้วนไฮสปีด',
    description: 'รายละเอียดสินค้า: กว้างxยาว',
    price: '150,000 บาท',
  },
  {
    id: 4,
    image: product4,
    name: 'ประตูม้วนลายโป่ง',
    description: 'รายละเอียดสินค้า: กว้างxยาว',
    price: '250,000 บาท',
  },
  {
    id: 5,
    image: product1,
    name: 'ประตูเหล็กทึบ',
    description: 'รายละเอียดสินค้า: กว้างxยาว',
    price: '600,000 บาท',
  },
  {
    id: 6,
    image: product2,
    name: 'ประตูม้วนอัตโนมัติ',
    description: 'รายละเอียดสินค้า: กว้างxยาว',
    price: '850,000 บาท',
  },
  {
    id: 7,
    image: product3,
    name: 'ประตูม้วนไฮสปีด',
    description: 'รายละเอียดสินค้า: กว้างxยาว',
    price: '150,000 บาท',
  },
  {
    id: 8,
    image: product4,
    name: 'ประตูม้วนลายโป่ง',
    description: 'รายละเอียดสินค้า: กว้างxยาว',
    price: '250,000 บาท',
  },
];

function Automaticinside() {
  const { id } = useParams();
  const product = InsideproductAuto.find((item) => item.id === parseInt(id));
  const [selectedColor, setSelectedColor] = useState('default');
  const [quantity, setQuantity] = useState(1);
  const [showDialog, setShowDialog] = useState(false);
  const [dimensins, setDimensions] = useState({
    with: ' ',
    height: ' ',
    thickness: ' ',
  })
  const [installationOption, setInstallationOption] = useState('ติดตั้ง');
  const navigate = useNavigate();

  const handleDimensionChange = (field, value) => {
    setDimensions((prev) => ({ ...prev, [field]: value }));
  }

  const handleInstallationChange = (option) => {
    setInstallationOption(option);
  };

  const handleBuy = () => {
    navigate('/shop-cart', {
      state: {
        product: product,
        quantity: quantity,
        color: selectedColor,
        dimensins: dimensins,
        installation: installationOption,
      },
    });
  };

  const handleColorChange = (color) => {
    setSelectedColor(color);
  };

  const handleIncrease = () => {
    setQuantity((prev) => prev + 1);
  };

  const handleDecrease = () => {
    setQuantity((prev) => (prev > 1 ? prev - 1 : 1));
  };

  return (
    <div className="pl-8 pr-8">
      <div className="flex justify-content-center pt-8">
        <div className="pt-6">
          <div className="border-round-lg bg-white shadow-2">
            <img src={product.image} alt={product.name} style={{ width: '400px', height: '400px' }} />
          </div>
        </div>
        <div className='pl-8'>
          <h1>{product.name}</h1>
          <div className="flex gap-2">
            <button
              onClick={() => handleColorChange('black')}
              style={{
                backgroundColor: 'black',
                width: '20px',
                height: '20px',
                borderRadius: '50%',
                border: selectedColor === 'black' ? '2px solid blue' : '1px solid gray',
              }}
            />
            <button
              onClick={() => handleColorChange('red')}
              style={{
                backgroundColor: 'red',
                width: '20px',
                height: '20px',
                borderRadius: '50%',
                border: selectedColor === 'red' ? '2px solid blue' : '1px solid gray',
              }}
            />
          </div>
          <div className='pt-3'>
            <Button
              label="ติดตั้ง"
              size='small'
              onClick={() => handleInstallationChange('ติดตั้ง')}
              severity={installationOption === 'ติดตั้ง' ? 'primary' : 'secondary'}
              style={{
                backgroundColor: installationOption === 'ติดตั้ง' ? '#0a74da' : '#F0F0F0',
                color: installationOption === 'ติดตั้ง' ? '#ffffff' : '#000000',
                marginRight: '10px',
              }}
            />
            <Button
              label="ไม่ติดตั้ง"
              size='small'
              onClick={() => handleInstallationChange('ไม่ติดตั้ง')}
              severity={installationOption === 'ไม่ติดตั้ง' ? 'primary' : 'secondary'}
              style={{
                marginLeft: '5px',
                backgroundColor: installationOption === 'ไม่ติดตั้ง' ? '#0a74da' : '#F0F0F0',
                color: installationOption === 'ไม่ติดตั้ง' ? '#ffffff' : '#000000',
              }}
            />
          </div>
          <div>
            <p>ขนาด ( 2000/ตร.ม. )</p>
            <InputText
              keyfilter="int"
              placeholder='กว้าง = ตร.ม.'
              className="p-inputtext-sm"
              onChange={(e) => handleDimensionChange('width', e.target.value)}
              style={{
                backgroundColor: '#F0F0F0',
                color: '#000000',
                width: '100px',
                textAlign: 'center'
              }}
            />
            <InputText
              keyfilter="int"
              placeholder='ยาว = ตร.ม.'
              className="p-inputtext-sm"
              onChange={(e) => handleDimensionChange('height', e.target.value)}
              style={{
                marginLeft: '5px',
                backgroundColor: '#F0F0F0',
                color: '#000000',
                width: '100px',
                textAlign: 'center'
              }}
            />
            <InputText
              keyfilter="int"
              placeholder='หนา = มิน'
              className="p-inputtext-sm"
              onChange={(e) => handleDimensionChange('thickness', e.target.value)}
              style={{
                marginLeft: '5px',
                backgroundColor: '#F0F0F0',
                color: '#000000',
                width: '100px',
                textAlign: 'center'
              }}
            />
          </div>
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
            onClick={handleBuy}
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

export default Automaticinside