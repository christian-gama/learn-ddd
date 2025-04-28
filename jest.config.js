/** @type {import('ts-jest').JestConfigWithTsJest} **/
export default {
	testEnvironment: "node",
	transform: {
		"^.+.tsx?$": ["ts-jest", {}],
	},
	clearMocks: true,
	collectCoverage: true,
	coverageDirectory: "coverage",
};
