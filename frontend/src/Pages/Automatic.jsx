import React, { useState } from 'react';
import product1 from '../assets/images/product1.png';
import product2 from '../assets/images/product2.png';
import product3 from '../assets/images/product3.png';
import product4 from '../assets/images/product4.png';
import 'primeflex/primeflex.css';
import { Card } from 'primereact/card';
import { Divider } from 'primereact/divider';
import { InputText } from 'primereact/inputtext';
import { Button } from 'primereact/button';

const product = [
  {
    image: product1,
    name: 'ประตูเหล็กทึบ',
    description: 'กว้างxยาว',
    price: '600,000 บาท',
  },
  {
    image: product2,
    name: 'ประตูม้วนอัตโนมัติ',
    description: 'กว้างxยาว',
    price: '850,000 บาท',
  },
  {
    image: product3,
    name: 'ประตูม้วนไฮสปีด',
    description: 'กว้างxยาว',
    price: '150,000 บาท',
  },
  {
    image: product4,
    name: 'ประตูม้วนลายโป่ง',
    description: 'กว้างxยาว',
    price: '250,000 บาท',
  },

  {
    image: product1,
    name: 'ประตูเหล็กทึบ',
    description: 'กว้างxยาว',
    price: '600,000 บาท',
  },
  {
    image: product2,
    name: 'ประตูม้วนอัตโนมัติ',
    description: 'กว้างxยาว',
    price: '850,000 บาท',
  },
  {
    image: product3,
    name: 'ประตูม้วนไฮสปีด',
    description: 'กว้างxยาว',
    price: '150,000 บาท',
  },
  {
    image: product4,
    name: 'ประตูม้วนลายโป่ง',
    description: 'กว้างxยาว',
    price: '250,000 บาท',
  }
]

const Automatic = () => {
  const [search, setSearch] = useState('');

  const filterProducts = product.filter(product =>
    product.name.toLowerCase().includes(search.toLowerCase())
  );
  return (
    <div class='pl-8 pr-8'>
      <div class='text-center pt-4'>
        <h1> ประตูม้วน </h1>
      </div>
      <div className="flex justify-content-end pr-5">
        <div class='flex' style={{ width: '400px', boxShadow: '0px 4px 8px rgba(0, 0, 0, 0.1)', padding: '1px', borderRadius: '25px' }}>
          <InputText
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder='ค้นหา'
            style={{
              width: '100%',
              border: 'none',
              outline: 'none',
              paddingLeft: '10px',
              borderRadius: '25px 0 0 25px'
            }}
          />
          <Button
            icon="pi pi-search"
            className='p-button-secondary'
            style={{
              borderRadius: '0px 25px 25px 0px',
              backgroundColor: '#0a74da',
              border: 'none',
              width: '40px',
              height: '40px'
            }}
          />
        </div>
      </div>
      <div class='flex'>
        <div class='pl-5 pt-2' style={{ width: '215px' }}>
          <h3>ชนิดของประตูม้วน</h3>
          <p>ประตูม้วนแบบมือดึง</p>
          <p>ประตูม้วนแบบรอกโซ่</p>
          <p>ประตูม้วนแบบมอเตอร์</p>
          <Divider type="solid" />
          <h3>ไซส์ของประตู</h3>
          <p>กว้างxยาว cm</p>
        </div>

        <div className="flex gap-4 justify-content-center flex-wrap pt-4 pl-8" style={{ flex: 1 }}>
          {filterProducts.map((product, index) => (
            <div key={index} style={{ width: '325px' }}>
              <Card
                title={product.name}
                subTitle={product.description}
                header={
                  <img
                    alt={product.name}
                    src={product.image}
                    style={{ width: '100%', height: '325px', borderRadius: '10px' }}
                  />
                }
                footer={<span style={{ color: 'red', fontWeight: 'bold' }}>{product.price}</span>}
                className="m-2 p-shadow-5"
              />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Automatic;