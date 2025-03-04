import React from 'react';
import { Link } from 'react-router-dom';
import { Card } from 'primereact/card';

const ProductList = ({ products }) => {
  return (
    <div className="lg:flex-1 flex gap-4 justify-content-center flex-wrap lg:pt-4">
      {products.map((product, index) => (
        <div key={index} style={{ width: '325px' }}>
          <Link to={`/productAuto/${product.id}`} style={{ textDecoration: 'none' }}>
            <Card
              title={product.name}
              subTitle={product.description}
              header={
                <img
                  alt={product.name}
                  src={product.image}
                  className="w-full"
                  style={{ width: '100%', height: '325px', borderRadius: '10px' }}
                />
              }
              footer={<span style={{ color: 'red', fontWeight: 'bold' }}>{Number(product.price).toLocaleString()} บาท</span>}
              className="m-2 p-shadow-5"
            />
          </Link>
        </div>
      ))}
    </div>
  );
};

export default ProductList;
