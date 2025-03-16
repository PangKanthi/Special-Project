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
            const response = await axios.get(`${process.env.react_app_api}/products`);

            // ✅ ประเภทสินค้าที่ต้องซ่อน (ประตูม้วน)
            const excludedShutterCategories = [
                "manual_rolling_shutter",
                "chain_electric_shutter",
                "electric_rolling_shutter"
            ];


            const filteredProducts = response.data.filter(product =>
                !excludedShutterCategories.includes(product.category) // ✅ กรองตาม `category`
            );
            // ✅ คำนวณสินค้าคงคลังทั้งหมด (เฉพาะสินค้าที่ผ่านการกรอง)
            const total = filteredProducts.reduce((sum, product) => sum + (product.stock_quantity || 0), 0);
            setTotalStock(total);

            // ✅ ดึงรายการสินค้าแต่ละตัว (เฉพาะสินค้าที่ผ่านการกรอง)
            const productList = filteredProducts.map(product => ({
                id: product.id,
                name: product.name,
                type: product.type,
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
