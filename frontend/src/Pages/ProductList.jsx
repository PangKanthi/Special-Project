import React, { useState } from 'react';
import { Card } from 'primereact/card';
import { Button } from 'primereact/button';

const ProductList = () => {
  const [products, setProducts] = useState([
    { id: 1, name: 'Automatic Sliding Door Model A', price: '$1000' },
    { id: 2, name: 'Automatic Sliding Door Model B', price: '$1500' },
    { id: 3, name: 'Automatic Sliding Door Model C', price: '$2000' }
  ]);

  return (
    <div className="p-grid">
      {products.map(product => (
        <div key={product.id} className="p-col-12 p-md-4">
          <Card title={product.name} subTitle={product.price}>
            <p>Some description about the product.</p>
            <Button label="Buy Now" icon="pi pi-shopping-cart" />
          </Card>
        </div>
      ))}
    </div>
  );
};

export default ProductList;
