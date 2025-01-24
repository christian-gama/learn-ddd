import { Address } from "./src/domain/common/address";
import { Id } from "./src/domain/common/id";
import { Price } from "./src/domain/common/price";
import { Zip } from "./src/domain/common/zip";
import { Item } from "./src/domain/order/item";
import { Order } from "./src/domain/order/order";

const item = Item.create({
	id: Id.generate(),
	name: "Bola de basquete",
	price: new Price(10),
	sku: "0194618d-d752-7db0-b51e-82c0ec8846b0",
	quantity: 1,
	category: "Sports",
});

const order = Order.create({
	id: Id.generate(),
	address: Address.create({
		city: "city",
		street: "street",
		country: "country",
		zip: new Zip("12345678"),
		number: "number",
	}),
	deliveryPersonId: new Id("1"),
	customerId: new Id("2"),
});

order.addItem(item);

order.updateItemName(item.id, "Bola de futebol");
