import { Id } from "./id";

describe("id", () => {
	describe("generate", () => {
		it("should not throw when generating", () => {
			const uuidRegex =
				/^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;

			const result = Id.generate();

			expect(result).toBeInstanceOf(Id);
			expect(result.toString()).toMatch(uuidRegex);
		});

		it("should generate different ids", () => {
			const id1 = Id.generate();
			const id2 = Id.generate();

			expect(id1).not.toEqual(id2);
		});
	});

	describe("fromString", () => {
		it("should throw if value is undefined", () => {
			// biome-ignore lint/suspicious/noExplicitAny: <explanation>
			const value: any = undefined;

			const fn = () => {
				Id.fromString(value);
			};

			expect(fn).toThrow("Id is required");
		});

		it("should throw if value is empty", () => {
			const value = "";

			const fn = () => {
				Id.fromString(value);
			};

			expect(fn).toThrow("Id cannot be empty");
		});

		it.each([
			"invalid-uuid",
			"1234-1234-1234-1",
			"01967e4z-6f0e-7311-b061-72c70dd50155",
			"01967e4f-6f0e-7311-b061-72c7",
		])("should throw if value %s not a valid UUID", (value) => {
			const fn = () => {
				Id.fromString(value);
			};

			expect(fn).toThrow("Id must be a valid UUID");
		});
	});

	describe("equals", () => {
		it("should return true if ids are equal", () => {
			const id1 = Id.fromString("01967e4f-6f0e-7311-b061-72c70dd50155");
			const id2 = Id.fromString("01967e4f-6f0e-7311-b061-72c70dd50155");

			const result = id1.equals(id2);

			expect(result).toBe(true);
		});

		it("should return false if ids are not equal", () => {
			const id1 = Id.fromString("01967e4f-6f0e-7311-b061-72c70dd50155");
			const id2 = Id.fromString("01967e4f-6f0e-7311-b061-72c70dd50156");

			const result = id1.equals(id2);

			expect(result).toBe(false);
		});
	});

	describe("toString", () => {
		it("should return the string representation of the id", () => {
			const id = Id.fromString("01967e4f-6f0e-7311-b061-72c70dd50155");

			const result = id.toString();

			expect(result).toBe("01967e4f-6f0e-7311-b061-72c70dd50155");
		});
	});
});
