import { Menubar } from "primereact/menubar";
import { Avatar } from "primereact/avatar";
import { Menu } from "primereact/menu";
import { useRef, useState } from "react";
import { PrimeIcons } from "primereact/api";
import { Button } from "primereact/button";
import { Sidebar } from "primereact/sidebar";
import { useNavigate } from "react-router-dom";
import { useEffect } from "react";

export default function Navbar() {
  const menu = useRef(null);
  const [visible, setVisible] = useState(false);
  const navigate = useNavigate();
  const pathname = window.location.pathname;
  const [profile, setProfile] = useState(null);

  const handleLogout = () => {
    localStorage.removeItem("token");
    setTimeout(() => {
      navigate("/home");
    }, 100);
  };

  useEffect(() => {
    const fetchProfile = async () => {
      const token = localStorage.getItem("token");
      if (!token) return;

      try {
        const res = await fetch(`${process.env.REACT_APP_API}/api/users/me`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        const data = await res.json();
        setProfile(data);
      } catch (err) {
        console.error("Error fetching profile:", err);
      }
    };

    fetchProfile();
  }, []);

  const items = [
    { label: "Logout", icon: PrimeIcons.POWER_OFF, command: handleLogout },
  ];

  const sidebarItems = [
    {
      label: "หน้าแรก",
      icon: PrimeIcons.HOME,
      action: () => navigate("/homeadmin"),
      className: pathname === "/homeadmin" ? "font-bold text-black" : "",
    },
    {
      label: "จัดการออเดอร์",
      icon: PrimeIcons.SHOPPING_CART,
      action: () => navigate("/manageorders"),
      className: pathname === "/manageorders" ? "font-bold text-black" : "",
    },
    {
      label: "จัดการคำขอซ่อม",
      icon: PrimeIcons.TAG,
      action: () => navigate("/managerepairrequests"),
      className:
        pathname === "/managerepairrequests" ? "font-bold text-black" : "",
    },
    {
      label: "จัดการสินค้า",
      icon: PrimeIcons.BOX,
      action: () => navigate("/manageproducts"),
      className: pathname === "/manageproducts" ? "font-bold text-black" : "",
    },
    {
      label: "จัดการสมาชิก",
      icon: PrimeIcons.USERS,
      action: () => navigate("/manageusers"),
      className: pathname === "/manageusers" ? "font-bold text-black" : "",
    },
    {
      label: "จัดการผลงาน",
      icon: PrimeIcons.BRIEFCASE,
      action: () => navigate("/manageportfolios"),
      className: pathname === "/manageportfolios" ? "font-bold text-black" : "",
    },
    {
      label: "ประวัติ",
      icon: PrimeIcons.BOOK,
      action: () => navigate("/history"),
      className: pathname === "/history" ? "font-bold text-black" : "",
    },
  ];

  const start = (
    <Button
      icon="pi pi-bars"
      className="p-button-text p-button-rounded text-white text-xl"
      onClick={() => setVisible(true)}
    />
  );

  const end = (
    <div className="flex align-items-center gap-4">
      <div
        className="flex align-items-center gap-2 cursor-pointer"
        onClick={(e) => menu.current.toggle(e)}
      >
        <div className="text-white">
          <div className="font-bold">
            {profile
              ? `${profile.firstname} ${profile.lastname}`
              : "Loading..."}
          </div>
          <div className="text-sm">Admin</div>
        </div>
      </div>
      <Menu model={items} popup ref={menu} id="popup_menu" />
    </div>
  );

  return (
    <div>
      <Menubar
        start={start}
        end={end}
        className="p-3 w-full fixed top-0 left-0"
        style={{ backgroundColor: "#026DCA", border: "none", zIndex: 1 }}
      />
      <Sidebar
        visible={visible}
        onHide={() => setVisible(false)}
        className="p-sidebar-sm"
      >
        <div
          className="flex flex-column align-items-start p-3"
          style={{ textAlign: "left" }}
        >
          <div className="w-full flex justify-content-center pb-3 border-bottom-1 border-gray-300">
            <img src="../assets/logo.png" alt="Logo" width="137" height="96" />
          </div>
          <div className="w-full pt-3">
            {sidebarItems.map((item, index) => (
              <div
                key={index}
                className={`p-3 cursor-pointer w-full ${item.className || ""}`}
                onClick={item.action}
              >
                <i className={`pi ${item.icon} mr-2`} /> {item.label}
              </div>
            ))}
          </div>
        </div>
      </Sidebar>
    </div>
  );
}
