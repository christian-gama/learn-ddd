import { Aggregate } from "../common/aggregate";
import { Id } from "../common/id";
import type { ToJSON } from "../common/toJSON";

export class Customer extends Aggregate {
	constructor(
		readonly id: Id,
		public name: string,
	) {
		super();
	}

	static create(input: CreateCustomerInput) {
		return new Customer(input.id, input.name);
	}

	static fromJSON(input: ToJSON<Customer>) {
		return new Customer(Id.fromString(input.id), input.name);
	}

	toJSON() {
		return {
			id: this.id.toString(),
			name: this.name,
		};
	}
}

export type CreateCustomerInput = {
	id: Id;
	name: string;
};
