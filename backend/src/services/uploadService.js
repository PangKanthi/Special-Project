import prisma from '../config/db.js';

export const saveProductImages = async (productId, imageUrls) => {
    return await prisma.product_image.createMany({
        data: imageUrls.map(imageUrl => ({
            productId: parseInt(productId),
            imageUrl
        }))
    });
};

export const saveKitImages = async (installationKitId, imageUrls) => {
    return await prisma.installation_kit_image.createMany({
        data: imageUrls.map(imageUrl => ({
            installationKitId: parseInt(installationKitId),
            imageUrl
        }))
    });
};
