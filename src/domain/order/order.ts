import { Address } from "../common/address";
import { Aggregate } from "../common/aggregate";
import { Id } from "../common/id";
import { Price } from "../common/price";
import type { ToJSON } from "../common/toJSON";
import { Item } from "./item";

export enum OrderStatus {
	PLACED = "PLACED",
	DELIVERED = "DELIVERED",
	CANCELLED = "CANCELLED",
}

export class Order extends Aggregate {
	protected constructor(
		readonly id: Id,
		readonly customerId: Id,
		private _deliveryPersonId: Id,
		private _address: Address,
		private _items: Item[],
		private _status: OrderStatus,
	) {
		super();
	}

	static create(input: CreateOrderInput) {
		if (input.items.length === 0) {
			throw new Error("Order item cannot be empty");
		}

		return new Order(
			Id.generate(),
			input.customerId,
			input.deliveryPersonId,
			input.address,
			input.items,
			OrderStatus.PLACED,
		);
	}

	static fromJSON(input: ToJSON<Order>) {
		const order = new Order(
			new Id(input.id),
			new Id(input.customerId),
			new Id(input.deliveryPersonId),
			Address.fromJSON(input.address),
			input.items.map(Item.fromJSON),
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
			items: this._items.map((item) => item.toJSON()),
			status: this._status,
		};
	}

	addItem(item: Item) {
		const itemAlreadyExists = this._items.find((i) => i.id.equals(item.id));
		if (itemAlreadyExists) {
			throw new Error("Item already exists");
		}

		this._items.push(item);
	}

	deleteItem(id: Id) {
		if (this._items.length === 1) {
			throw new Error("Order item cannot be empty");
		}

		const itemIndex = this._items.findIndex((i) => i.id.equals(id));
		if (itemIndex === -1) {
			throw new Error("Item not found");
		}

		this._items.splice(itemIndex, 1);
	}

	updateItemName(id: Id, name: string) {
		const itemIndex = this._items.findIndex((i) => i.id.equals(id));
		if (itemIndex === -1) {
			throw new Error("Item not found");
		}

		this._items[itemIndex].name = name;
	}

	calculateTotal() {
		return this._items.reduce(
			(total, item) => total.add(item.getTotal()),
			new Price(0),
		);
	}

	reassignDeliveryPerson(deliveryPersonId: Id) {
		switch (this._status) {
			case OrderStatus.DELIVERED:
				throw new Error("Cannot reassign delivery person for delivered order");

			case OrderStatus.CANCELLED:
				throw new Error("Cannot reassign delivery person for cancelled order");

			default:
				this._deliveryPersonId = deliveryPersonId;
				break;
		}
	}

	cancel() {
		if (this._status !== OrderStatus.PLACED) {
			throw new Error("Order is not in PLACED status");
		}

		this._status = OrderStatus.CANCELLED;
	}

	deliver() {
		if (this._status !== OrderStatus.PLACED) {
			throw new Error("Order is not in PLACED status");
		}

		this._status = OrderStatus.DELIVERED;
	}

	get status(): OrderStatus {
		return this._status;
	}

	get deliveryPersonId(): Id {
		return this._deliveryPersonId;
	}

	get items(): ReadonlyArray<Readonly<Item>> {
		return this._items;
	}
}

export type CreateOrderInput = {
	customerId: Id;
	deliveryPersonId: Id;
	address: Address;
	items: Item[];
};
