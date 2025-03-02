import prisma from '../config/db.js';

class RepairRequestService {
    static async createRepairRequest(userId, addressId, orderId, problemDescription, serviceType, imageUrls) {
        return await prisma.repair_request.create({
            data: {
                userId,
                addressId,
                orderId,
                problem_description: problemDescription,
                service_type: serviceType,
                images: imageUrls,
                request_date: new Date()
            }
        });
    }

    static async getUserRepairRequests(userId) {
        return await prisma.repair_request.findMany({
            where: { userId },
            include: { order: true, address: true }
        });
    }

    static async getRepairRequestById(id) {
        return await prisma.repair_request.findUnique({
            where: { id: Number(id) },
            include: { user: true, order: true, address: true }
        });
    }

    static async updateRepairRequest(id, problemDescription, serviceType, imageUrls) {
        const existingRequest = await prisma.repair_request.findUnique({
            where: { id: Number(id) }
        });

        if (!existingRequest) return null;

        return await prisma.repair_request.update({
            where: { id: Number(id) },
            data: {
                problem_description: problemDescription || existingRequest.problem_description,
                service_type: serviceType || existingRequest.service_type,
                images: imageUrls.length ? imageUrls : existingRequest.images
            }
        });
    }

    static async deleteRepairRequest(id) {
        const existingRequest = await prisma.repair_request.findUnique({
            where: { id: Number(id) }
        });

        if (!existingRequest) return null;

        await prisma.repair_request.delete({
            where: { id: Number(id) }
        });

        return true;
    }
}

export default RepairRequestService;
