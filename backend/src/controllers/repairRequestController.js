import RepairRequestService from '../services/repairRequestService.js';
import { PrismaClient } from "@prisma/client";
import fs from 'fs';
import path from 'path';

const prisma = new PrismaClient();

export const createRepairRequest = async (req, res, next) => {
    try {
        const { problemDescription, serviceType } = req.body;
        const userId = req.user.id;
        let addressData = req.body.address ? JSON.parse(req.body.address) : null; // 👈 ต้องแปลงจาก JSON string
        let finalAddressId = req.body.addressId || null;

        // 📌 PostgreSQL รองรับ String[] ดังนั้นเก็บ URL ของรูปภาพเป็น Array
        const imagePaths = req.files ? req.files.map(file => `/uploads/repair_requests/${file.filename}`) : [];

        // ถ้าไม่มี addressId ให้สร้างที่อยู่ใหม่
        if (!finalAddressId && addressData) {
            const newAddress = await prisma.address.create({
                data: {
                    userId,
                    addressLine: addressData.addressLine,
                    province: addressData.province,
                    district: addressData.district,
                    subdistrict: addressData.subdistrict,
                    postalCode: parseInt(addressData.postalCode, 10),
                    isPrimary: false,
                    isShipping: true
                }
            });

            finalAddressId = newAddress.id;
        }

        // ✅ บันทึกข้อมูล `images` เป็น Array ใน PostgreSQL
        const repairRequest = await prisma.repair_request.create({
            data: {
                userId,
                addressId: finalAddressId,
                problem_description: problemDescription,
                service_type: serviceType,
                images: imagePaths // 📌 PostgreSQL รองรับ `String[]`
            }
        });

        res.status(201).json({ message: "สร้างคำขอซ่อมสำเร็จ", data: repairRequest });
    } catch (error) {
        console.error("❌ Error creating repair request:", error);
        res.status(500).json({ error: "เกิดข้อผิดพลาดในการสร้างคำขอซ่อม" });
    }
};

export const getUserRepairRequests = async (req, res, next) => {
    try {
        const repairRequests = await RepairRequestService.getUserRepairRequests(req.user.id);
        res.status(200).json({ message: "ดึงข้อมูลสำเร็จ", data: repairRequests });
    } catch (error) {
        next(error);
    }
};

export const getRepairRequestById = async (req, res, next) => {
    try {
        const repairRequest = await RepairRequestService.getRepairRequestById(req.params.id);
        if (!repairRequest) return res.status(404).json({ error: "ไม่พบคำขอซ่อม" });

        res.status(200).json({ message: "ดึงข้อมูลสำเร็จ", data: repairRequest });
    } catch (error) {
        next(error);
    }
};

export const updateRepairRequest = async (req, res, next) => {
    try {
        const { problemDescription, serviceType } = req.body;
        const repairRequestId = req.params.id;

        const existingRequest = await RepairRequestService.getRepairRequestById(repairRequestId);
        if (!existingRequest) return res.status(404).json({ error: "ไม่พบคำขอซ่อม" });

        let imageUrls = existingRequest.images;
        if (req.files && req.files.length > 0) {

            existingRequest.images.forEach(imagePath => {
                const filePath = `.${imagePath}`;
                if (fs.existsSync(filePath)) {
                    fs.unlinkSync(filePath);
                }
            });

            imageUrls = req.files.map(file => `/uploads/repair_requests/${file.filename}`);
        }

        const updatedRequest = await RepairRequestService.updateRepairRequest(
            repairRequestId,
            problemDescription,
            serviceType,
            imageUrls
        );

        res.status(200).json({ message: "อัปเดตคำขอซ่อมสำเร็จ", data: updatedRequest });
    } catch (error) {
        next(error);
    }
};

export const deleteRepairRequest = async (req, res, next) => {
    try {
        const deleted = await RepairRequestService.deleteRepairRequest(req.params.id);
        if (!deleted) return res.status(404).json({ error: "ไม่พบคำขอซ่อม" });

        res.status(200).json({ message: "ลบคำขอซ่อมสำเร็จ" });
    } catch (error) {
        next(error);
    }
};
