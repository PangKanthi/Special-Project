import { fetchDoorConfig } from "../services/doorConfigService";

export const calculateTotalDoorPrice = async (category, width, height, thickStr) => {

    let errorMessage = null;
    let result = null;

    console.log(category)
    console.log(width)
    console.log(height)
    console.log(thickStr)


    const doorConfig = await fetchDoorConfig();

    const doorDataType = doorConfig[category];
    // console.log("doorDataType", doorDataType)

    if (!doorDataType || !doorDataType["priceTiers"]) {
        return { result, errorMessage: "ไม่พบข้อมูลประเภทประตู" };
    }

    const allThicknessPrice = doorDataType["priceTiers"]
    // console.log("allThicknessPrice", allThicknessPrice)

    const selectedThickness = allThicknessPrice.find(item => item.thickness === thickStr);

    if (!selectedThickness) {
        return { result, errorMessage: "ความหนาที่เลือกไม่มีในระบบ" };
    }

    // console.log("selectedThickness", selectedThickness);

    const area = width * height;
    // console.log("area", area)


    if (area >= selectedThickness.minArea && area <= selectedThickness.maxArea) {
        result = selectedThickness.pricePerSqm * area;
    } else {
        errorMessage = "มั่วขนาด"
    }


    return { result, errorMessage }

};

