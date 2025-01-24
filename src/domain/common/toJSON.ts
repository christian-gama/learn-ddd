// biome-ignore lint/complexity/noBannedTypes: <explanation>
export type ToJSON<T extends { toJSON(): Object }> = T extends {
	toJSON(): infer R;
}
	? R
	: never;
