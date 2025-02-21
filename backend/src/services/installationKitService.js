import prisma from '../config/db.js';

class InstallationKitService {
    static async createInstallationKit(data) {
        return await prisma.installation_kit.create({
            data
        });
    }

    static async getAllInstallationKits() {
        return await prisma.installation_kit.findMany({
            include: { installation_kit_product: { include: { product: true } }, images: true }
        });
    }

    static async getInstallationKitById(id) {
        return await prisma.installation_kit.findUnique({
            where: { id: Number(id) },
            include: { installation_kit_product: { include: { product: true } }, images: true }
        });
    }

    static async addProductToKit(kitId, productId) {
        return await prisma.installation_kit_product.create({
            data: {
                installation_kit_id: Number(kitId),
                product_id: Number(productId)
            }
        });
    }

    static async removeProductFromKit(kitId, productId) {
        return await prisma.installation_kit_product.deleteMany({
            where: {
                installation_kit_id: Number(kitId),
                product_id: Number(productId)
            }
        });
    }
}

export default InstallationKitService;
