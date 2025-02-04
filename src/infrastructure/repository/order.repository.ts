import { Id } from "../../domain/common/id";
import { Order, type OrderStatus } from "../../domain/order/order";
import type { OrderRepository } from "../../domain/order/repository";
import { prisma } from "../prisma/client";

export class PostgresOrderRepository implements OrderRepository {
	async create(order: Order): Promise<Id> {
		const json = order.toJSON();

		const result = await prisma.order.create({
			data: {
				id: json.id,
				status: json.status,
				customerId: json.customerId,
				deliveryPersonId: json.deliveryPersonId,
				address: {
					city: json.address.city,
					country: json.address.country,
					number: json.address.number,
					street: json.address.street,
					zip: json.address.zip,
				},
				items: {
					create: json.items.map((item) => ({
						id: item.id,
						category: item.category,
						name: item.name,
						price: item.price,
						quantity: item.quantity,
						sku: item.sku,
					})),
				},
			},
		});

		return Id.fromString(result.id);
	}

	async update(order: Order): Promise<void> {
		const json = order.toJSON();

		await prisma.order.update({
			where: {
				id: json.id,
			},
			data: {
				status: json.status,
				deliveryPersonId: json.deliveryPersonId,
				address: {
					city: json.address.city,
					country: json.address.country,
					number: json.address.number,
					street: json.address.street,
					zip: json.address.zip,
				},
				items: {
					upsert: json.items.map((item) => ({
						where: { id: item.id },
						update: {
							category: item.category,
							name: item.name,
							price: item.price,
							quantity: item.quantity,
							sku: item.sku,
						},
						create: {
							id: item.id,
							category: item.category,
							name: item.name,
							price: item.price,
							quantity: item.quantity,
							sku: item.sku,
						},
					})),
				},
			},
		});
	}

	async findById(id: Id): Promise<Order | null> {
		const result = await prisma.order.findUnique({
			where: {
				id: id.toString(),
			},
			include: {
				items: true,
			},
		});

		if (!result) {
			return null;
		}

		return Order.fromJSON({
			id: result.id,
			customerId: result.customerId,
			deliveryPersonId: result.deliveryPersonId,
			address: {
				city: (result.address as Record<string, any>).city,
				country: (result.address as Record<string, any>).country,
				number: (result.address as Record<string, any>).number,
				street: (result.address as Record<string, any>).street,
				zip: (result.address as Record<string, any>).zip,
			},
			items: result.items.map((item) => ({
				id: item.id,
				category: item.category,
				name: item.name,
				price: item.price,
				quantity: item.quantity,
				sku: item.sku,
			})),
			status: result.status as OrderStatus,
		});
	}

	deleteById(order: Order): Promise<void> {
		throw new Error("Method not implemented.");
	}
}
