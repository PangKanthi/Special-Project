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
        warranty: data.warranty && data.warranty !== "" ? parseInt(data.warranty,10) : null,
        stock_quantity: data.stock_quantity,
        colors: data.colors,
        images: imageUrls,
        status: data.status ?? false,
      }
    });
    return createdProduct;
  }

  static async updateProduct(id, data, newImages) {
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
      const removeList = JSON.parse(data.removeImages);
      removeList.forEach((imgPath) => {
        const fullPath = `.${imgPath}`;
        if (fs.existsSync(fullPath)) {
          fs.unlinkSync(fullPath);
          console.log("ลบไฟล์:", fullPath);
        } else {
          console.warn("ไฟล์ไม่พบ:", fullPath);
        }
      });
      updatedImages = updatedImages.filter(img => !removeList.includes(img));
    }


    const updatedProduct = await prisma.product.update({
      where: { id: Number(id) },
      data: {
        name: data.name,
        description: data.description || null,
        price: data.price ? new Prisma.Decimal(data.price) : null,
        is_part: data.is_part === "true" || data.is_part === true,
        category: data.category,
        warranty: data.warranty && data.warranty !== "" ? parseInt(data.warranty,10) : null,
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

  static async getPriceTiers(productId) {
    return prisma.productPriceTier.findMany({
      where: { productId: Number(productId) },
      orderBy: { min_area: 'asc' }
    });
  }

  static async addPriceTier(productId, tier) {
    return prisma.productPriceTier.create({
      data: {
        productId: Number(productId),
        ...tier,
      },
    });
  }

  static async updatePriceTier(id, data) {
    return prisma.productPriceTier.update({
      where: { id: Number(id) },
      data,
    });
  }

  static async deletePriceTier(id) {
    return prisma.productPriceTier.delete({
      where: { id: Number(id) },
    });
  }

  static async setBomItems(productId, bomItems) {
    await prisma.bom_item.deleteMany({
      where: { productId: Number(productId) }
    });

    const createdItems = await prisma.bom_item.createMany({
      data: bomItems.map(item => ({
        productId: Number(productId),
        partId: Number(item.partId),
        quantity: Number(item.quantity),
        unit: item.unit,
      }))
    });
    return createdItems;
  }
}

export default ProductService;
