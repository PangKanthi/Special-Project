import React, { useState, useEffect } from 'react';
import { Galleria } from 'primereact/galleria';
import { Card } from 'primereact/card';
import 'primeflex/primeflex.css';
import useFetchData from '../Hooks/useFetchData';

const Home = () => {
  const { data: slideshowImages, isLoading: slideshowLoading } = useFetchData('/mockData/slideshow_images.json');
  const { data: rollerdoorProducts, isLoading: productsLoading } = useFetchData('/mockData/rollerdoor_products.json');
  const { data: featuredProducts, isLoading: featuredLoading } = useFetchData('/mockData/featured_products.json');

  const itemTemplate = (item) => {
    return (
      <img
        src={item.image}
        alt={item.title}
        style={{
          width: '100%',
          height: '100%',
          maxHeight: '600px',
          objectFit: 'cover',
          display: 'block',
          borderRadius: '10px',
        }}
      />
    );
  };

  if (slideshowLoading || productsLoading || featuredLoading) {
    return <div>Loading...</div>;
  }

  return (
    <div className="flex flex-column">
      <div style={{ width: '90%', maxWidth: '1400px', margin: 'auto', paddingTop: '60px' }}>
        {/* Slideshow */}
        <Galleria
          value={slideshowImages}
          numVisible={4}
          circular
          showItemNavigators
          showItemNavigatorsOnHover
          showIndicators
          showThumbnails={false}
          item={itemTemplate}
        />
        <div>
          <h2>สินค้าแนะนำ</h2>
        </div>
        {/* สินค้าแนะนำ */}
        <div className="flex gap-5 justify-content-center flex-wrap">
          {featuredProducts.map((image, index) => (
            <img
              key={index}
              src={image.image}
              alt={image.title}
              style={{
                width: '100%',
                maxHeight: '360px',
                maxWidth: '680px',
                objectFit: 'cover',
                borderRadius: '10px',
              }}
            />
          ))}
        </div>
        <div className="mt-4">
          <h2>สินค้ายอดนิยม</h2>
        </div>
        {/* สินค้ายอดนิยม */}
        <div className="flex gap-5 justify-content-center flex-wrap">
          {rollerdoorProducts.map((product) => (
            <div key={product.id} style={{ width: '325px', minHeight: '450px' }}>
              <Card
                title={product.name}
                subTitle={product.description}
                style={{ height: '100%' }}
                header={
                  <img
                    alt={product.name}
                    src={product.image}
                    style={{ width: '100%', height: '325px', borderRadius: '10px' }}
                  />
                }
                footer={
                  <span style={{ color: 'red', fontWeight: 'bold' }}>
                    {product.price ? `${product.price.toLocaleString()} บาท` : 'ไม่มีข้อมูลราคา'}
                  </span>
                }
              />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Home;
