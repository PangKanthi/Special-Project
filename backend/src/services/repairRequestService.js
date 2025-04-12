import fs from 'fs';
import prisma from '../config/db.js';

class RepairRequestService {
  static async createRepairRequest(userId, addressId, problemDescription, serviceType, imageUrls = [], status = 'pending') {
    try {
      const newRequest = await prisma.repair_request.create({
        data: {
          userId,
          addressId,
          problem_description: problemDescription,
          service_type: serviceType,
          images: imageUrls,
          status,
          request_date: new Date()
        }
      });

      return newRequest;
    } catch (error) {
      throw new Error("เกิดข้อผิดพลาดในการสร้างคำขอซ่อม");
    }
  }
  static async getUserRepairRequests(userId) {
    try {
      return await prisma.repair_request.findMany({
        where: { userId },
        include: { address: true }
      });
    } catch (error) {
      throw new Error("ไม่สามารถดึงข้อมูลคำขอซ่อมได้");
    }
  }

  static async getRepairRequestById(id) {
    try {
      return await prisma.repair_request.findUnique({
        where: { id: Number(id) },
        include: { user: true, address: true }
      });
    } catch (error) {
      throw new Error("ไม่พบคำขอซ่อม");
    }
  }

  static async updateRepairRequest(id, problemDescription, serviceType, imageUrls = [], status, repair_price) {
    try {
      const existingRequest = await prisma.repair_request.findUnique({
        where: { id: Number(id) }
      });

      if (!existingRequest) return null;

      return await prisma.repair_request.update({
        where: { id: Number(id) },
        data: {
          problem_description: problemDescription || existingRequest.problem_description,
          service_type: serviceType || existingRequest.service_type,
          images: imageUrls.length > 0 ? imageUrls : existingRequest.images,
          status: status || existingRequest.status,
          repair_price: repair_price ?? existingRequest.repair_price,   
        },
        include: {
          address: true
        }
      });
    } catch (error) {
      console.error(error);
      throw new Error("ไม่สามารถอัปเดตคำขอซ่อมได้");
    }
  }

  static async deleteRepairRequest(id) {
    try {
      const existingRequest = await prisma.repair_request.findUnique({
        where: { id: Number(id) }
      });

      if (!existingRequest) return null;

      existingRequest.images.forEach(imagePath => {
        const filePath = `.${imagePath}`;
        if (fs.existsSync(filePath)) {
          fs.unlinkSync(filePath);
        }
      });

      await prisma.repair_request.delete({
        where: { id: Number(id) }
      });

      return true;
    } catch (error) {
      throw new Error("ไม่สามารถลบคำขอซ่อมได้");
    }
  }

  static async addPartsToRepair(repairRequestId, parts) {
    try {
      return await prisma.$transaction(async (tx) => {
        for (const part of parts) {
          const { productId, quantity_used } = part;
  
          // ✅ ตรวจสอบว่าสินค้ามีอยู่จริงก่อนอัปเดต
          const product = await tx.product.findUnique({ where: { id: productId } });
          if (!product) {
            throw new Error(`ไม่พบสินค้า ID: ${productId}`);
          }
  
          const existingPart = await tx.repair_part.findUnique({
            where: {
              repairRequestId_productId: {
                repairRequestId,
                productId,
              },
            },
          });
  
          if (existingPart) {
            await tx.repair_part.update({
              where: {
                repairRequestId_productId: {
                  repairRequestId,
                  productId,
                },
              },
              data: {
                quantity_used: {
                  increment: quantity_used,
                },
              },
            });
          } else {
            await tx.repair_part.create({
              data: {
                repairRequestId,
                productId,
                quantity_used,
              },
            });
          }
  
          // ✅ อัปเดตสต็อกหลังจากเช็คว่าสินค้ามีอยู่จริง
          const updatedPart = await tx.product.update({
            where: { id: productId },
            data: { stock_quantity: { decrement: quantity_used } },
          });
        }
  
        return { message: "บันทึกการใช้อะไหล่สำเร็จ" };
      });
    } catch (error) {
      console.error("❌ Error adding parts to repair:", error);
      throw new Error(`เกิดข้อผิดพลาดในการบันทึกอะไหล่: ${error.message}`);
    }
  }  
}

export default RepairRequestService;
