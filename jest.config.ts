module.exports = {
	preset: "ts-jest",
	testEnvironment: "jest-environment-node",
	setupFilesAfterEnv: ["./jest_setup.ts"]
}