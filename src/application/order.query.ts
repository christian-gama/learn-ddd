import { EventDispatcher } from "../domain/common/dispatcher";
import { prisma } from "../infrastructure/prisma/client";

export const eventDispatcher = new EventDispatcher();

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
