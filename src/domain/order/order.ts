import { Address } from "../common/address";
import { Aggregate } from "../common/aggregate";
import { Id } from "../common/id";
import { Price } from "../common/price";
import type { ToJSON } from "../common/toJSON";
import { OrderCreated } from "./order-created";
import { OrderItem } from "./order-item";

export enum OrderStatus {
	Placed = "PLACED",
	Delivered = "DELIVERED",
	Cancelled = "CANCELLED",
}

export class Order extends Aggregate {
	protected constructor(
		readonly id: Id,
		readonly customerId: Id,
		private _deliveryPersonId: Id,
		private _address: Address,
		private _orderItems: OrderItem[],
		private _status: OrderStatus,
	) {
		super();
	}

	static create(input: CreateOrderInput) {
		if (input.orderItems.length === 0) {
			throw new Error("Order item cannot be empty");
		}

		const id = Id.generate();

		const order = new Order(
			id,
			input.customerId,
			input.deliveryPersonId,
			input.address,
			input.orderItems.map((item) =>
				OrderItem.create({
					orderId: id,
					itemId: item.itemId,
					quantity: item.quantity,
					price: item.price,
				}),
			),
			OrderStatus.Placed,
		);

		order.apply(
			OrderCreated.eventName,
			new OrderCreated(
				order.id,
				order.customerId,
				order.deliveryPersonId,
				order._address,
				order._orderItems,
				order._status,
			),
		);

		return order;
	}

	static fromJSON(input: ToJSON<Order>) {
		const order = new Order(
			Id.fromString(input.id),
			Id.fromString(input.customerId),
			Id.fromString(input.deliveryPersonId),
			Address.fromJSON(input.address),
			input.orderItems.map(OrderItem.fromJSON),
			input.status as OrderStatus,
		);

		return order;
	}

	toJSON() {
		return {
			id: this.id.toString(),
			customerId: this.customerId.toString(),
			deliveryPersonId: this.deliveryPersonId.toString(),
			address: this._address.toJSON(),
			orderItems: this._orderItems.map((item) => item.toJSON()),
			status: this._status,
		};
	}

	addItem(item: OrderItem) {
		const itemAlreadyExists = this._orderItems.find((i) => i.equals(item));
		if (itemAlreadyExists) {
			throw new Error("Item already exists");
		}

		this._orderItems.push(item);
	}

	deleteItem(item: OrderItem) {
		if (this._orderItems.length === 1) {
			throw new Error("Order item cannot be empty");
		}

		const itemIndex = this._orderItems.findIndex((i) => i.equals(item));
		if (itemIndex === -1) {
			throw new Error("Item not found");
		}

		this._orderItems.splice(itemIndex, 1);
	}

	calculateTotal() {
		return this._orderItems.reduce(
			(total, item) => total.add(item.getTotal()),
			Price.fromNumber(0),
		);
	}

	reassignDeliveryPerson(deliveryPersonId: Id) {
		switch (this._status) {
			case OrderStatus.Delivered:
				throw new Error("Cannot reassign delivery person for delivered order");

			case OrderStatus.Cancelled:
				throw new Error("Cannot reassign delivery person for cancelled order");

			default:
				this._deliveryPersonId = deliveryPersonId;
				break;
		}
	}

	cancel() {
		if (this._status !== OrderStatus.Placed) {
			throw new Error("Order is not in PLACED status");
		}

		this._status = OrderStatus.Cancelled;
	}

	deliver() {
		if (this._status !== OrderStatus.Placed) {
			throw new Error("Order is not in PLACED status");
		}

		this._status = OrderStatus.Delivered;
	}

	get status(): OrderStatus {
		return this._status;
	}

	get deliveryPersonId(): Id {
		return this._deliveryPersonId;
	}

	get orderItems(): ReadonlyArray<OrderItem> {
		return this._orderItems;
	}
}

export type CreateOrderInput = {
	customerId: Id;
	deliveryPersonId: Id;
	address: Address;
	orderItems: {
		price: Price;
		quantity: number;
		itemId: Id;
	}[];
};
