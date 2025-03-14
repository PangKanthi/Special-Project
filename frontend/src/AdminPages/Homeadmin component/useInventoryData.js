import { useState, useEffect } from "react";
import axios from "axios";

const useInventoryData = () => {
    const [totalStock, setTotalStock] = useState(0);
    const [productStock, setProductStock] = useState([]);

    useEffect(() => {
        fetchInventoryData();
    }, []);

    const fetchInventoryData = async () => {
        try {
            const response = await axios.get("http://localhost:1234/api/products");

            // ✅ คำนวณสินค้าคงคลังทั้งหมด
            const total = response.data.reduce((sum, product) => sum + (product.stock_quantity || 0), 0);
            setTotalStock(total);

            // ✅ ดึงรายการสินค้าแต่ละตัว
            const productList = response.data.map(product => ({
                id: product.id,
                name: product.name,
                stock: product.stock_quantity || 0,
            }));

            setProductStock(productList);
        } catch (error) {
            console.error("❌ Error fetching inventory data:", error);
        }
    };

    return { totalStock, productStock };
};

export default useInventoryData;
