import type { ValueObject } from "./value-object";

export class Price implements ValueObject {
	private cents: number;

	constructor(value: number) {
		this.cents = Math.round(value * 100);
	}

	static fromNumber(value: number) {
		return new Price(value);
	}

	add(amount: Price) {
		return new Price(this.valueOf() + amount.valueOf());
	}

	sub(amount: Price) {
		return new Price(this.valueOf() - amount.valueOf());
	}

	multiply(value: number) {
		return new Price(this.valueOf() * value);
	}

	divide(value: number) {
		return new Price(this.valueOf() / value);
	}

	discount(value: number) {
		return new Price(this.valueOf() * (1 - value));
	}

	equals(other: this): boolean {
		return other.cents === this.cents;
	}

	valueOf() {
		return this.cents / 100;
	}
}
