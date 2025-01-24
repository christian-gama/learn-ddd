import { Address } from "../common/address";
import { Aggregate } from "../common/aggregate";
import { Id } from "../common/id";
import { Price } from "../common/price";
import type { ToJSON } from "../common/toJSON";
import { Item } from "./item";

export class Order extends Aggregate {
	protected constructor(
		readonly id: Id,
		public customerId: Id,
		public deliveryPersonId: Id,
		private _address: Address,
		private _items: Item[],
		public createdAt: Date,
	) {
		super();
	}

	static create(input: CreateOrderInput) {
		return new Order(
			input.id,
			input.customerId,
			input.deliveryPersonId,
			input.address,
			[],
			new Date(),
		);
	}

	static fromJSON(input: ToJSON<Order>) {
		const order = new Order(
			new Id(input.id),
			new Id(input.customerId),
			new Id(input.deliveryPersonId),
			Address.fromJSON(input.address),
			input.items.map(Item.fromJSON),
			new Date(input.createdAt),
		);

		return order;
	}

	toJSON() {
		return {
			id: this.id.toString(),
			customerId: this.customerId.toString(),
			deliveryPersonId: this.deliveryPersonId.toString(),
			address: this._address.toJSON(),
			createdAt: this.createdAt.toISOString(),
			items: this._items.map((item) => item.toJSON()),
		};
	}

	addItem(item: Item) {
		const itemAlreadyExists = this._items.find((i) => i.id.equals(item.id));
		if (itemAlreadyExists) {
			throw new Error("Item already exists");
		}

		this._items.push(item);
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

	get items(): ReadonlyArray<Readonly<Item>> {
		return this._items;
	}
}

export type CreateOrderInput = {
	id: Id;
	customerId: Id;
	deliveryPersonId: Id;
	address: Address;
};
