import prisma from "../config/db.js";

class ProductService {
  static async getAllProducts() {
    return await prisma.product.findMany();
  }

  static async getProductById(id) {
    return await prisma.product.findUnique({
      where: { id: Number(id) }
    });
  }

  static async createProduct(data, imageUrls) {
    return await prisma.product.create({
      data: {
        ...data,
        images: imageUrls,
        colors: data.colors || []
      }
    });
  }

  static async updateProduct(id, data, newImages) {
    const product = await prisma.product.findUnique({
      where: { id: Number(id) }
    });

    if (!product) throw new Error("Product not found");

    let updatedColors = product.colors;
    if (data.colors) {
      updatedColors = JSON.parse(data.colors);
    }

    let updatedImages = [...product.images];
    if (newImages.length > 0) {
      updatedImages = [...updatedImages, ...newImages];
    }

    if (data.removeImages) {
      const removeList = JSON.parse(data.removeImages);
      updatedImages = updatedImages.filter(img => !removeList.includes(img));
    }

    return await prisma.product.update({
      where: { id: Number(id) },
      data: {
        ...data,
        colors: updatedColors, 
        images: updatedImages 
      }
    });
  }

  static async deleteProduct(id) {
    const product = await prisma.product.findUnique({
      where: { id: Number(id) }
    });

    if (!product) throw new Error("Product not found");

    product.images.forEach(imagePath => {
      const filePath = `.${imagePath}`;
      if (fs.existsSync(filePath)) {
        fs.unlinkSync(filePath);
      }
    });

    return await prisma.product.delete({ where: { id: Number(id) } });
  }
}

export default ProductService;
