import type { ToJSON } from "./toJSON";
import type { ValueObject } from "./value-object";
import { Zip } from "./zip";

export class Address implements ValueObject {
	protected constructor(
		readonly city: string,
		readonly street: string,
		readonly country: string,
		readonly zip: Zip,
		readonly number: string,
	) {}

	static create(input: CreateAddressInput) {
		const address = new Address(
			input.city,
			input.street,
			input.country,
			input.zip,
			input.number,
		);

		address.validate();

		return address;
	}

	static fromJSON(input: ToJSON<Address>) {
		return new Address(
			input.city,
			input.street,
			input.country,
			new Zip(input.zip),
			input.number,
		);
	}

	toJSON() {
		return {
			city: this.city,
			street: this.street,
			country: this.country,
			zip: this.zip.toString(),
			number: this.number,
		};
	}

	equals(other: this): boolean {
		return (
			this.city === other.city &&
			this.street === other.street &&
			this.country === other.country &&
			this.zip.equals(other.zip) &&
			this.number === other.number
		);
	}

	private validate() {
		if (this.city === undefined) {
			throw new Error("City is required");
		}
	}
}

export type CreateAddressInput = {
	city: string;
	street: string;
	country: string;
	zip: Zip;
	number: string;
};
