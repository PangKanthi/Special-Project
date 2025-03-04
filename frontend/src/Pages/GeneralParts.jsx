import React, { useState } from 'react';
import 'primeflex/primeflex.css';
import { InputText } from 'primereact/inputtext';
import { Button } from 'primereact/button';
import { Paginator } from 'primereact/paginator';
import useFetchData from '../Hooks/useFetchData';
import CategoryMenu from './GeneralParts component/CategoryMenu';
import ProductList from './GeneralParts component/ProductList';

const GeneralParts = () => {
  const [search, setSearch] = useState('');
  const [selectedMenu, setSelectedMenu] = useState(null);
  const [first, setFirst] = useState(0);
  const [rows, setRows] = useState(12);

  const { data: GeneralParts, isLoading, error } = useFetchData('/mockData/rollerdoor_parts.json');

  const menuOptions = [
    { label: 'ทั้งหมด', value: null },
    { label: 'มอเตอร์', value: 'motor' },
    { label: 'รีโมท', value: 'remote' },
    { label: 'แผงวงจร', value: 'circuit' },
  ];

  let filteredGeneralParts = GeneralParts?.filter(product =>
    product.name.toLowerCase().includes(search.toLowerCase()) &&
    (selectedMenu ? product.type === selectedMenu : true)
  );

  const paginatedGeneralParts = filteredGeneralParts?.slice(first, first + rows);

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
        <CategoryMenu selectedMenu={selectedMenu} setSelectedMenu={setSelectedMenu} setFirst={setFirst} menuOptions={menuOptions} />
        <ProductList products={paginatedGeneralParts} />
      </div>
      {/* Pagination */}
      <Paginator
        first={first}
        rows={rows}
        totalRecords={filteredGeneralParts.length}
        onPageChange={(e) => setFirst(e.first)}
        className="mt-4"
      />
    </div>
  );
};

export default GeneralParts;
