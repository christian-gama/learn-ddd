import type { Address } from "../common/address";
import type { Id } from "../common/id";
import type { OrderStatus } from "./order";
import type { OrderItem } from "./order-item";

const OrderCreatedEvent = "order.Created";

export class OrderCreated {
	static eventName = OrderCreatedEvent;

	constructor(
		readonly customerId: Id,
		readonly deliveryPersonId: Id,
		readonly address: Address,
		readonly orderItems: OrderItem[],
		readonly status: OrderStatus,
	) {}
}
