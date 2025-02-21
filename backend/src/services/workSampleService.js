import prisma from '../config/db.js';

class WorkSampleService {
    static async createWorkSample(adminId, description, imageUrl) {
        return await prisma.work_sample.create({
            data: {
                adminId,
                description,
                image_url: imageUrl
            }
        });
    }

    static async getAllWorkSamples() {
        return await prisma.work_sample.findMany({
            include: { admin: true }
        });
    }

    static async deleteWorkSample(id) {
        return await prisma.work_sample.delete({
            where: { id: Number(id) }
        });
    }
}

export default WorkSampleService;
