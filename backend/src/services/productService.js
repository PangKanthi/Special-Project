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

  static async uploadProductImages(req, res){
      try {
          if (!req.files || req.files.length === 0) {
              return res.status(400).json({ success: false, message: 'กรุณาอัปโหลดอย่างน้อย 1 รูป' });
          }
  
          const productId = req.body.productId;
          if (!productId) {
              return res.status(400).json({ success: false, message: 'กรุณาระบุรหัสสินค้า' });
          }
  
          const imageUrls = req.files.map(file => `/uploads/${file.filename}`);
  
          await saveProductImages(productId, imageUrls);
  
          return res.status(200).json({
              success: true,
              message: 'อัปโหลดรูปสินค้าเรียบร้อย',
              data: { imageUrls }
          });
      } catch (error) {
          res.status(500).json({ success: false, message: 'เกิดข้อผิดพลาดในการอัปโหลด' });
      }
  };

  static async saveProductImages(productId, imageUrls) {
    return await prisma.product_image.createMany({
        data: imageUrls.map(imageUrl => ({
            productId: parseInt(productId),
            imageUrl
        }))
    });
};
}

export default ProductService;
