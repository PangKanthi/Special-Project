import React, { useState } from 'react';
import { Galleria } from 'primereact/galleria';
import image1 from '../assets/images/image1.jpg';
import image2 from '../assets/images/image2.jpg';
import image3 from '../assets/images/image3.jpg';
import image4 from '../assets/images/image4.jpg';
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

const Home = () => {
  const [images] = useState([
    {
      itemImageSrc: image1,
      thumbnailImageSrc: image1,
      alt: 'Description for Image1',
      title: 'Title 1'
    },
    {
      itemImageSrc: image2,
      thumbnailImageSrc: image2,
      alt: 'Description for Image1',
      title: 'Title 1'
    },
    {
      itemImageSrc: image3,
      thumbnailImageSrc: image3,
      alt: 'Description for Image1',
      title: 'Title 1'
    },
    {
      itemImageSrc: image4,
      thumbnailImageSrc: image4,
      alt: 'Description for Image1',
      title: 'Title 1'
    },
  ]);
  const itemTemplate = (item) => {
    return <img src={item.itemImageSrc} alt={item.alt} style={{ width: '100%', height: '100%', maxHeight: '600px', objectFit: 'cover', display: 'block', borderRadius: '10px' }} />;
  };
  const thumbnailTemplate = (item) => {
    return <img src={item.itemImageSrc} alt={item.alt} style={{ width: '100%', height: '100%', display: 'block' }} />;
  };
  return (
    <div className="flex flex-column ">
      <div style={{ width: '90%', maxWidth: '1400px', margin: 'auto', paddingTop: '60px' }}>
        <Galleria
          value={images}
          numVisible={4}
          circular
          showItemNavigators
          showItemNavigatorsOnHover
          showIndicators
          showThumbnails={false}
          item={itemTemplate}
          thumbnail={thumbnailTemplate}
        />
        <div>
          <h2>แนะนำ</h2>
        </div>
        <div class="flex gap-5 justify-content-center flex-wrap">
            <img src={image4} alt="recommend-4" style={{ width: '100%',maxHeight: '360px',maxWidth: '680px', objectFit: 'cover', borderRadius: '10px' }} />
            <img src={image2} alt="recommend-5" style={{ width: '100%',maxHeight: '360px',maxWidth: '680px', objectFit: 'cover', borderRadius: '10px' }} />
        </div>
        <div class="mt-4">
          <h2>สินค้ายอดนิยม</h2>
        </div>
        <div className="flex gap-5 justify-content-center flex-wrap" >
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
              />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Home;
