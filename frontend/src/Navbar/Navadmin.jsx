import { Menubar } from 'primereact/menubar';
import { Avatar } from 'primereact/avatar';
import { Menu } from 'primereact/menu';
import { useRef, useState } from 'react';
import { PrimeIcons } from 'primereact/api';
import { Button } from 'primereact/button';
import { Badge } from 'primereact/badge';
import { Sidebar } from 'primereact/sidebar';
import { useNavigate } from 'react-router-dom';

export default function Navbar() {
  const menu = useRef(null);
  const [visible, setVisible] = useState(false);
  const navigate = useNavigate();
  const pathname = window.location.pathname;

  const items = [
    { label: 'Logout', icon: PrimeIcons.POWER_OFF }
  ];

  const sidebarItems = [
    { label: 'หน้าแรก', icon: PrimeIcons.HOME, action: () => navigate('/homeadmin'), className: pathname === '/homeadmin' ? 'font-bold text-black' : '' },
    { label: 'จัดการออเดอร์', icon: PrimeIcons.SHOPPING_CART, action: () => navigate('/manageorders'), className: pathname === '/manageorders' ? 'font-bold text-black' : '' },
    { label: 'จัดการสินค้า', icon: PrimeIcons.BOX, className: pathname === '/products' ? 'font-bold text-black' : '' },
    { label: 'จัดการสมาชิก', icon: PrimeIcons.USERS, className: pathname === '/members' ? 'font-bold text-black' : '' },
    { label: 'จัดการโปรโมชั่น', icon: PrimeIcons.TAG, className: pathname === '/promotions' ? 'font-bold text-black' : '' },
    { label: 'จัดการผลงาน', icon: PrimeIcons.BRIEFCASE, className: pathname === '/projects' ? 'font-bold text-black' : '' },
    { label: 'ประวัติ', icon: PrimeIcons.BOOK, className: pathname === '/history' ? 'font-bold text-black' : '' }
  ];

  const start = (
    <Button icon="pi pi-bars" className="p-button-text p-button-rounded text-white text-xl" onClick={() => setVisible(true)} />
  );

  const end = (
    <div className="flex align-items-center gap-4">
      <div className="relative">
        <Button icon="pi pi-bell" className="p-button-text p-button-rounded text-white text-xl" />
        <Badge value="6" severity="danger" className="absolute top-0 right-0" />
      </div>
      <div className="flex align-items-center gap-2 cursor-pointer" onClick={(e) => menu.current.toggle(e)}>
        <Avatar image="https://via.placeholder.com/40" shape="circle" />
        <div className="text-white">
          <div className="font-bold">Moni Roy</div>
          <div className="text-sm">Admin</div>
        </div>
      </div>
      <Menu model={items} popup ref={menu} id="popup_menu" />
    </div>
  );

  return (
    <>
      <Menubar
        start={start}
        end={end}
        className="p-3 w-full fixed top-0 left-0 z-[9999]"
        style={{ backgroundColor: '#026DCA', border: 'none' }}
      />
      <Sidebar visible={visible} onHide={() => setVisible(false)} className="p-sidebar-sm">
        <div className="flex flex-column align-items-start p-3" style={{ textAlign: 'left' }}>
          <div className="w-full flex justify-content-center pb-3 border-bottom-1 border-gray-300">
            <img src="../assets/logo.png" alt="Logo" width="137" height="96" />
          </div>
          <div className="w-full pt-3">
            {sidebarItems.map((item, index) => (
              <div key={index} className={`p-3 cursor-pointer w-full ${item.className || ''}`} onClick={item.action}>
                <i className={`pi ${item.icon} mr-2`} /> {item.label}
              </div>
            ))}
          </div>
        </div>
      </Sidebar>
    </>
  );
}