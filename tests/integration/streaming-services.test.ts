import supertest from "supertest";
import app from "../../src/app";
import { createStreamingService } from "../factories";
import { cleanDb } from "../helpers";

beforeAll(async () => {
  await cleanDb();
});

const server = supertest(app);

describe("GET /streaming-services", () => {
  it("should respod with status 200 and with streaming services data", async () => {
    await createStreamingService();

    const response = await server.get("/streaming-services");

    expect(response.status).toEqual(200);
    expect(response.body).toEqual([
      {
        id: expect.any(Number),
        name: expect.any(String),
        created_at: expect.any(String),
      },
    ]);
  });
});
