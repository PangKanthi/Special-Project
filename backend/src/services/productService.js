import { PrismaClient, Prisma } from "@prisma/client";
import fs from "fs";

const prisma = new PrismaClient();

class ProductService {
  static async getAllProducts() {
    return await prisma.product.findMany();
  }

  static async getProductById(id) {
    return await prisma.product.findUnique({
      where: { id: Number(id) },
    });
  }

  static async createProduct(data, imageUrls) {
    return await prisma.product.create({
      data: {
        name: data.name,
        description: data.description || "",
        price: data.price,
        category: data.category || "",
        warranty: data.warranty || "",
        stock_quantity: data.stock_quantity || 0,
        colors: data.colors || [],
        images: imageUrls || [],
      },
    });
  }

  static async updateProduct(id, data, newImages) {
    const product = await prisma.product.findUnique({
      where: { id: Number(id) },
    });

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
        updatedImages = updatedImages.filter((img) => !removeList.includes(img));
      } catch (err) {
        console.error("❌ JSON parsing error for removeImages:", err);
      }
    }

    return await prisma.product.update({
      where: { id: Number(id) },
      data: {
        name: data.name || product.name,
        description: data.description || product.description,
        price: data.price ? new Prisma.Decimal(data.price) : product.price,
        category: data.category || product.category,
        warranty: data.warranty || product.warranty,
        stock_quantity: data.stock_quantity
          ? parseInt(data.stock_quantity, 10)
          : product.stock_quantity,
        colors: updatedColors,
        images: updatedImages,
      },
    });
  }

  static async deleteProduct(id) {
    const product = await prisma.product.findUnique({
      where: { id: Number(id) },
    });
    if (!product) throw new Error("Product not found");

    product.images.forEach((imagePath) => {
      const filePath = `.${imagePath}`;
      if (fs.existsSync(filePath)) {
        fs.unlinkSync(filePath);
      }
    });

    return await prisma.product.delete({ where: { id: Number(id) } });
  }

  static async getRandomProducts(count) {
    return await prisma.$queryRawUnsafe(`
      SELECT * FROM "product"
      ORDER BY RANDOM()
      LIMIT ${parseInt(count, 10)};
    `);
  }

  static async getRandomProducts(count) {
    return await prisma.$queryRawUnsafe(`
      SELECT * FROM "product" 
      ORDER BY RANDOM()
      LIMIT ${parseInt(count, 10)};
    `);
  }
}

export default ProductService;
