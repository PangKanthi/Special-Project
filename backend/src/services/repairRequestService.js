import fs from 'fs';
import prisma from '../config/db.js';

class RepairRequestService {
    static async createRepairRequest(userId, addressId, problemDescription, serviceType, imageUrls = []) {
        try {
            return await prisma.repair_request.create({
                data: {
                    userId,
                    addressId,
                    problem_description: problemDescription,
                    service_type: serviceType,
                    images: imageUrls,
                    request_date: new Date()
                }
            });
        } catch (error) {
            throw new Error("เกิดข้อผิดพลาดในการสร้างคำขอซ่อม");
        }
    }

    static async getUserRepairRequests(userId) {
        try {
            return await prisma.repair_request.findMany({
                where: { userId },
                include: { address: true }
            });
        } catch (error) {
            throw new Error("ไม่สามารถดึงข้อมูลคำขอซ่อมได้");
        }
    }

    static async getRepairRequestById(id) {
        try {
            return await prisma.repair_request.findUnique({
                where: { id: Number(id) },
                include: { user: true, address: true }
            });
        } catch (error) {
            throw new Error("ไม่พบคำขอซ่อม");
        }
    }

    static async updateRepairRequest(id, problemDescription, serviceType, imageUrls = []) {
        try {
            const existingRequest = await prisma.repair_request.findUnique({
                where: { id: Number(id) }
            });

            if (!existingRequest) return null;

            if (imageUrls.length > 0 && existingRequest.images.length > 0) {
                existingRequest.images.forEach(imagePath => {
                    const filePath = `.${imagePath}`;
                    if (fs.existsSync(filePath)) {
                        fs.unlinkSync(filePath);
                    }
                });
            }

            return await prisma.repair_request.update({
                where: { id: Number(id) },
                data: {
                    problem_description: problemDescription || existingRequest.problem_description,
                    service_type: serviceType || existingRequest.service_type,
                    images: imageUrls.length > 0 ? imageUrls : existingRequest.images
                }
            });
        } catch (error) {
            throw new Error("ไม่สามารถอัปเดตคำขอซ่อมได้");
        }
    }

    static async deleteRepairRequest(id) {
        try {
            const existingRequest = await prisma.repair_request.findUnique({
                where: { id: Number(id) }
            });

            if (!existingRequest) return null;

            existingRequest.images.forEach(imagePath => {
                const filePath = `.${imagePath}`;
                if (fs.existsSync(filePath)) {
                    fs.unlinkSync(filePath);
                }
            });

            await prisma.repair_request.delete({
                where: { id: Number(id) }
            });

            return true;
        } catch (error) {
            throw new Error("ไม่สามารถลบคำขอซ่อมได้");
        }
    }
}

export default RepairRequestService;
