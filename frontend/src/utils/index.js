import { fetchDoorConfig } from "../services/doorConfigService";

export const calculateTotalDoorPrice = async (category, width, height, thickStr) => {
    let errorMessage = null;
    let result = null;

    const doorConfig = await fetchDoorConfig();
    const doorDataType = doorConfig[category];

    if (!doorDataType || !doorDataType["priceTiers"]) {
        return { result, errorMessage: "ไม่พบข้อมูลประเภทประตู" };
    }

    const allThicknessPrice = doorDataType["priceTiers"];
    const area = width * height;

    const selectedThickness = allThicknessPrice.find(item => item.thickness === thickStr);

    if (!selectedThickness) {
        return { result, errorMessage: "ความหนาที่เลือกไม่มีในระบบ" };
    }

    if (selectedThickness.pricePerSqm) {
        if (area >= selectedThickness.minArea && area <= selectedThickness.maxArea) {
            result = selectedThickness.pricePerSqm * area;
        } else {
            errorMessage = "ขนาดไม่อยู่ในช่วงที่กำหนด";
        }
    }

    if (selectedThickness.priceRanges) {
        const matchedRange = selectedThickness.priceRanges.find(range => 
            area >= range.minArea && area <= range.maxArea
        );

        if (matchedRange) {
            result = matchedRange.pricePerSqm * area;
        } else {
            errorMessage = "ขนาดไม่อยู่ในช่วงที่กำหนด";
        }
    }

    return { result, errorMessage };
};
