import { prisma } from "../infrastructure/prisma/client";

export class ItemQuery {
  async isActive(id: string) {
    const result = await prisma.item.findUnique({
      where: { id },
      select: {
        isActive: true,
      },
    });

    if (!result) {
      throw new Error("Item not found");
    }

    return result.isActive;
  }

  async areActive(ids: string[]) {
    const result = await prisma.item.findMany({
      where: {
        id: { in: ids },
        isActive: true,
      },
    });

    return result.length === ids.length;
  }

  async findById(id: string) {
    return prisma.item.findUnique({
      where: { id },
    });
  }
}
