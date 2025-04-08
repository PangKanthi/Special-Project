import { PrismaClient, Prisma } from "@prisma/client";
import fs from "fs";

const prisma = new PrismaClient();

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
    const createdProduct = await prisma.product.create({
      data: {
        name: data.name,
        description: data.description,
        price: data.price,
        is_part: data.is_part,
        category: data.category,
        warranty: data.warranty,
        stock_quantity: data.stock_quantity,
        colors: data.colors,
        images: imageUrls,
        status: data.status ?? false,
      }
    });
    return createdProduct;
  }

  static async updateProduct(id, data, newImages) {
    // หา product เดิม
    const product = await prisma.product.findUnique({ where: { id: Number(id) } });
    if (!product) throw new Error("Product not found");

    let updatedColors = product.colors;
    if (data.colors) {
      updatedColors = Array.isArray(data.colors) ? data.colors : JSON.parse(data.colors);
    }

    let updatedImages = [...product.images];
    if (newImages.length > 0) {
      updatedImages = [...updatedImages, ...newImages];
    }

    if (data.removeImages && data.removeImages !== "null") {
      try {
        const removeList = JSON.parse(data.removeImages);
        updatedImages = updatedImages.filter(img => !removeList.includes(img));
      } catch (err) {
        console.error("❌ JSON parsing error for removeImages:", err);
      }
    }

    const updatedProduct = await prisma.product.update({
      where: { id: Number(id) },
      data: {
        name: data.name,
        description: data.description || null,
        price: data.price ? new Prisma.Decimal(data.price) : null,
        is_part: data.is_part === "true" || data.is_part === true,
        category: data.category,
        warranty: data.warranty || null,
        stock_quantity: data.stock_quantity ? parseInt(data.stock_quantity, 10) : 0,
        colors: updatedColors,
        images: updatedImages,
        status: data.status === "true" || data.status === true,
      }
    });

    return updatedProduct;
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

  static async getRandomProducts(count) {
    return await prisma.product.findMany({
      where: { status: false },
      orderBy: { id: 'asc' },
      take: parseInt(count, 10)
    });
  }
  

  static async getAllParts() {
    return await prisma.product.findMany({
      where: { is_part: true },
    });
  }
}

export default ProductService;
