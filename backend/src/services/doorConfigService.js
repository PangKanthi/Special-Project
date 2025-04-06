import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();

class DoorConfigService {
  /* ---------- READ ---------- */
  static getAll = () =>
    prisma.doorConfig.findMany({ include: { priceTiers: true } });

  static getOne = (id) =>
    prisma.doorConfig.findUnique({
      where: { id: Number(id) },
      include: { priceTiers: true },
    });

  /* ---------- CREATE ---------- */
  static async create(data) {
    return prisma.doorConfig.create({
      data: {
        key: data.key,
        display_name: data.display_name,
        description: data.description,
        warranty: data.warranty,
        priceTiers: {
          create: data.priceTiers.map((t) => ({
            thickness: t.thickness,
            min_area: t.min_area,
            max_area: t.max_area,
            price_per_sqm: t.price_per_sqm,
          })),
        },
      },
      include: { priceTiers: true },
    });
  }

  /* ---------- UPDATE ---------- */
  static async update(id, data) {
    await prisma.doorPriceTier.deleteMany({ where: { doorConfigId: Number(id) } });

    await prisma.doorConfig.update({
      where: { id: Number(id) },
      data: {
        display_name: data.display_name,
        description: data.description,
        warranty: data.warranty,
      },
    });

    await prisma.doorPriceTier.createMany({
      data: data.priceTiers.map((t) => ({
        doorConfigId: Number(id),
        thickness: t.thickness,
        min_area: t.min_area,
        max_area: t.max_area,
        price_per_sqm: t.price_per_sqm,
      })),
    });

    return this.getOne(id);
  }

  /* ---------- DELETE ---------- */
  static async remove(id) {
    await prisma.doorPriceTier.deleteMany({ where: { doorConfigId: Number(id) } });
    return prisma.doorConfig.delete({ where: { id: Number(id) } });
  }

  /* ---------- BULK UPSERT ---------- */
  static async bulkUpsert(raw) {
    const list = Array.isArray(raw)
      ? raw
      : Object.entries(raw).map(([key, cfg]) => ({ key, ...cfg }));

    const done = [];

    for (const cfg of list) {
      // upsert DoorConfig
      const dc = await prisma.doorConfig.upsert({
        where: { key: cfg.key },
        update: {
          display_name: cfg.displayName ?? cfg.display_name,
          description: cfg.description ?? null,
          warranty: cfg.warranty ?? null,
        },
        create: {
          key: cfg.key,
          display_name: cfg.displayName ?? cfg.display_name,
          description: cfg.description ?? null,
          warranty: cfg.warranty ?? null,
        },
      });

      // ลบ tier เดิม
      await prisma.doorPriceTier.deleteMany({ where: { doorConfigId: dc.id } });

      // รวม priceRanges (ถ้ามี) เป็นแถว ๆ
      const tierRows = [];
      for (const tier of cfg.priceTiers) {
        if (tier.priceRanges) {
          tier.priceRanges.forEach((rg) =>
            tierRows.push({
              doorConfigId: dc.id,
              thickness: tier.thickness,
              min_area: rg.minArea ?? rg.min_area,
              max_area: rg.maxArea ?? rg.max_area,
              price_per_sqm: rg.pricePerSqm ?? rg.price_per_sqm,
            })
          );
        } else {
          tierRows.push({
            doorConfigId: dc.id,
            thickness: tier.thickness,
            min_area: tier.minArea ?? tier.min_area,
            max_area: tier.maxArea ?? tier.max_area,
            price_per_sqm: tier.pricePerSqm ?? tier.price_per_sqm,
          });
        }
      }

      await prisma.doorPriceTier.createMany({ data: tierRows });
      done.push(dc);
    }

    return done;
  }
  static updateTier(id, data) {
    return prisma.doorPriceTier.update({
      where: { id: Number(id) },
      data,
    });
  }
}

export default DoorConfigService;
