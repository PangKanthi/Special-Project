import React, { useState, useEffect } from 'react';
import { Menubar } from 'primereact/menubar';
import { useNavigate } from 'react-router-dom';
import { Button } from 'primereact/button';
import UserMenu from '../User Pages/UserMenu';
import 'primeflex/primeflex.css';

const menuItems = (navigate) => [
  {
    label: <span className="text-lg text-gray-900">หน้าแรก</span>,
    icon: 'pi pi-fw pi-home text-gray-900',
    command: () => navigate("/home"),
  },
  {
    label: <span className="text-lg text-gray-900">ประตูบานเลื่อน</span>,
    command: () => navigate("/automatic"),
    icon: 'pi pi-fw pi-list text-gray-900',
  },
  {
    label: <span className="text-lg text-gray-900">อะไหล่ประตูบานเลื่อน</span>,
    command: () => navigate("/generalparts"),
    icon: 'pi pi-fw pi-cog text-gray-900',
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
  },
];

const Navbar = () => {
  const navigate = useNavigate();
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [user, setUser] = useState(null);

  useEffect(() => {
    const checkLoginStatus = () => {
      if (localStorage.getItem('token')) {
        setIsLoggedIn(true);
      } else {
        setIsLoggedIn(false);
      }
    };

    checkLoginStatus(); // Check login status when the component mounts

    const intervalId = setInterval(checkLoginStatus, 1000); // Check every second for updates

    return () => clearInterval(intervalId); // Cleanup the interval on component unmount
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('token');
    setIsLoggedIn(false);
    navigate("/home");
  };

  const start = (
    <div className='lg:mr-8 lg:ml-8'>
    <img
      alt="logo"
      src="../assets/logo.png"
      height="60"
      className="mx-2 pr-2 transition-all transition-duration-300 cursor-pointer hover:scale-110 hover:opacity-80"
      onClick={() => navigate("/home")}
    />
    </div>
  );  

  const end = (
    <div className="flex">
      {!isLoggedIn ? (
        <Button
          label="Login"
          icon="pi pi-sign-in"
          className="p-button-rounded p-button-info mx-1 "
          onClick={() => navigate("/login")}
          style={{ backgroundColor: '#000000', borderColor: '#000000' }}
        />
      ) : (
        <UserMenu />
      )}
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
