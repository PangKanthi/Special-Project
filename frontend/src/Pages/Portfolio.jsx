import React, { useState } from 'react';
import useFetchData from '../Hooks/useFetchData';
import 'primeflex/primeflex.css';
import { Card } from 'primereact/card';

const Portfolio = () => {
  const [search, setSearch] = useState('');
  const [selectedMenu, setSelectedMenu] = useState(null);
  const { data: productAuto, isLoading, error } = useFetchData('/mockData/rollerdoor_products.json');

  const filterProducts = productAuto?.filter(product =>
    product.name.toLowerCase().includes(search.toLowerCase())
  );

  if (isLoading) {
    return <div className="text-center p-mt-5">Loading...</div>;
  }

  if (error) {
    return <div className="text-center p-mt-5">Error: {error}</div>;
  }

  return (
    <div className='pl-8 pr-8'>
      <div style={{ textAlign: 'center' }}>
        <h1>ผลงาน</h1>
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
  );
};

export default Portfolio;