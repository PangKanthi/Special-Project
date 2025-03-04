import React, { useState } from 'react';
import 'primeflex/primeflex.css';
import { InputText } from 'primereact/inputtext';
import { Button } from 'primereact/button';
import { Paginator } from 'primereact/paginator';
import { Dropdown } from 'primereact/dropdown';
import useFetchData from '../Hooks/useFetchData';
import ProductList from './Automatic component/ProductList';
import CategoryMenu from './Automatic component/CategoryMenu';

const Automatic = () => {
  const [search, setSearch] = useState('');
  const [selectedMenu, setSelectedMenu] = useState(null);
  const [first, setFirst] = useState(0);
  const [rows, setRows] = useState(12);

  const { data: productAuto, isLoading, error } = useFetchData('/mockData/rollerdoor_products.json');

  const menuOptions = [
    { label: 'ทั้งหมด', value: null },
    { label: 'ประตูม้วน แบบไฟฟ้า', value: 'manual' },
    { label: 'ประตูม้วน แบบรอกโซ่', value: 'chain' },
    { label: 'ประตูม้วน แบบสปริง', value: 'motor' },
  ];

  let filteredProducts = productAuto?.filter(product =>
    product.name.toLowerCase().includes(search.toLowerCase()) &&
    (selectedMenu ? product.type === selectedMenu : true)
  );

  // Pagination
  const paginatedProducts = filteredProducts?.slice(first, first + rows);

  if (isLoading) {
    return <div className="text-center p-mt-5">Loading...</div>;
  }

  if (error) {
    return <div className="text-center p-mt-5">Error: {error}</div>;
  }

  return (
    <div className="px-4 lg:px-8">
      <div className="text-center pt-4">
        <h1> ประตูม้วน </h1>
      </div>

      <div className="flex justify-content-end lg:pr-8">
        <div className="flex" style={{ width: '400px', boxShadow: '0px 4px 8px rgba(0, 0, 0, 0.1)', padding: '1px', borderRadius: '25px' }}>
          <InputText
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="ค้นหา"
            style={{
              width: '100%',
              border: 'none',
              outline: 'none',
              paddingLeft: '10px',
              borderRadius: '25px 0 0 25px'
            }}
          />
          <Button icon="pi pi-search" className="p-button-secondary" style={{ borderRadius: '0px 25px 25px 0px', backgroundColor: '#0a74da', border: 'none', width: '40px', height: '40px' }} />
        </div>
      </div>

      <div className="block lg:hidden mt-2">
        <Dropdown
          value={selectedMenu}
          options={menuOptions}
          onChange={(e) => setSelectedMenu(e.value)}
          placeholder="ชนิดของประตูม้วน"
          className="p-dropdown-compact"
          style={{ borderRadius: '25px' }}
        />
      </div>

      <div className="flex flex-column lg:flex-row">
        <CategoryMenu menuOptions={menuOptions} selectedMenu={selectedMenu} setSelectedMenu={setSelectedMenu} />
        <ProductList products={paginatedProducts} />
      </div>

      <Paginator
        first={first}
        rows={rows}
        totalRecords={filteredProducts.length}
        onPageChange={(e) => setFirst(e.first)}
        className="mt-4"
      />
    </div>
  );
};

export default Automatic;
