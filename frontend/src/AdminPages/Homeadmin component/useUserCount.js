import { useState, useEffect } from "react";
import axios from "axios";

const useUserCount = () => {
    const [userCount, setUserCount] = useState(0);

    useEffect(() => {
        fetchUserCount();
    }, []);

    const fetchUserCount = async () => {
        try {
            const token = localStorage.getItem("token");
            const response = await axios.get("https://api.d-dayengineering.com/api/users", {
                headers: { Authorization: `Bearer ${token}` },
            });

            // ✅ กรองเฉพาะผู้ใช้ที่ role เป็น "U" (ไม่นับ Admin)
            const users = response.data.filter(user => user.role === "U");
            setUserCount(users.length);
        } catch (error) {
            console.error("❌ Error fetching user count:", error);
        }
    };

    return userCount;
};

export default useUserCount;
