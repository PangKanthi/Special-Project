import React from 'react';
import { Menubar } from 'primereact/menubar';
import { useNavigate } from 'react-router-dom';
import { Button } from 'primereact/button';
import 'primeflex/primeflex.css';
import './Nav.css';
import { classNames } from 'primereact/utils';


const Navbar = () => {
  const navigate = useNavigate();

  const items = [
    { 
        label: 'หน้าแรก', 
        icon: 'pi pi-fw pi-home text-white',
        command: () => { navigate("/") }},
    { 
      label: 'ประตูบานเลื่อน', 
      icon: 'pi pi-fw pi-list', 
      items: [
        { 
            label: 'อัตโนมัติ', 
            command: () => { navigate("/automatic") } 
        },
        { 
            label: 'ธรรมดา', 
            command: () => { navigate("/manual") } 
        },
      ] 
    },
    { 
      label: 'อะไหล่ประตูบานเลื่อน', 
      icon: 'pi pi-fw pi-cog', 
      items: [
        { 
            label: 'ชิ้นส่วนทั่วไป', 
            command: () => { navigate("/parts/general") } 
        },
        { 
            label: 'ชิ้นส่วนพิเศษ', 
            command: () => { navigate("/parts/special") } 
        },
      ] 
    },
    { 
        label: 'แจ้งซ่อม', 
        icon: 'pi pi-fw pi-wrench', 
        command: () => { navigate("/repair") } 
    },
    { 
        label: 'เกี่ยวกับเรา', 
        icon: 'pi pi-fw pi-info', 
        command: () => { navigate("/about") } 
    },
    { 
        label: 'ผลงานของเรา', 
        icon: 'pi pi-fw pi-thumbs-up', 
        command: () => { navigate("/portfolio") } 
    },
    { 
        label: 'ติดต่อเรา', 
        icon: 'pi pi-fw pi-phone', 
        command: () => { navigate("/contact") } 
    },
  ];

  const start = <img alt="logo" src="../assets/logo.png" height="40" className="mx-6" />;
  const end = <Button label="LOGIN" icon="pi pi-sign-in" className="p-button-rounded p-button-info mx-6 " />;

  return (
    <div className="p-d-flex p-jc-center p-ai-center p-p-2 m-auto ">
      <Menubar 
        start={start}
        model={items} 
        end={end}
        className="p-mb-4 p-text-center m-auto" />
    </div>
  );
};

export default Navbar;
