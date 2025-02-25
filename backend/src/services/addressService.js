import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();

export const getAllAddresses = async () => {
  return await prisma.address.findMany(); // ✅ ดึงที่อยู่ทั้งหมด
};

export const getUserAddresses = async (userId) => {
  return await prisma.address.findMany({
    where: { userId },
  });
};

export const createAddress = async (userId, addressData) => {
  return await prisma.address.create({
    data: {
      userId,
      ...addressData,
    },
  });
};

export const updateAddress = async (id, addressData) => {
  return await prisma.address.update({
    where: { id },
    data: addressData,
  });
};

export const deleteAddress = async (id) => {
  return await prisma.address.delete({
    where: { id },
  });
};
