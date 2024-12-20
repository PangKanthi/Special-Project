import React from 'react';
import { Menubar } from 'primereact/menubar';
import { useNavigate } from 'react-router-dom';
import { Button } from 'primereact/button';
import 'primeflex/primeflex.css';

const menuItems = (navigate) => [
  {
    label: <span className="text-lg text-gray-900">หน้าแรก</span>,
    icon: 'pi pi-fw pi-home text-gray-900',
    command: () => navigate("/home"),
  },
  {
    label: <span className="text-lg text-gray-900">ประตูบานเลื่อน</span>,
    icon: 'pi pi-fw pi-list text-gray-900',
    items: [
      {
        label: <span className="text-lg text-gray-900">อัตโนมัติ</span>,
        command: () => navigate("/automatic"),
      },
      {
        label: <span className="text-lg text-gray-900">ธรรมดา</span>,
        command: () => navigate("/manual"),
      },
    ],
  },
  {
    label: <span className="text-lg text-gray-900">อะไหล่ประตูบานเลื่อน</span>,
    icon: 'pi pi-fw pi-cog text-gray-900',
    items: [
      {
        label: <span className="text-lg text-gray-900">ชิ้นส่วนทั่วไป</span>,
        command: () => navigate("/generalparts"),
      },
      {
        label: <span className="text-lg text-gray-900">ชิ้นส่วนพิเศษ</span>,
        command: () => navigate("/specialparts"),
      },
    ],
  },
  {
    label: <span className="text-lg text-gray-900">แจ้งซ่อม</span>,
    icon: 'pi pi-fw pi-wrench text-gray-900',
    command: () => navigate("/repair"),
  },
  {
    label: <span className="text-lg text-gray-900">เกี่ยวกับเรา</span>,
    icon: 'pi pi-fw pi-info text-gray-900',
    command: () => navigate("/about"),
  },
  {
    label: <span className="text-lg text-gray-900">ผลงานของเรา</span>,
    icon: 'pi pi-fw pi-thumbs-up text-gray-900',
    command: () => navigate("/portfolio"),
  },
  {
    label: <span className="text-lg text-gray-900">ติดต่อเรา</span>,
    icon: 'pi pi-fw pi-phone text-gray-900',
    command: () => navigate("/contact"),
  }
];

const Navbar = () => {
  const navigate = useNavigate();

  const start = (
    <img alt="logo" src="../assets/logo.png" height="60" className="mx-8 pr-8 " onClick={() => navigate("/home")} />
  );
  
  const end = (
    <div className="flex">
      <Button
        label="Login"
        icon="pi pi-sign-in"
        className="p-button-rounded p-button-info mx-1 "
        onClick={() => navigate("/login")}
        style={{backgroundColor: '#000000', borderColor: '#000000'}}
      />
    </div>
    
  );

  const navbarStyle = {
    position: 'fixed',
    top: 0,
    left: 0,
    right: 0,
    zIndex: 1000,
  };

  return (
    <div style={navbarStyle}>
      <Menubar 
        start={start}
        model={menuItems(navigate)}
        end={end}
        className="w-full max-w-screen-lg"
      />
    </div>
  );
};

export default Navbar;