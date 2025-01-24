import type { ValueObject } from "./value-object";

export class Zip implements ValueObject {
	constructor(readonly value: string) {
		if (!/^\d{8}$/.test(value)) {
			throw new Error("Invalid zip code");
		}
	}

	format() {
		return `${this.value.slice(0, 5)}-${this.value.slice(5)}`;
	}

	equals(other: this): boolean {
		return this.value === other.value;
	}

	toString() {
		return this.value;
	}
}
