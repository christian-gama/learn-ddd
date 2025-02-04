import { OrderQuery } from "./src/application/order.query";
import {
	type OrderDTO,
	OrderService,
	type ReassignDeliveryPersonDTO,
} from "./src/application/order.service";
import { Id } from "./src/domain/common/id";
import { PostgresOrderRepository } from "./src/infrastructure/repository/order.repository";

const mysqlOrderRepository = new PostgresOrderRepository();

const orderService = new OrderService(mysqlOrderRepository);

const dto: OrderDTO = {
	address: {
		city: "Vitória da Conquista",
		country: "Brasil",
		zip: "45000-000",
		number: "123",
		street: "Rua 1",
	},
	deliveryPersonId: Bun.randomUUIDv7(),
	customerId: Bun.randomUUIDv7(),
	items: [
		{
			id: Bun.randomUUIDv7(),
			sku: "SKU-1",
			category: "Category 1",
			name: "Item 1",
			price: 10,
			quantity: 1,
		},
	],
};

const id = await orderService.createOrder(dto);

const frontendResponse = await mysqlOrderRepository.findById(
	Id.fromString(id),
)!;

const orderQuery = new OrderQuery();

console.log(await orderQuery.frontendResponse(id));
