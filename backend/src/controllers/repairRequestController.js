import RepairRequestService from '../services/repairRequestService.js';
import { PrismaClient } from "@prisma/client";
import fs from 'fs';

const prisma = new PrismaClient();

export const createRepairRequest = async (req, res, next) => {
    try {
        const { problemDescription, serviceType ,firstname,lastname } = req.body;
        const userId = req.user.id;
        let addressData = req.body.address ? JSON.parse(req.body.address) : null; // 👈 ต้องแปลงจาก JSON string
        let finalAddressId = req.body.addressId ? parseInt(req.body.addressId, 10) : null;

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
                status: 'pending',
                images: imagePaths // 📌 PostgreSQL รองรับ `String[]`
            }
        });
        await prisma.notification.create({
            data: {
                userId,
                message: `🛠 มีคำขอซ่อมใหม่จากผู้ใช้ ${firstname} ${lastname}`
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

export const getAllRepairRequests = async (req, res) => {
    try {
        const allRequests = await prisma.repair_request.findMany({
            include: {
                user: true,
                address: true
            }
        });
        return res.status(200).json({ message: "ดึงข้อมูลคำขอซ่อมทั้งหมดสำเร็จ", data: allRequests });
    } catch (err) {
        return res.status(500).json({ error: "เกิดข้อผิดพลาดในการดึงข้อมูลทั้งหมด" });
    }
};


export const updateRepairRequest = async (req, res, next) => {
    try {
        const { problemDescription, serviceType, status } = req.body;
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
        } else {
            // ไม่มีไฟล์แนบ => คงรูปเก่าไว้เหมือนเดิม
            imageUrls = existingRequest.images;
        }

        const allowedStatuses = ['pending', 'confirm', 'complete', 'cancle'];

        const finalStatus = (status && allowedStatuses.includes(status))
            ? status
            : existingRequest.status;

        const updatedRequest = await RepairRequestService.updateRepairRequest(
            repairRequestId,
            problemDescription,
            serviceType,
            imageUrls,
            finalStatus
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

export const addPartsToRepairRequest = async (req, res, next) => {
    try {
        const { repairRequestId, parts } = req.body;
        const response = await RepairRequestService.addPartsToRepair(repairRequestId, parts);

        res.status(200).json({ message: response.message });
    } catch (error) {
        console.error("❌ Error adding parts to repair:", error);
        res.status(500).json({ error: "เกิดข้อผิดพลาดในการเพิ่มอะไหล่" });
    }
};

