import "jest-extended";
import { EventDispatcher } from "../common/dispatcher";
import { Id } from "../common/id";
import { Price } from "../common/price";
import { FakeOrder } from "./__testutil__/order.fake";
import { Order } from "./order";
import { OrderItem } from "./order-item";

describe("Order", () => {
	describe("create", () => {
		it("should throw if order items are empty", () => {
			const input = new FakeOrder().withEmptyOrderItems().build();

			const sut = () => Order.create(input);

			expect(sut).toThrow("Order item cannot be empty");
		});

		it("should set default values when creating an order", () => {
			const itemId = Id.generate();
			const input = new FakeOrder().withOrderItem({ itemId }).build();

			const result = Order.create(input);

			expect(result).toBeInstanceOf(Order);
			expect(result.id).not.toBe("");
			expect(result.status).toBe("PLACED");
			expect(result.orderItems).toContainEqual(
				OrderItem.create({
					itemId: itemId,
					orderId: result.id,
					price: expect.any(Price),
					quantity: expect.any(Number),
				}),
			);
		});
	});

	it("should apply the order.Created event", async () => {
		const publishSpy = jest
			.spyOn(EventDispatcher, "publish")
			.mockResolvedValueOnce();
		const input = new FakeOrder().build();

		const result = Order.create(input);
		await result.publish();

		expect(publishSpy).toHaveBeenCalledTimes(1);
		expect(publishSpy).toHaveBeenCalledWith(
			expect.objectContaining({
				name: "order.Created",
				payload: expect.objectContaining({
					id: expect.any(Id),
				}),
			}),
		);
	});
});
