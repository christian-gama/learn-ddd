import { PrismaClient } from "@prisma/client";
import { sleep } from "bun";
import { IntegrationEvent } from "./libs/events/integration.event";
import { EventBus } from "./src/infrastructure/messaging/nats";

const prisma = new PrismaClient();
const eventBus = new EventBus();
await eventBus.init();
const failed = 0;

const processedEvents = new Set<string>();

async function run() {
	await eventBus.subscribe("foo", "fooHandler", async (event) => {
		console.log("===========================================================");
		console.log("Received event", event);

		if (processedEvents.has(event.id)) {
			console.log("Event already processed, skipping:", event.id);
			return;
		}

		console.log("Processing event", event);
		processedEvents.add(event.id);
	});

	// await eventBus.publish(
	// 	new IntegrationEvent("foo", { message: "Hello, World!" }),
	// );

	const event = new IntegrationEvent("foo", { message: "Hello, World!" });

	console.log("===========================================================");
	console.log("creating event", event);

	await prisma.outbox.create({
		data: {
			id: event.id,
			eventName: event.name,
			occurredAt: event.occurredAt,
			payload: event.payload,
			status: "pending",
		},
	});

	console.log("created event (saved on outbox table)");

	const timerId = setInterval(async () => {
		await outboxScheduler();
	}, 2000);

	await sleep(7000);
	await eventBus.close();
	clearInterval(timerId);
}

await run().catch(console.error);

async function outboxScheduler() {
	try {
		console.log("===========================================================");
		console.log("processing outboxes");
		const outboxes = await prisma.outbox.findMany({
			where: {
				status: "pending",
			},
		});

		for (const outbox of outboxes) {
			const event = new IntegrationEvent(outbox.eventName, outbox.payload);
			event.id = outbox.id;
			event.occurredAt = outbox.occurredAt;

			// if (failed === 0) {
			// 	failed++;
			// 	throw new Error("Failed to publish event due to nats being offline");
			// }

			console.log("publishing event", event);
			await eventBus.publish(event);

			await prisma.outbox.update({
				where: { id: outbox.id },
				data: { status: "processed" },
			});
		}
	} catch (error) {
		console.error("Error processing outboxes:", error);
	}
}
