import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();

class DoorConfigService {
  static async getAllDoorConfigs() {
    return prisma.door_config.findMany({
      include: { price_tiers: true }
    });
  }

  static async getDoorConfigById(id) {
    return prisma.door_config.findUnique({
      where: { id: Number(id) },
      include: { price_tiers: true }
    });
  }

  static async createDoorConfig(data) {
    const { category, display_name, description, warranty, price_tiers } = data;

    const newConfig = await prisma.door_config.create({
      data: {
        category,
        display_name,
        description,
        warranty,
        price_tiers: {
          create: price_tiers?.map(pt => ({
            thickness: pt.thickness,
            price_per_sqm: pt.price_per_sqm
          })) || []
        }
      },
      include: { price_tiers: true }
    });
    return newConfig;
  }

  static async updateDoorConfig(id, data) {
    const { category, display_name, description, warranty, price_tiers } = data;

    await prisma.door_config_price_tiers.deleteMany({
      where: { doorConfigId: Number(id) },
    });

    const updated = await prisma.door_config.update({
      where: { id: Number(id) },
      data: {
        category,
        display_name,
        description,
        warranty,
        price_tiers: {
          create: price_tiers?.map(pt => ({
            thickness: pt.thickness,
            price_per_sqm: pt.price_per_sqm
          })) || []
        }
      },
      include: { price_tiers: true }
    });
    return updated;
  }

  static async deleteDoorConfig(id) {
    return prisma.door_config.delete({
      where: { id: Number(id) }
    });
  }
}

export default DoorConfigService;
