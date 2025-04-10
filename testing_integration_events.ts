import { IntegrationEvent } from "./libs/events/integration.event";
import { EventBus } from "./src/infrastructure/messaging/nats";

async function run() {
	const eventBus = new EventBus();
	await eventBus.init();

	await eventBus.subscribe("foo", "fooHandler", async (event) => {
		console.log("Received event", event);
	});

	// Salvar comprou ingresso

	await eventBus.publish(
		new IntegrationEvent("foo", { message: "Hello, World!" }),
	);

	setTimeout(async () => {
		await eventBus.close();
	}, 1200);
}

await run().catch(console.error);
