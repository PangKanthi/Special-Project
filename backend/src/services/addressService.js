import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

class AddressService {
    // ✅ ดึงที่อยู่ทั้งหมด (Admin เท่านั้น)
    static async getAllAddresses() {
        try {
            return await prisma.address.findMany();
        } catch (error) {
            console.error("❌ Error fetching all addresses:", error);
            throw new Error("ไม่สามารถดึงข้อมูลที่อยู่ทั้งหมดได้");
        }
    }

    // ✅ ดึงที่อยู่ของผู้ใช้แต่ละคน
    static async getUserAddresses(userId) {
        try {
            return await prisma.address.findMany({
                where: { userId },
            });
        } catch (error) {
            console.error(`❌ Error fetching addresses for user ${userId}:`, error);
            throw new Error("ไม่สามารถดึงข้อมูลที่อยู่ของผู้ใช้ได้");
        }
    }

    // ✅ สร้างที่อยู่ใหม่
    static async createAddress(userId, addressData) {
        try {
            return await prisma.address.create({
                data: {
                    userId,
                    ...addressData,
                },
            });
        } catch (error) {
            console.error("❌ Error creating address:", error);
            throw new Error("ไม่สามารถสร้างที่อยู่ใหม่ได้");
        }
    }

    // ✅ อัปเดตที่อยู่
    static async updateAddress(id, addressData) {
        try {
            const existingAddress = await prisma.address.findUnique({
                where: { id }
            });

            if (!existingAddress) return null;

            return await prisma.address.update({
                where: { id },
                data: addressData,
            });
        } catch (error) {
            console.error(`❌ Error updating address ${id}:`, error);
            throw new Error("ไม่สามารถอัปเดตที่อยู่ได้");
        }
    }

    // ✅ ลบที่อยู่ (Admin เท่านั้น)
    static async deleteAddress(id) {
        try {
            const existingAddress = await prisma.address.findUnique({
                where: { id }
            });

            if (!existingAddress) return null;

            await prisma.address.delete({
                where: { id },
            });

            return true;
        } catch (error) {
            console.error(`❌ Error deleting address ${id}:`, error);
            throw new Error("ไม่สามารถลบที่อยู่ได้");
        }
    }
}

export default AddressService;
