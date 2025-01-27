import { Address } from "../domain/common/address";
import { Id } from "../domain/common/id";
import { Price } from "../domain/common/price";
import { Zip } from "../domain/common/zip";
import { Item } from "../domain/order/item";
import { Order } from "../domain/order/order";
import type { OrderRepository } from "../domain/order/repository";

export class OrderService {
	constructor(private readonly orderRepository: OrderRepository) {}

	async createOrder(dto: OrderDTO): Promise<string> {
		const order = Order.create({
			id: await this.orderRepository.nextId(),
			customerId: Id.fromString(dto.customerId),
			deliveryPersonId: Id.fromString(dto.deliveryPersonId),
			address: Address.create({
				street: dto.address.street,
				city: dto.address.city,
				country: dto.address.country,
				zip: Zip.fromString(dto.address.zip),
				number: dto.address.number,
			}),
		});

		for (const item of dto.items) {
			order.addItem(
				Item.create({
					category: item.category,
					id: Id.fromString(item.id),
					name: item.name,
					price: Price.fromNumber(item.price),
					quantity: item.quantity,
					sku: item.sku,
				}),
			);
		}

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

type OrderDTO = {
	customerId: string;
	deliveryPersonId: string;
	address: {
		street: string;
		country: string;
		zip: string;
		number: string;
		city: string;
	};
	items: {
		id: string;
		name: string;
		price: number;
		category: string;
		sku: string;
		quantity: number;
	}[];
};

type ReassignDeliveryPersonDTO = {
	deliveryPersonId: string;
};
