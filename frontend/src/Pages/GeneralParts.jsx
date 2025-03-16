import React, { useState, useEffect } from 'react';
import 'primeflex/primeflex.css';
import { InputText } from 'primereact/inputtext';
import { Button } from 'primereact/button';
import { Paginator } from 'primereact/paginator';
import { Dropdown } from 'primereact/dropdown';
import ProductList from './GeneralParts component/ProductList';
import CategoryMenu from './GeneralParts component/CategoryMenu';

const GeneralParts = () => {
  const [search, setSearch] = useState('');
  const [selectedMenu, setSelectedMenu] = useState(null);
  const [products, setProducts] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  const [first, setFirst] = useState(0);
  const [rows, setRows] = useState(12);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        setIsLoading(true);
        setError(null);

        const res = await fetch(`http://localhost:1234/api/products`);
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

  const menuOptions = [
    { label: "ทั้งหมด", value: null },
    { label: "แผ่นประตูม้วน", value: "แผ่นประตูม้วน" },
    { label: "เสารางประตูม้วน", value: "เสารางประตูม้วน" },
    { label: "แกนเพลาประตูม้วน", value: "แกนเพลาประตูม้วน" },
    { label: "กล่องเก็บม้วนประตู", value: "กล่องเก็บม้วนประตู" },
    { label: "ตัวล็อกประตูม้วน", value: "ตัวล็อกประตูม้วน" },
    { label: "กุญแจประตูม้วน", value: "กุญแจประตูม้วน" },
    { label: "รอกโซ่ประตูม้วน", value: "รอกโซ่ประตูม้วน" },
    { label: "ชุดเฟืองโซ่ประตูม้วน", value: "ชุดเฟืองโซ่ประตูม้วน" },
    { label: "โซ่ประตูม้วน", value: "โซ่ประตูม้วน" },
    { label: "ตัวล็อคโซ่สาว", value: "ตัวล็อคโซ่สาว" },
    { label: "ชุดมอเตอร์ประตูม้วน", value: "ชุดมอเตอร์ประตูม้วน" },
    { label: "สวิตช์กดควบคุม", value: "สวิตช์กดควบคุม" },
  ];  

  let filteredProducts = products.filter((product) => {
    const matchPart = product.is_part === true;
    const matchStatus = product.status === false;
    const matchSearch = product.name
      .toLowerCase()
      .includes(search.toLowerCase());
    const matchMenu = selectedMenu ? product.category === selectedMenu : true;

    return matchPart && matchSearch && matchMenu && matchStatus;
  });

  const paginatedProducts = filteredProducts.slice(first, first + rows);

  if (isLoading) return <div className="text-center p-mt-5">Loading...</div>;
  if (error) return <div className="text-center p-mt-5">Error: {error}</div>;

  return (
    <div className="px-4 lg:px-8">
      <div className="text-center pt-4">
        <h1> อะไหล่ประตูม้วน </h1>
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
        onPageChange={(e) => setFirst(e.first)}
        className="mt-4"
      />
    </div>
  );
};

export default GeneralParts;
