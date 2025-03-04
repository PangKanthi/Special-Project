import React from 'react';
import { Card } from 'primereact/card';
import { Link } from 'react-router-dom';

const ProductList = ({ products }) => {
  return (
    <div className="lg:flex-1 flex gap-4 justify-content-center flex-wrap flex-wrap lg:pt-4">
      {products.map((product, index) => (
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
  );
};

export default ProductList;
