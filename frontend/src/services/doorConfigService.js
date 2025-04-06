
import axios from "axios";

const apiClient = axios.create({
  baseURL: process.env.REACT_APP_API ,
});

export const fetchDoorConfig = async () => {
  const { data } = await apiClient.get("/api/door-config");
  const map = {};
  data.forEach((cfg) => (map[cfg.key] = cfg));
  return map;
};
