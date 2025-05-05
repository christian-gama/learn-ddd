import { Aggregate } from "../common/aggregate";
import { Id } from "../common/id";
import { Price } from "../common/price";
import type { ToJSON } from "../common/toJSON";

export class Item extends Aggregate {
	protected constructor(
		readonly id: Id,
		private _name: string,
		private _price: Price,
		private _category: string,
		private _sku: string,
		private _isActive: boolean,
	) {
		super();
	}

	static create(input: CreateItemInput) {
		const item = new Item(
			Id.generate(),
			input.name,
			input.price,
			input.category,
			input.sku,
			true,
		);

		item.validate();

		return item;
	}

	static fromJSON(input: ToJSON<Item>) {
		return new Item(
			Id.fromString(input.id),
			input.name,
			Price.fromNumber(input.price),
			input.category,
			input.sku,
			input.isActive,
		);
	}

	toJSON() {
		return {
			id: this.id.toString(),
			name: this._name,
			price: this._price.valueOf(),
			category: this._category,
			sku: this._sku,
			isActive: this._isActive,
		};
	}

	private validate() {
		if (this._name === undefined) {
			throw new Error("Name is required");
		}

		if (this._price === undefined) {
			throw new Error("Price is required");
		}

		if (this._sku === undefined) {
			throw new Error("Sku is required");
		}

		if (this._price.valueOf() < 0) {
			throw new Error("Price must be positive");
		}

		if (this._category === undefined) {
			throw new Error("Category is required");
		}

		if (this._isActive === undefined) {
			throw new Error("isActive is required");
		}
	}

	get name() {
		return this._name;
	}

	get price() {
		return this._price;
	}

	get category() {
		return this._category;
	}

	get sku() {
		return this._sku;
	}

	get isActive() {
		return this._isActive;
	}

	rename(name: string) {
		if (!name) {
			throw new Error("Name is required");
		}

		this._name = name;
	}

	changePrice(price: Price) {
		if (price.valueOf() < 0) {
			throw new Error("Price must be positive");
		}

		this.apply("item.PriceChanged", {});

		this._price = price;
	}

	changeCategory(category: string) {
		if (!category) {
			throw new Error("Category is required");
		}

		this._category = category;
	}

	changeSku(sku: string) {
		if (!sku) {
			throw new Error("Sku is required");
		}

		this._sku = sku;
	}

	activate() {
		this._isActive = true;
	}

	deactivate() {
		this._isActive = false;
	}
}

type CreateItemInput = {
	name: string;
	price: Price;
	sku: string;
	category: string;
};
