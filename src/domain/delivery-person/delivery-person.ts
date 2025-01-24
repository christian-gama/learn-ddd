import { Aggregate } from "../common/aggregate";
import { Id } from "../common/id";
import type { ToJSON } from "../common/toJSON";

enum DeliveryPersonStatus {
	Available = "available",
	Busy = "busy",
}

export class DeliveryPerson extends Aggregate {
	constructor(
		readonly id: Id,
		public name: string,
		public status: DeliveryPersonStatus,
	) {
		super();
	}

	static create(input: CreateDeliveryPersonInput) {
		return new DeliveryPerson(
			input.id,
			input.name,
			DeliveryPersonStatus.Available,
		);
	}

	static fromJSON(input: ToJSON<DeliveryPerson>) {
		return new DeliveryPerson(new Id(input.id), input.name, input.status);
	}

	toJSON() {
		return {
			id: this.id.toString(),
			name: this.name,
			status: this.status,
		};
	}
}

export type CreateDeliveryPersonInput = {
	id: Id;
	name: string;
};
