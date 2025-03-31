import { randomUUIDv7 } from "bun";
import {
	AckPolicy,
	type Consumer,
	type ConsumerConfig,
	type ConsumerMessages,
	DeliverPolicy,
	JSONCodec,
	type JetStreamClient,
	type JetStreamManager,
	type NatsConnection,
	NatsError,
	ReplayPolicy,
	connect,
} from "nats";

async function run() {
	const nc = await connect({
		servers: "nats://fedora:4222",
	});

	const eventBus = new EventBus(nc);
	await eventBus.init();

	await eventBus.subscribe("foo", "fooHandler", async (event) => {
		console.log("Received event", event);
	});

	await eventBus.publish(
		new IntegrationEvent("foo", { message: "Hello, World!" }),
	);

	setTimeout(async () => {
		await eventBus.close();
	}, 1200);
}

await run().catch(console.error);

class IntegrationEvent<T> {
	readonly id = randomUUIDv7().toString();
	readonly occurredAt = new Date();

	constructor(
		readonly name: string,
		readonly payload: T,
	) {}
}

class EventBus {
	private jc = JSONCodec<IntegrationEvent<unknown>>();
	private jsm!: JetStreamManager;
	private js!: JetStreamClient;
	private messages: Map<string, ConsumerMessages> = new Map();

	constructor(private readonly nc: NatsConnection) {}

	async init() {
		this.js = this.nc.jetstream();
		this.jsm = await this.nc.jetstreamManager();
	}

	async publish(event: IntegrationEvent<unknown>) {
		await this.js.publish(event.name, this.jc.encode(event));
	}

	async subscribe<T>(
		event: string,
		handlerName: string,
		handler: (event: IntegrationEvent<T>) => Promise<void>,
	) {
		let streamName = `events-${handlerName}`;

		try {
			await this.jsm.streams.info(streamName);
		} catch (err) {
			if (!(err instanceof NatsError)) {
				throw err;
			}

			if (err.code !== "404") {
				throw err;
			}

			try {
				await this.jsm.streams.add({ name: streamName, subjects: [event] });
			} catch (err) {
				if (!(err instanceof NatsError)) {
					throw err;
				}

				if (!err.message?.includes("subjects overlap")) {
					throw err;
				}

				const streams = [];
				for await (const stream of this.jsm.streams.list()) {
					streams.push(stream);
				}

				for (const stream of streams) {
					const info = await this.jsm.streams.info(stream.config.name);

					if (info.config.subjects.includes(event)) {
						streamName = stream.config.name;
						break;
					}
				}
			}
		}

		const consumerConfig: ConsumerConfig = {
			durable_name: `consumer-${event}`,
			ack_policy: AckPolicy.Explicit,
			deliver_policy: DeliverPolicy.All,
			replay_policy: ReplayPolicy.Instant,
		};

		let consumer: Consumer;
		try {
			consumer = await this.js.consumers.get(
				streamName,
				consumerConfig.durable_name as string,
			);
		} catch (err) {
			await this.jsm.consumers.add(streamName, consumerConfig);
			consumer = await this.js.consumers.get(
				streamName,
				consumerConfig.durable_name as string,
			);
		}

		const messages = await consumer.consume();

		this.messages.set(handlerName, messages);

		(async () => {
			for await (const msg of messages) {
				try {
					const event = this.jc.decode(msg.data);
					console.log(`Received message on subject ${msg.subject}`);
					await Promise.resolve(handler(event as IntegrationEvent<T>));
					msg.ack();
				} catch (error) {
					msg.nak();
					console.error("Error processing event:", error);
				}
			}
		})().catch((error) => {
			console.error("Consumer error:", error);
		});
	}

	async close() {
		await this.nc.flush();
		await this.nc.close();

		for (const consumer of this.messages.values()) {
			await consumer.close();
		}
	}
}
