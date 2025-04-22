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
            const response = await axios.get(`${process.env.REACT_APP_API}/api/users`, {
                headers: { Authorization: `Bearer ${token}` },
            });

            const users = response.data.filter(user => user.role === "U");
            setUserCount(users.length);
        } catch (error) {
            console.error("❌ Error fetching user count:", error);
        }
    };

    return userCount;
};

export default useUserCount;
