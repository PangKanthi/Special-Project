import prisma from '../config/db.js';

class WorkSampleService {
    static async createWorkSample(title, description, imageUrls) {
        return await prisma.work_sample.create({
            data: {
                title,
                description,
                images: imageUrls
            }
        });
    }

    static async getAllWorkSamples() {
        return await prisma.work_sample.findMany();
    }

    static async getWorkSampleById(id) {
        return await prisma.work_sample.findUnique({
            where: { id: Number(id) }
        });
    }

    static async updateWorkSample(id, data, newImages) {
        const workSample = await prisma.work_sample.findUnique({
            where: { id: Number(id) }
        });

        if (!workSample) throw new Error("Work Sample not found");

        let updatedImages = [...workSample.images];
        if (newImages.length > 0) {
            updatedImages = [...updatedImages, ...newImages];
        }

        if (data.removeImages) {
            const removeList = JSON.parse(data.removeImages);
            updatedImages = updatedImages.filter(img => !removeList.includes(img));

            removeList.forEach(imagePath => {
                const filePath = `.${imagePath}`;
                if (fs.existsSync(filePath)) {
                    fs.unlinkSync(filePath);
                }
            });
        }

        return await prisma.work_sample.update({
            where: { id: Number(id) },
            data: {
                title: data.title,
                description: data.description,
                images: updatedImages
            }
        });
    }

    static async deleteWorkSample(id) {
        const workSample = await prisma.work_sample.findUnique({
            where: { id: Number(id) }
        });

        if (!workSample) throw new Error("Work Sample not found");

        workSample.images.forEach(imagePath => {
            const filePath = `.${imagePath}`;
            if (fs.existsSync(filePath)) {
                fs.unlinkSync(filePath);
            }
        });

        return await prisma.work_sample.delete({ where: { id: Number(id) } });
    }
}

export default WorkSampleService;
