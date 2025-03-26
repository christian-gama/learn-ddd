import { EventDispatcher } from "./dispatcher";
import type { DomainEvent } from "./domain-event";
import type { Entity } from "./entity";
import type { Id } from "./id";

export abstract class Aggregate implements Entity {
	protected events: DomainEvent[] = [];
	abstract readonly id: Id;

	protected apply(event: string, payload: unknown) {
		this.events.push({ name: event, payload });
	}

	async publish() {
		for (const event of this.events) {
			await EventDispatcher.publish(event);
		}
		this.events = [];
	}
}
