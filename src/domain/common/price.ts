import type { ValueObject } from "./value-object";

export class Price implements ValueObject {
	readonly cents: number;

	protected constructor(value: number) {
		if (value > Number.MAX_SAFE_INTEGER / 100) {
			throw new Error("Value exceeds maximum safe integer");
		}

		if (value < Number.MIN_SAFE_INTEGER / 100) {
			throw new Error("Value is less than minimum safe integer");
		}

		this.cents = Math.round(value * 100);
	}

	static fromNumber(value: number) {
		return new Price(value);
	}

	add(amount: Price) {
		if (amount.cents < 0) {
			throw new Error("Cannot add a negative amount");
		}

		return new Price(this.valueOf() + amount.valueOf());
	}

	sub(amount: Price) {
		if (amount.cents < 0) {
			throw new Error("Cannot subtract a negative amount");
		}

		return new Price(this.valueOf() - amount.valueOf());
	}

	multiply(value: number) {
		return new Price(this.valueOf() * value);
	}

	divide(value: number) {
		if (value === 0) {
			throw new Error("Cannot divide by zero");
		}

		return new Price(this.valueOf() / value);
	}

	discount(value: number) {
		if (value < 0 || value > 1) {
			throw new Error("Discount must be between 0 and 1");
		}

		return new Price(this.valueOf() * (1 - value));
	}

	equals(other: this): boolean {
		return other.cents === this.cents;
	}

	valueOf() {
		return this.cents / 100;
	}
}
