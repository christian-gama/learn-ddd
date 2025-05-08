import { faker } from "@faker-js/faker";
import { Address } from "../../common/address";
import { Id } from "../../common/id";
import { Price } from "../../common/price";
import { Zip } from "../../common/zip";
import type { CreateOrderInput } from "../order";

export class FakeOrder {
	private customerId = Id.generate();
	private _deliveryPersonId = Id.generate();
	private _address: Address = Address.create({
		city: faker.location.city(),
		country: faker.location.country(),
		number: faker.location.buildingNumber(),
		street: faker.location.street(),
		zip: Zip.fromString("45000-000"),
	});
	private _orderItems: CreateOrderInput["orderItems"] = Array.from(
		{ length: faker.number.int({ min: 3, max: 10 }) },
		() => ({
			itemId: Id.generate(),
			price: Price.fromNumber(faker.number.int({ min: 1, max: 1000 })),
			quantity: faker.number.int({ min: 1, max: 10 }),
		}),
	);

	withCustomerId(customerId: Id) {
		this.customerId = customerId;
		return this;
	}

	withDeliveryPersonId(deliveryPersonId: Id) {
		this._deliveryPersonId = deliveryPersonId;
		return this;
	}

	withAddress(address: Address) {
		this._address = address;
		return this;
	}

	withEmptyOrderItems() {
		this._orderItems = [];
		return this;
	}

	withOrderItems(orderItems: CreateOrderInput["orderItems"]) {
		this._orderItems = orderItems;
		return this;
	}

	withOrderItem({
		itemId = Id.generate(),
		price = Price.fromNumber(faker.number.int({ min: 1, max: 1000 })),
		quantity = faker.number.int({ min: 1, max: 10 }),
	}: Partial<CreateOrderInput["orderItems"][number]>) {
		this._orderItems.push({
			itemId,
			price,
			quantity,
		});
		return this;
	}

	build(): CreateOrderInput {
		return {
			address: this._address,
			customerId: this.customerId,
			deliveryPersonId: this._deliveryPersonId,
			orderItems: this._orderItems,
		};
	}
}
