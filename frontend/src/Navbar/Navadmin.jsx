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
};

export default Navadmin;