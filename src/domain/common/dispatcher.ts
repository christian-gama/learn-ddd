import type { DomainEvent } from "./domain-event";

// biome-ignore lint/complexity/noStaticOnlyClass: <explanation>
export class EventDispatcher {
	private static _subscribers: Map<
		string,
		Array<(payload: unknown) => Promise<void> | void>
	> = new Map();

	static async publish(event: DomainEvent) {
		const handlers = EventDispatcher._subscribers.get(event.name);
		if (!handlers) {
			throw new Error(`No subscribers for event ${event.name}`);
		}

		await Promise.all(handlers.map((handler) => handler(event.payload)));
	}

	static subscribe<T>(
		event: string,
		handler: (payload: T) => Promise<void> | void,
	) {
		const handlers = EventDispatcher._subscribers.get(event) ?? [];
		handlers.push(handler as (payload: unknown) => Promise<void> | void);
		EventDispatcher._subscribers.set(event, handlers);
	}
}
