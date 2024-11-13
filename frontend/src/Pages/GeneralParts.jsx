import React, { useState } from 'react';
import spare1 from '../assets/images/spare1.png';
import spare2 from '../assets/images/spare2.png';
import spare3 from '../assets/images/spare3.png';
import spare4 from '../assets/images/spare4.png';
import 'primeflex/primeflex.css';
import { Card } from 'primereact/card';
import { Divider } from 'primereact/divider';
import { InputText } from 'primereact/inputtext';
import { Button } from 'primereact/button';
import { Link } from 'react-router-dom';

const productGeneral = [
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

const GeneralParts = () => {
  const [search, setSearch] = useState('');

  const filterProducts = productGeneral.filter(product =>
    product.name.toLowerCase().includes(search.toLowerCase())
  );
  return (
    <div class='pl-8 pr-8'>
      <div class='text-center pt-4'>
        <h1> อะไหล่ประตูม้วน </h1>
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
          <h3>ชนิดของอะไหล่</h3>
          <Divider type="solid" />
        </div>

        <div className="flex gap-4 justify-content-center flex-wrap pt-4 pl-8" style={{ flex: 1 }}>
          {filterProducts.map((product, index) => (
            <div key={index} style={{ width: '325px' }}>
              <Link to={`/productGeneral/${product.id}`} key={product.id} style={{ textDecoration: 'none' }}>
                <Card
                  title={product.name}
                  subTitle={product.description}
                  header={
                    <img
                      alt={product.name}
                      src={product.image}
                      style={{ width: '100%', height: '250px', objectFit: 'cover', borderRadius: '10px' }}
                    />
                  }
                  footer={<span style={{ color: 'red', fontWeight: 'bold' }}>{product.price}</span>}
                  className="m-2 p-shadow-5"
                  style={{ height: '400px' }}
                />
              </Link>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default GeneralParts;