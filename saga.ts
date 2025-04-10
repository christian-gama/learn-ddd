interface SagaState<T = Record<string, unknown>> {
	currentStep: number;
	data: T;
	error?: Error;
}

interface SagaStep {
	execute?(state: SagaState): Promise<void>;
	compensate?(state: SagaState): Promise<void>;
}

class SagaDefinition {
	public name!: string;
	public steps!: SagaStep[];
}

class SagaOrchestrator {
	definition!: SagaDefinition;

	async start(initialData: Record<string, unknown>) {
		const state: SagaState = { currentStep: 0, data: initialData };

		console.log("starting saga");

		for (let i = 0; i < this.definition.steps.length; i++) {
			const step = this.definition.steps[i];
			state.currentStep = i;

			try {
				if (step.execute) {
					await step.execute(state);
				}
			} catch (error) {
				state.error = error as Error;

				for (let j = i; j >= 0; j--) {
					const step = this.definition.steps[j];

					if (step.compensate) {
						await step.compensate(state);
					}
				}
			}
		}
	}
}

async function main() {
	const definition = new SagaDefinition();
	definition.name = "Fluxo de comprar ingresso";
	definition.steps = [
		{
			execute: async (state: SagaState<{ value: number }>) => {
				console.log("pagando o ingresso");
				state.data.value++;
			},
			compensate: async (state: SagaState<{ value: number }>) => {
				console.log("estornando a compra do ingresso");
				state.data.value--;
			},
		},
		{
			execute: async (state: SagaState<{ value: number }>) => {
				console.log("alterando o status da compra do ingresso no banco");
				state.data.value++;
			},
			compensate: async (state: SagaState<{ value: number }>) => {
				console.log("desfazendo a compra do ingresso no banco");
				state.data.value--;
			},
		},
		{
			execute: async (state: SagaState<{ value: number }>) => {
				try {
					console.log("enviando o ingresso por email");
					state.data.value++;
					throw new Error("erro ao enviar o ingresso por email");
				} catch (error) {
					console.log((error as Error).message);
					state.data.value--;
					throw error;
				}
			},
		},
	];

	const orchestrator = new SagaOrchestrator();
	orchestrator.definition = definition;

	const data = { value: 0 };
	await orchestrator.start(data);
	console.log("saga finalizada", data);
}

main().catch(console.error);
