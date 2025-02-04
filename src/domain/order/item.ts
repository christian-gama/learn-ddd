import type { Entity } from "../common/entity";
import { Id } from "../common/id";
import { Price } from "../common/price";
import type { ToJSON } from "../common/toJSON";

export class Item implements Entity {
	protected constructor(
		readonly id: Id,
		public name: string,
		public price: Price,
		public category: string,
		public sku: string,
		public quantity: number,
	) {}

	static create(input: CreateItemInput) {
		const item = new Item(
			Id.generate(),
			input.name,
			input.price,
			input.category,
			input.sku,
			input.quantity,
		);

		item.validate();

		return item;
	}

	static fromJSON(input: ToJSON<Item>) {
		return new Item(
			new Id(input.id),
			input.name,
			new Price(input.price),
			input.category,
			input.sku,
			input.quantity,
		);
	}

	toJSON() {
		return {
			id: this.id.toString(),
			name: this.name,
			price: this.price.valueOf(),
			category: this.category,
			sku: this.sku,
			quantity: this.quantity,
		};
	}

	private validate() {
		if (this.name === undefined) {
			throw new Error("Name is required");
		}

		if (this.price === undefined) {
			throw new Error("Price is required");
		}

		if (this.sku === undefined) {
			throw new Error("Sku is required");
		}

		if (this.price.valueOf() < 0) {
			throw new Error("Price must be positive");
		}

		if (this.quantity < 0) {
			throw new Error("Quantity must be positive");
		}
	}

	getTotal() {
		return this.price.multiply(this.quantity);
	}
}

type CreateItemInput = {
	name: string;
	price: Price;
	sku: string;
	category: string;
	quantity: number;
};
