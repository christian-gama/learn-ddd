import type { ValueObject } from "./value-object";

export class Id implements ValueObject {
	constructor(readonly value: string) {
		if (value === undefined) {
			throw new Error("Id is required");
		}
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
