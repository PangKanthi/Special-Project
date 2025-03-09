import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';

const UserMenu = () => {
    const navigate = useNavigate();
    const [user, setUser] = useState(null);
    const [dropdownVisible, setDropdownVisible] = useState(false);
    const [cartCount, setCartCount] = useState(0); // ✅ จำนวนสินค้าในตะกร้า
    const [isVisible, setIsVisible] = useState(false); // ✅ ควบคุม Animation
    const dropdownRef = useRef(null);

    // ✅ อัปเดตจำนวนสินค้าในตะกร้าแบบเรียลไทม์
    useEffect(() => {
        const updateCartCount = () => {
            const cart = JSON.parse(localStorage.getItem("cart")) || [];
            const totalItems = cart.reduce((acc, item) => acc + item.quantity, 0);
            setCartCount(totalItems);
        };

        updateCartCount(); // โหลดค่าตอนเปิดหน้า

        // ✅ ฟัง event เมื่อมีการอัปเดตตะกร้า
        window.addEventListener("cartUpdated", updateCartCount);
        
        return () => {
            window.removeEventListener("cartUpdated", updateCartCount);
        };
    }, []);

    // ✅ โหลดข้อมูลผู้ใช้จาก localStorage และเปิดแอนิเมชัน
    useEffect(() => {
        const token = localStorage.getItem('token');
        if (token) {
            const storedUser = JSON.parse(localStorage.getItem('user')) || { name: "User" };
            setUser(storedUser);
            setTimeout(() => setIsVisible(true), 300);
        } else {
            setUser(null);
            setIsVisible(false);
        }
    }, []);

    const handleLogout = () => {
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        setUser(null);
        setIsVisible(false);
        navigate("/home");
    };

    // ✅ ปิด Dropdown เมื่อคลิกข้างนอก
    useEffect(() => {
        const handleClickOutside = (event) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
                setDropdownVisible(false);
            }
        };

        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, []);

    return (
        <div className={`flex items-center space-x-4 relative transition-all duration-500 ${isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-[-10px]"}`}>
            <div className="relative cursor-pointer mr-5" onClick={() => navigate("/shop-cart")}>
                <i className="pi pi-shopping-bag text-2xl text-gray-700"></i>
                {cartCount > 0 && (
                    <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs rounded-full px-2 animate-pulse">
                        {cartCount}
                    </span>
                )}
            </div>

            {/* ✅ ชื่อผู้ใช้ + Dropdown */}
            <div className="relative" ref={dropdownRef}>
                <button
                    className="p-link flex items-center text-lg text-gray-700 font-medium hover:text-gray-900 mr-5"
                    onClick={() => setDropdownVisible(!dropdownVisible)}
                >
                    {user ? user.name : "User"}
                    <i className="pi pi-angle-down ml-2 text-sm"></i>
                </button>

                {dropdownVisible && (
                    <div className="absolute right-0 mt-2 w-48 bg-white border border-gray-200 rounded-lg shadow-lg transition-all duration-300 ease-in-out transform scale-95 hover:scale-100 mr-5">
                        <ul className="py-2">
                            <li
                                className="px-4 py-2 text-gray-700 hover:bg-gray-100 cursor-pointer rounded-t-lg"
                                onClick={() => {
                                    navigate("/profile");
                                    setDropdownVisible(false);
                                }}
                            >
                                โปรไฟล์
                            </li>
                            <li
                                className="px-4 py-2 text-red-500 hover:bg-gray-100 hover:text-red-600 cursor-pointer rounded-b-lg"
                                onClick={handleLogout}
                            >
                                Logout
                            </li>
                        </ul>
                    </div>
                )}
            </div>
        </div>
    );
};

export default UserMenu;
