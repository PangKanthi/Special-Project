import prisma from "../config/db.js";

class ProductService {
  static async getAllProducts() {
      return await prisma.product.findMany({
          include: { installation_kit_product: { include: { installation_kit: true } }, images: true }
      });
  }

  static async getProductById(id) {
    return await prisma.product.findUnique({
        where: { id: Number(id) },
        include: { installation_kit_product: { include: { installation_kit: true } }, images: true }
    });
  }

  static async createProduct(data) {
    return await prisma.product.create({ data });
  }

  static async updateProduct(id, data) {
    return await prisma.product.update({
      where: { id: Number(id) },
      data,
    });
  }

  static async deleteProduct(id) {
    return await prisma.product.delete({ where: { id: Number(id) } });
  }

  static async addProductToKit(productId, kitId) {
    return await prisma.installationKitProduct.create({
      data: {
        productId: Number(productId),
        installationKitId: Number(kitId),
      },
    });
  }

  static async removeProductFromKit(productId, kitId) {
    return await prisma.installationKitProduct.deleteMany({
      where: {
        productId: Number(productId),
        installationKitId: Number(kitId),
      },
    });
  }
}

export default ProductService;
