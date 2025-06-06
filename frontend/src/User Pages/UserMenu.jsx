import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from "axios";

const UserMenu = () => {
    const navigate = useNavigate();
    const [user, setUser] = useState(null);
    const [dropdownVisible, setDropdownVisible] = useState(false);
    const [isVisible, setIsVisible] = useState(false); // ✅ ควบคุม Animation
    const dropdownRef = useRef(null);

    useEffect(() => {
        const fetchUser = async () => {
            const token = localStorage.getItem('token');
            if (!token) {
                setUser(null);
                setIsVisible(false);
                return;
            }
    
            try {
                const response = await axios.get(`${process.env.REACT_APP_API}/api/users/me`, {
                    headers: { Authorization: `Bearer ${token}` },
                });
    
                const data = response.data;
    
                setUser({
                    username: `${data.firstname} ${data.lastname}`,
                });
    
                setTimeout(() => setIsVisible(true), 300);
            } catch (error) {
                console.error("❌ Failed to fetch user:", error);
                setUser(null);
                setIsVisible(false);
            }
        };
    
        fetchUser();
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
            </div>

            {/* ✅ ชื่อผู้ใช้ + Dropdown */}
            <div className="relative" ref={dropdownRef}>
                <button
                    className="p-link flex items-center text-lg text-gray-700 font-medium hover:text-gray-900 mr-5"
                    onClick={() => setDropdownVisible(!dropdownVisible)}
                >
                    {user ? user.username : "User"}
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
