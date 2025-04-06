import { fetchDoorConfig } from "../services/doorConfigService";

/**
 * @param {string} category   key ของประเภทประตู (manual_rolling_shutter ฯลฯ)
 * @param {number} width      ความกว้าง (เมตร)
 * @param {number} height     ความสูง (เมตร)
 * @param {string} thickStr   ความหนาที่เลือก (เช่น "0.6-0.7 mm (เบอร์ 22)")
 */
export const calculateTotalDoorPrice = async (
  category,
  width,
  height,
  thickStr
) => {
  let errorMessage = null;
  let result = null;

  // 1) ดึงข้อมูลจาก backend
  const doorConfig = await fetchDoorConfig();
  const doorData = doorConfig[category];

  if (!doorData || !doorData.priceTiers) {
    return { result, errorMessage: "ไม่พบข้อมูลประเภทประตู" };
  }

  const area = width * height;

  /* 2) ในโครงสร้างใหม่ ทุกช่วงราคาอยู่ในตาราง DoorPriceTier เลย
        เลือกแถวที่ตรง thickness และช่วงพื้นที่ */
  const matchedTier = doorData.priceTiers.find(
    (t) =>
      t.thickness === thickStr &&
      area >= t.min_area &&
      area <= t.max_area
  );

  if (!matchedTier) {
    return {
      result,
      errorMessage: "ไม่พบราคาที่ตรงกับความหนาหรือขนาดพื้นที่นี้",
    };
  }

  result = matchedTier.price_per_sqm * area;
  return { result, errorMessage };
};
