import type { Entity } from "./entity";
import type { Id } from "./id";

export abstract class Aggregate implements Entity {
	abstract readonly id: Id;
}
