import { Address } from "../domain/common/address";
import { Id } from "../domain/common/id";
import { Price } from "../domain/common/price";
import { Zip } from "../domain/common/zip";
import { Item } from "../domain/item/item";
import type { ItemRepository } from "../domain/item/repository";
import { Order } from "../domain/order/order";
import { OrderItem } from "../domain/order/order-item";
import type { OrderRepository } from "../domain/order/repository";
import type { ItemQuery } from "./item.query";
import { eventDispatcher } from "./order.query";

export class OrderService {
	constructor(
		private readonly orderRepository: OrderRepository,
		private readonly itemQuery: ItemQuery,
	) {}

	async createOrder(dto: OrderDTO): Promise<string> {
		const areItemsActive = await this.itemQuery.areActive(
			dto.orderItems.map((item) => item.id),
		);

		if (!areItemsActive) {
			throw new Error("One or more items are not active");
		}

		const order = Order.create({
			customerId: Id.fromString(dto.customerId),
			deliveryPersonId: Id.fromString(dto.deliveryPersonId),
			orderItems: dto.orderItems.map((item) => ({
				itemId: Id.fromString(item.id),
				price: Price.fromNumber(item.price),
				quantity: item.quantity,
			})),
			address: Address.create({
				street: dto.address.street,
				city: dto.address.city,
				country: dto.address.country,
				zip: Zip.fromString(dto.address.zip),
				number: dto.address.number,
			}),
		});

		await order.publish();

		const id = await this.orderRepository.create(order);

		return id.toString();
	}

	async reassignDeliveryPerson(
		id: string,
		dto: ReassignDeliveryPersonDTO,
	): Promise<void> {
		const order = await this.orderRepository.findById(Id.fromString(id));
		if (!order) {
			throw new Error("Order not found");
		}

		order.reassignDeliveryPerson(Id.fromString(dto.deliveryPersonId));

		await this.orderRepository.update(order);
	}
}

export type OrderDTO = {
	customerId: string;
	deliveryPersonId: string;
	address: {
		street: string;
		country: string;
		zip: string;
		number: string;
		city: string;
	};
	orderItems: {
		id: string;
		price: number;
		quantity: number;
	}[];
};

export type ReassignDeliveryPersonDTO = {
	deliveryPersonId: string;
};
