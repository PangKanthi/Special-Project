import { useState, useEffect } from "react";
import axios from "axios";

const useCompletedRepairs = () => {
    const [completedRepairs, setCompletedRepairs] = useState(0);

    useEffect(() => {
        fetchCompletedRepairs();
    }, []);

    const fetchCompletedRepairs = async () => {
        try {
            const token = localStorage.getItem("token");
            const response = await axios.get("https://api.d-dayengineering.com/api/repair-requests/all", {
                headers: { Authorization: `Bearer ${token}` },
            });

            // ✅ กรองเฉพาะคำขอซ่อมที่มี status เป็น "complete"
            const completed = response.data.data.filter(req => req.status === "complete").length;
            setCompletedRepairs(completed);
        } catch (error) {
            console.error("❌ Error fetching completed repairs:", error);
        }
    };

    return completedRepairs;
};

export default useCompletedRepairs;
