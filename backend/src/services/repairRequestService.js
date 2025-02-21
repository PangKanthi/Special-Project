import prisma from '../config/db.js';

class RepairRequestService {
    static async createRepairRequest(userId, addressId, orderId, problemDescription, serviceType) {
        return await prisma.repair_request.create({
            data: {
                userId,
                addressId,
                orderId,
                problem_description: problemDescription,
                service_type: serviceType,
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
}

export default RepairRequestService;
