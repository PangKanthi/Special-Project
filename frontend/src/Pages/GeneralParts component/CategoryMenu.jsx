import React from 'react';
import { Divider } from 'primereact/divider';
import { Dropdown } from 'primereact/dropdown';

const CategoryMenu = ({ selectedMenu, setSelectedMenu, setFirst, menuOptions }) => {
  return (
    <>
      {/* เมนูในจอเล็ก */}
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
          <p
            key={index}
            onClick={() => {
              setSelectedMenu(option.value);
              setFirst(0); // รีเซ็ต Pagination เมือเปลี่ยนหมวดหมู่
            }}
            style={{
              cursor: 'pointer',
              color: selectedMenu === option.value ? 'blue' : 'black',
              fontWeight: selectedMenu === option.value ? 'bold' : 'normal'
            }}
          >
            {option.label}
          </p>
        ))}
        <Divider type="solid" />
      </div>
    </>
  );
};

export default CategoryMenu;
