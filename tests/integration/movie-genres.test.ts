import supertest from "supertest";
import app from "../../src/app";
import { createMovieGenre } from "../factories";
import { cleanDb } from "../helpers";

beforeAll(async () => {
  await cleanDb();
});

const server = supertest(app);

describe("GET /movie-genres", () => {
  it("should respod with status 200 and with movie genres data", async () => {
    const movieGenre = await createMovieGenre();

    const response = await server.get("/movie-genres");

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
