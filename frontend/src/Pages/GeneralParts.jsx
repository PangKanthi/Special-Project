import React, { useState } from 'react';
import 'primeflex/primeflex.css';
import { Card } from 'primereact/card';
import { Divider } from 'primereact/divider';
import { InputText } from 'primereact/inputtext';
import { Button } from 'primereact/button';
import { Link } from 'react-router-dom';
import { Dropdown } from 'primereact/dropdown';
import useFetchData from '../Hooks/useFetchData';

const GeneralParts = () => {
  const [search, setSearch] = useState('');
  const [selectedMenu, setSelectedMenu] = useState(null);
  const { data: GeneralParts, isLoading, error } = useFetchData('/mockData/rollerdoor_parts.json');

  const menuOptions = [

  ];

  const filterGeneralParts = GeneralParts?.filter(product =>
    product.name.toLowerCase().includes(search.toLowerCase())
  );

  if (isLoading) {
    return <div className="text-center p-mt-5">Loading...</div>;
  }

  if (error) {
    return <div className="text-center p-mt-5">Error: {error}</div>;
  }

  return (
    <div className='px-4 lg:px-8'>
      <div className='text-center pt-4'>
        <h1> อะไหล่ประตูม้วน </h1>
      </div>
      <div className="flex justify-content-end lg:pr-8">
        <div className='flex' style={{ width: '400px', boxShadow: '0px 4px 8px rgba(0, 0, 0, 0.1)', padding: '1px', borderRadius: '25px' }}>
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
      <div className='flex flex-column lg:flex-row'>
        <div className="block lg:hidden mt-2">
          <Dropdown
            value={selectedMenu}
            options={menuOptions}
            onChange={(e) => setSelectedMenu(e.value)}
            placeholder="เลือกชนิดอะไหล่"
            className="p-dropdown-compact"
            style={{ borderRadius: '25px 25px 25px 25px' }}
          />
        </div>

        {/* เมนูในจอใหญ่ */}
        <div className="hidden lg:block pl-5 pt-2">
          <h3>ชนิดของอะไหล่</h3>
          {menuOptions.map((option, index) => (
            <p key={index}>{option.label}</p>
          ))}
          <Divider type="solid" />
        </div>
        <div className="lg:flex-1 flex gap-4 justify-content-center flex-wrap flex-wrap lg:pt-4">
          {filterGeneralParts.map((product, index) => (
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