import React from 'react';
import product1 from '../assets/images/product1.png';
import product2 from '../assets/images/product2.png';
import product3 from '../assets/images/product3.png';
import product4 from '../assets/images/product4.png';
import 'primeflex/primeflex.css';
import { Card } from 'primereact/card';

const product = [
  {
    image: product1,
    name: 'ประตูเหล็กทึบ',
  },
  {
    image: product2,
    name: 'ประตูม้วนอัตโนมัติ',
  },
  {
    image: product3,
    name: 'ประตูม้วนไฮสปีด',
  },
  {
    image: product4,
    name: 'ประตูม้วนลายโป่ง',
  },

  {
    image: product1,
    name: 'ประตูเหล็กทึบ',
  },
  {
    image: product2,
    name: 'ประตูม้วนอัตโนมัติ',
  },
  {
    image: product3,
    name: 'ประตูม้วนไฮสปีด',
  },
  {
    image: product4,
    name: 'ประตูม้วนลายโป่ง',
  }
]

const Portfolio = () => {
  return (
    <div className='pl-8 pr-8'>
      <div style={{ textAlign: 'center' }}>
        <h1>ผลงาน</h1>
      </div>
      <div className="flex gap-4 justify-content-center flex-wrap pt-4 pl-8" style={{ flex: 1 }}>
        {product.map((product, index) => (
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
  );
};

export default Portfolio;