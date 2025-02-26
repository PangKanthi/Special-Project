import prisma from '../config/db.js';

export const saveProductImages = async (productId, imageUrls) => {
    return await prisma.product_image.createMany({
        data: imageUrls.map(imageUrl => ({
            productId: parseInt(productId),
            imageUrl
        }))
    });
};
