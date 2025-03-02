import useFetchData from "./useFetchData";

const useLocationData = () => {
    const provinces = useFetchData("/mockData/thai_provinces.json");
    const amphures = useFetchData("/mockData/thai_amphures.json");
    const tambons = useFetchData("/mockData/thai_tambons.json");

    return { provinces, amphures, tambons };
};

export default useLocationData;
