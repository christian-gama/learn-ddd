import { Price } from "./price";

describe("price", () => {
	describe("fromNumber", () => {
		it("should convert the amount to cents", () => {
			const amount = 10.5;

			const result = Price.fromNumber(amount);

			expect(result.valueOf()).toBe(10.5);
			expect(result.cents).toBe(1050);
		});
	});

	describe("add", () => {
		it.each([
			[1, 2],
			[0, 1],
			[0, 0],
			[Number.MAX_SAFE_INTEGER / 100 - 1, 1],
			[Number.MAX_SAFE_INTEGER / 100, 0],
		])("should add %d and %d", (a, b) => {
			const priceA = Price.fromNumber(a);
			const priceB = Price.fromNumber(b);

			const result = priceA.add(priceB);

			expect(result.valueOf()).toBe(a + b);
		});

		it.each([
			[1, -1],
			[1, Number.MIN_SAFE_INTEGER],
		])("should throw an error when adding a negative amount", () => {
			const priceA = Price.fromNumber(1);
			const priceB = Price.fromNumber(-1);

			// System Under Test
			const sut = () => priceA.add(priceB);

			expect(sut).toThrow("Cannot add a negative amount");
		});

		it("should throw when exceeds the maximum safe integer", () => {
			const priceA = Price.fromNumber(Number.MAX_SAFE_INTEGER / 100);
			const priceB = Price.fromNumber(1);

			// System Under Test
			const sut = () => priceA.add(priceB);

			expect(sut).toThrow("Value exceeds maximum safe integer");
		});
	});

	describe("sub", () => {
		it.each([
			[1, 2],
			[0, 1],
			[0, 0],
			[Number.MAX_SAFE_INTEGER / 100 - 1, 1],
			[Number.MAX_SAFE_INTEGER / 100, 0],
		])("should subtract %d and %d", (a, b) => {
			const priceA = Price.fromNumber(a);
			const priceB = Price.fromNumber(b);

			const result = priceA.sub(priceB);

			expect(result.valueOf()).toBe(a - b);
		});

		it.each([
			[1, -1],
			[1, Number.MIN_SAFE_INTEGER],
		])("should throw an error when subtracting a negative amount", () => {
			const priceA = Price.fromNumber(1);
			const priceB = Price.fromNumber(-1);

			// System Under Test
			const sut = () => priceA.sub(priceB);

			expect(sut).toThrow("Cannot subtract a negative amount");
		});

		it("should throw when exceeds the maximum safe integer", () => {
			const priceA = Price.fromNumber(Number.MIN_SAFE_INTEGER / 100);
			const priceB = Price.fromNumber(1);

			// System Under Test
			const sut = () => priceA.sub(priceB);

			expect(sut).toThrow("Value is less than minimum safe integer");
		});
	});
});
