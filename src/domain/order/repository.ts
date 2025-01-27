import type { Id } from "../common/id";
import type { Order } from "./order";

export interface OrderRepository {
	create(order: Order): Promise<Id>;
	update(order: Order): Promise<void>;
	findById(id: Id): Promise<Order | null>;
	deleteById(order: Order): Promise<void>;
	nextId(): Promise<Id>;
}
