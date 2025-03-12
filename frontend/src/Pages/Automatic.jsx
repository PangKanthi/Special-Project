import React, { useState, useEffect } from 'react';
import 'primeflex/primeflex.css';
import { InputText } from 'primereact/inputtext';
import { Button } from 'primereact/button';
import { Paginator } from 'primereact/paginator';
import { Dropdown } from 'primereact/dropdown';
import ProductList from './Automatic component/ProductList';
import CategoryMenu from './Automatic component/CategoryMenu';

const Automatic = () => {
  const [search, setSearch] = useState('');
  const [selectedMenu, setSelectedMenu] = useState(null);
  const [products, setProducts] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  // Pagination
  const [first, setFirst] = useState(0);
  const [rows, setRows] = useState(6);

  const onPageChange = (event) => {
    setFirst(event.first);
    setRows(event.rows);
};

  // ดึงสินค้าจาก backend
  useEffect(() => {
    const fetchProducts = async () => {
      try {
        setIsLoading(true);
        setError(null);

        const res = await fetch('http://localhost:1234/api/products');
        if (!res.ok) {
          throw new Error('Failed to fetch products');
        }
        const data = await res.json();
        setProducts(data);
      } catch (error) {
        console.error(error);
        setError(error.message);
      } finally {
        setIsLoading(false);
      }
    };

    fetchProducts();
  }, []);

  // เมนูกรองตามค่า category ใน DB
  const menuOptions = [
    { label: 'ทั้งหมด', value: null },
    { label: 'ประตูม้วนแบบไฟฟ้า', value: 'electric_shutter' },
    { label: 'ประตูม้วนแบบรอกโซ่', value: 'chain_electric_shutter' },
    { label: 'ประตูม้วนแบบสปริง', value: 'spring_shutter' },
  ];

  // กรองฝั่ง Frontend
  let filteredProducts = products.filter((product) => {
    // เงื่อนไขหลักๆ:
    // 1) ต้อง is_part === false
    // 2) ค้นหาจาก search ใน name
    // 3) ถ้า selectedMenu != null ต้อง product.category === selectedMenu
    const matchPart = product.is_part === false;
    const matchSearch = product.name
      .toLowerCase()
      .includes(search.toLowerCase());
    const matchMenu = selectedMenu ? product.category === selectedMenu : true;

    return matchPart && matchSearch && matchMenu;
  });

  // Pagination
  const paginatedProducts = filteredProducts.slice(first, first + rows);

  if (isLoading) return <div className="text-center p-mt-5">Loading...</div>;
  if (error) return <div className="text-center p-mt-5">Error: {error}</div>;

  return (
    <div className="px-4 lg:px-8">
      <div className="text-center pt-4">
        <h1> ประตูม้วน </h1>
      </div>

      {/* ช่องค้นหา */}
      <div className="flex justify-content-end lg:pr-8">
        <div
          className="flex"
          style={{
            width: '400px',
            boxShadow: '0px 4px 8px rgba(0, 0, 0, 0.1)',
            padding: '1px',
            borderRadius: '25px',
          }}
        >
          <InputText
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="ค้นหา"
            style={{
              width: '100%',
              border: 'none',
              outline: 'none',
              paddingLeft: '10px',
              borderRadius: '25px 0 0 25px',
            }}
          />
          <Button
            icon="pi pi-search"
            className="p-button-secondary"
            style={{
              borderRadius: '0px 25px 25px 0px',
              backgroundColor: '#0a74da',
              border: 'none',
              width: '40px',
              height: '40px',
            }}
          />
        </div>
      </div>

      {/* Dropdown (เมื่อจอเล็ก) */}
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

      {/* Category Menu (เมื่อจอใหญ่) + ส่วนแสดงผล */}
      <div className="flex flex-column lg:flex-row">
        <CategoryMenu
          menuOptions={menuOptions}
          selectedMenu={selectedMenu}
          setSelectedMenu={setSelectedMenu}
        />
        
        <ProductList products={paginatedProducts} />
      </div>

      {/* Paginator */}
      <Paginator
        first={first}
        rows={rows}
        totalRecords={filteredProducts.length}
        onPage={onPageChange}
        className="mt-4"
      />
    </div>
  );
};

export default Automatic;
