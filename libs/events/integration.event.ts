import { randomUUIDv7 } from "bun";

export class IntegrationEvent<T> {
	readonly id = randomUUIDv7().toString();
	readonly occurredAt = new Date();

	constructor(
		readonly name: string,
		readonly payload: T,
	) {}
}
