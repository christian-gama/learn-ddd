import "jest-extended";
import { Address } from "../common/address";
import { EventDispatcher } from "../common/dispatcher";
import { Id } from "../common/id";
import { Price } from "../common/price";
import { Zip } from "../common/zip";
import { Order } from "./order";
import { OrderItem } from "./order-item";

describe("Order", () => {
	describe("create", () => {
		it("should throw if order items are empty", () => {
			const input = {
				address: Address.create({
					street: "Rua 1",
					city: "Vitória da Conquista",
					country: "Brasil",
					zip: Zip.fromString("45000-000"),
					number: "123",
				}),
				customerId: Id.generate(),
				deliveryPersonId: Id.generate(),
				orderItems: [],
			};

			const sut = () => Order.create(input);

			expect(sut).toThrow("Order item cannot be empty");
		});

		it("should set default values when creating an order", () => {
			const itemId = Id.generate();
			const input = {
				address: Address.create({
					street: "Rua 1",
					city: "Vitória da Conquista",
					country: "Brasil",
					zip: Zip.fromString("45000-000"),
					number: "123",
				}),
				customerId: Id.generate(),
				deliveryPersonId: Id.generate(),
				orderItems: [
					{
						price: Price.fromNumber(10),
						quantity: 1,
						itemId: itemId,
					},
					{
						price: Price.fromNumber(12),
						quantity: 2,
						itemId: Id.generate(),
					},
					{
						price: Price.fromNumber(12),
						quantity: 5,
						itemId: Id.generate(),
					},
				],
			};

			const result = Order.create(input);

			expect(result).toBeInstanceOf(Order);
			expect(result.id).not.toBe("");
			expect(result.status).toBe("PLACED");
			expect(result.orderItems).toContainEqual(
				OrderItem.create({
					itemId: itemId,
					orderId: result.id,
					price: Price.fromNumber(10),
					quantity: 1,
				}),
			);
		});
	});

	it("should apply the order.Created event", async () => {
		const publishSpy = jest
			.spyOn(EventDispatcher, "publish")
			.mockResolvedValueOnce();
		const input = {
			address: Address.create({
				street: "Rua 1",
				city: "Vitória da Conquista",
				country: "Brasil",
				zip: Zip.fromString("45000-000"),
				number: "123",
			}),
			customerId: Id.generate(),
			deliveryPersonId: Id.generate(),
			orderItems: [
				{
					price: Price.fromNumber(10),
					quantity: 1,
					itemId: Id.generate(),
				},
			],
		};

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
