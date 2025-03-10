import { saveSlipToDatabase } from '../services/slipUploadService.js';
import fetch from 'node-fetch';
import fs from 'fs';
import FormData from 'form-data';

const SLIPOK_API_URL = "https://api.slipok.com/api/line/apikey/40438";
const SLIPOK_API_KEY = "SLIPOKFGYU7U8";
const STORE_BANK_NAME = "MR. Kanthi C";
const STORE_BANK_CODE = "004";

// ✅ ฟังก์ชันอัปโหลดสลิป (แยกออกจากการตรวจสอบ)
export const uploadSlip = async (req, res, next) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: "❌ กรุณาอัปโหลดไฟล์สลิป" });
    }

    const { orderId } = req.body;

    if (!orderId) {
      return res.status(400).json({ error: "❌ orderId ไม่สามารถเป็น null ได้" });
    }

    console.log("📂 ไฟล์ที่อัปโหลดสำเร็จ:", req.file.path);

    const savedSlip = await saveSlipToDatabase(orderId, req.file.path, false);

    res.status(201).json({
      message: "✅ อัปโหลดสลิปสำเร็จ",
      imageUrl: req.file.path,
      orderStatus: "PENDING",
    });
  } catch (error) {
    console.error("❌ เกิดข้อผิดพลาดในการอัปโหลดสลิป:", error);
    res.status(500).json({ error: "เกิดข้อผิดพลาดภายในเซิร์ฟเวอร์", details: error.message });
  }
};

export const checkSlip = async (req, res, next) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: "❌ กรุณาอัปโหลดไฟล์สลิป" });
    }

    console.log("📡 กำลังส่งข้อมูลไปยัง SlipOK API...");

    const formData = new FormData();
    formData.append("files", fs.createReadStream(req.file.path));
    formData.append("log", "true");

    const apiResponse = await fetch(SLIPOK_API_URL, {
      method: "POST",
      headers: { "x-authorization": SLIPOK_API_KEY },
      body: formData,
    });

    const apiResult = await apiResponse.json();
    console.log("📨 ได้รับข้อมูลจาก SlipOK API:", apiResult);

    if (!apiResult.success) {
      return res.status(400).json({ error: "❌ สลิปไม่ถูกต้อง", apiResponse: apiResult });
    }

    // ✅ ดึงข้อมูลจากสลิป
    const slipAmount = parseFloat(apiResult.data.amount);
    const receivingBank = apiResult.data.receivingBank; // ✅ ธนาคารปลายทาง
    const receiverName = apiResult.data.receiver.name?.trim(); // ✅ ชื่อบัญชีปลายทาง

    // ✅ ตรวจสอบว่าธนาคารปลายทางถูกต้องหรือไม่
    if (receivingBank !== STORE_BANK_CODE) {
      return res.status(400).json({
        error: `❌ ธนาคารปลายทางไม่ถูกต้อง (คาดหวัง: ${STORE_BANK_CODE}, ได้รับ: ${receivingBank})`,
      });
    }

    // ✅ ตรวจสอบว่าชื่อบัญชีปลายทางตรงกันหรือไม่ (ใช้ `includes()` ป้องกันชื่อไม่ตรง 100%)
    if (!receiverName || !receiverName.toUpperCase().includes(STORE_BANK_NAME.toUpperCase())) {
      return res.status(400).json({
        error: `❌ ชื่อบัญชีปลายทางไม่ถูกต้อง (คาดหวัง: ${STORE_BANK_NAME}, ได้รับ: ${receiverName || "ไม่พบข้อมูล"})`,
      });
    }

    res.status(200).json({
      message: "✅ สลิปถูกต้อง",
      slipAmount,
      receiverName,
      receivingBank,
      apiResponse: apiResult,
    });

  } catch (error) {
    console.error("❌ เกิดข้อผิดพลาดในการตรวจสอบสลิป:", error);
    res.status(500).json({ error: "เกิดข้อผิดพลาดภายในเซิร์ฟเวอร์", details: error.message });
  }
};
