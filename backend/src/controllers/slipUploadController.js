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

    // ✅ บันทึกสลิปลงฐานข้อมูล
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

// ✅ ฟังก์ชันตรวจสอบสลิปผ่าน SlipOK API
export const checkSlip = async (req, res, next) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: "❌ กรุณาอัปโหลดไฟล์สลิป" });
    }

    const { amount } = req.body;

    if (!amount) {
      return res.status(400).json({ error: "❌ กรุณาระบุจำนวนเงิน" });
    }

    console.log("📡 กำลังส่งข้อมูลไปยัง SlipOK API...");

    const formData = new FormData();
    formData.append("files", fs.createReadStream(req.file.path));
    formData.append("log", "true");
    formData.append("amount", amount.toString());

    const apiResponse = await fetch(SLIPOK_API_URL, {
      method: "POST",
      headers: { "x-authorization": SLIPOK_API_KEY },
      body: formData
    });

    const apiResult = await apiResponse.json();
    console.log("📨 ได้รับข้อมูลจาก SlipOK API:", apiResult);

    if (!apiResult.success) {
      return res.status(400).json({ error: "สลิปไม่ถูกต้อง", apiResponse: apiResult });
    }

    res.status(200).json({
      message: "✅ สลิปถูกต้อง",
      apiResponse: apiResult
    });
  } catch (error) {
    console.error("❌ เกิดข้อผิดพลาดในการตรวจสอบสลิป:", error);
    res.status(500).json({ error: "เกิดข้อผิดพลาดภายในเซิร์ฟเวอร์", details: error.message });
  }
};
