import { randomUUIDv7 } from "bun";

export class IntegrationEvent<T> {
	id = randomUUIDv7().toString();
	occurredAt = new Date();

	constructor(
		public name: string,
		public payload: T,
	) {}
}
