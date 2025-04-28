import type { ValueObject } from "./value-object";

export class Id implements ValueObject {
	private constructor(private readonly value: string) {
		if (value === undefined) {
			throw new Error("Id is required");
		}

		if (value.length === 0) {
			throw new Error("Id cannot be empty");
		}

		const uuidRegex =
			/^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
		if (!uuidRegex.test(value)) {
			throw new Error("Id must be a valid UUID");
		}
	}

	static fromString(value: string) {
		return new Id(value);
	}

	static generate() {
		return new Id(Bun.randomUUIDv7());
	}

	equals(other: this): boolean {
		return this.value === other.value;
	}

	toString() {
		return this.value;
	}
}
