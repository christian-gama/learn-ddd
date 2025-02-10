import { prisma } from "../infrastructure/prisma/client";

export class OrderQuery {
  async frontendResponse(id: string) {
    return prisma.order.findUnique({
      where: { id },
      select: {
        customerId: true,
        deliveryPersonId: true,
        id: true,
      },
    });
  }
}
