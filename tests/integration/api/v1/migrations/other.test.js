import orchestrator from "tests/orchestrator.js";

beforeAll(async () => {
  await orchestrator.waitForAllServices();
  await orchestrator.clearDatabase();
});

describe("OTHERS methods /api/v1/migrations", () => {
  describe("anonimous user", () => {
    describe("running others methods", () => {
      test("DELETE method", async () => {
        const response1 = await fetch(
          "http://localhost:3000/api/v1/migrations",
          {
            method: "DELETE",
          },
        );
        expect(response1.status).toBe(405);
      });

      test("PATCH method", async () => {
        const response2 = await fetch(
          "http://localhost:3000/api/v1/migrations",
          {
            method: "PATCH",
          },
        );
        expect(response2.status).toBe(405);
      });

      test("OPTIONS method", async () => {
        const response2 = await fetch(
          "http://localhost:3000/api/v1/migrations",
          {
            method: "OPTIONS",
          },
        );
        expect(response2.status).toBe(405);
      });
    });
  });
});
