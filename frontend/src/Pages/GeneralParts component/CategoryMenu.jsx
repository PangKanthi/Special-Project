import React from 'react';
import { Divider } from 'primereact/divider';

const CategoryMenu = ({ menuOptions, selectedMenu, setSelectedMenu }) => {
  return (
    <div className="hidden lg:block pl-5 pt-2">
      <h3>ชนิดอะไหล่ประตูม้วน</h3>
      {menuOptions.map((option, index) => (
        <p
          key={index}
          onClick={() => setSelectedMenu(option.value)}
          style={{
            cursor: 'pointer',
            color: selectedMenu === option.value ? 'blue' : 'black',
          }}
        >
          {option.label}
        </p>
      ))}
      <Divider type="solid" />
    </div>
  );
};

export default CategoryMenu;
