import React from 'react';
import { Menubar } from 'primereact/menubar';
import { useNavigate } from 'react-router-dom';
import { Button } from 'primereact/button';
import 'primeflex/primeflex.css';

const Navbar = () => {
  const navigate = useNavigate();

  const menuItems = [
    {
      label: <span className="text-lg">หน้าแรก</span>,
      icon: 'pi pi-fw pi-home',
      command: () => navigate("/"),
    },
    {
      label: <span className="text-lg">ประตูบานเลื่อน</span>,
      icon: 'pi pi-fw pi-list',
      items: [
        {
          label: <span className="text-lg">อัตโนมัติ</span>,
          command: () => navigate("/automatic"),
        },
        {
          label: <span className="text-lg">ธรรมดา</span>,
          command: () => navigate("/manual"),
        },
      ],
    },
    {
      label: <span className="text-lg">อะไหล่ประตูบานเลื่อน</span>,
      icon: 'pi pi-fw pi-cog',
      items: [
        {
          label: <span className="text-lg">ชิ้นส่วนทั่วไป</span>,
          command: () => navigate("/parts/general"),
        },
        {
          label: <span className="text-lg">ชิ้นส่วนพิเศษ</span>,
          command: () => navigate("/parts/special"),
        },
      ],
    },
    {
      label: <span className="text-lg">แจ้งซ่อม</span>,
      icon: 'pi pi-fw pi-wrench',
      command: () => navigate("/repair"),
    },
    {
      label: <span className="text-lg">เกี่ยวกับเรา</span>,
      icon: 'pi pi-fw pi-info',
      command: () => navigate("/about"),
    },
    {
      label: <span className="text-lg">ผลงานของเรา</span>,
      icon: 'pi pi-fw pi-thumbs-up',
      command: () => navigate("/portfolio"),
    },
    {
      label: <span className="text-lg">ติดต่อเรา</span>,
      icon: 'pi pi-fw pi-phone',
      command: () => navigate("/contact"),
    }
  ];

  const start = (
    <img alt="logo" src="../assets/logo.png" height="60" className="mx-8 pr-8" />
  );
  
  const end = (
    <div className="flex">
      <Button
        label="เข้าสู่ระบบ"
        icon="pi pi-sign-in"
        className="p-button-rounded p-button-info mx-1"
        onClick={() => navigate("/login")}
      />
    </div>
  );

  return (
    <div className="flex justify-content-center">
      <Menubar 
        start={start}
        model={menuItems}
        end={end}
        className="w-full max-w-screen-lg"
      />
    </div>
  );
};

export default Navbar;
