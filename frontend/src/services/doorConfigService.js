import axios from 'axios';
export const fetchDoorConfig = async () => {
    try {
        const response = await axios.get("/mockData/doorConfig.json");
        return response.data;
    } catch (error) {
        throw error;
    }
}