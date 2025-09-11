// Test configuration for running all auth-related tests
const testFiles = [
  "src/__tests__/auth.service.test.ts",
  "src/__tests__/auth.controller.test.ts",
  "src/__tests__/auth.controller.integration.test.ts",
  "src/__tests__/auth.api.e2e.test.ts",
  "src/__tests__/admin.controller.test.ts",
];

console.log("Running comprehensive test suite for authentication APIs...");

testFiles.forEach((file) => {
  console.log(`- ${file}`);
});

export { testFiles };
