import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export const saveSlipToDatabase = async (orderId, imageUrl, isValidSlip) => {
  try {
    if (!orderId) {
      throw new Error("❌ orderId ไม่สามารถเป็น null ได้");
    }

    const savedSlip = await prisma.payment_slip.create({
      data: {
        orderId: parseInt(orderId, 10),
        imageUrl,
        verified: isValidSlip
      }
    });

    return savedSlip;
  } catch (error) {
    console.error("❌ เกิดข้อผิดพลาดในการบันทึกสลิป:", error);
    throw error;
  }
};
