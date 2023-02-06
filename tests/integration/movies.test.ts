import supertest from "supertest";
import app from "../../src/app";
import {
  createMovieGenre,
  createMovie,
  createStreamingService,
} from "../factories";
import { cleanDb, disconnectDatabase } from "../helpers";

beforeEach(async () => {
  await cleanDb();
});

afterAll(async () => {
  await disconnectDatabase();
});

const server = supertest(app);

describe("GET /movies", () => {
  it("should respod with status 200 and with movies data", async () => {
    const streamingService = await createStreamingService();
    const movieGenre = await createMovieGenre();
    const movie = await createMovie(
      "Mad Max: Estrada da Fúria",
      streamingService.id,
      movieGenre.id
    );

    const response = await server.get("/movies");

    expect(response.status).toEqual(200);
    expect(response.body).toEqual([
      {
        id: movie.id,
        name: movie.name,
        streaming_services: {
          name: streamingService.name,
        },
        movie_genres: {
          name: movieGenre.name,
        },
        watched: movie.watched,
        date_watched: movie.date_watched,
        rating: movie.rating,
        created_at: expect.any(String),
      },
    ]);
  });
});

describe("POST /movies", () => {
  it("should respond with status 404 when given streaming service doesn't exist", async () => {
    const movieGenre = await createMovieGenre();
    const body = {
      name: "Mad Max: Estrada da Fúria",
      streaming_service_id: 10000,
      genre_id: movieGenre.id,
    };

    const response = await server.post("/movies").send(body);

    expect(response.status).toEqual(404);
  });

  it("should respond with status 404 when given movie genre doesn't exist", async () => {
    const streamingService = await createStreamingService();
    const body = {
      name: "Mad Max: Estrada da Fúria",
      streaming_service_id: streamingService.id,
      genre_id: 1000,
    };

    const response = await server.post("/movies").send(body);

    expect(response.status).toEqual(404);
  });

  it("should respod with status 409 when movie already exists", async () => {
    const streamingService = await createStreamingService();
    const movieGenre = await createMovieGenre();
    const movie = await createMovie(
      "Mad Max: Estrada da Fúria",
      streamingService.id,
      movieGenre.id
    );
    const body = {
      name: movie.name,
      streaming_service_id: movie.streaming_service_id,
      genre_id: movie.genre_id,
    };

    const response = await server.post("/movies").send(body);

    expect(response.status).toEqual(409);
  });

  it("should respod with status 201", async () => {
    const streamingService = await createStreamingService();
    const movieGenre = await createMovieGenre();
    const body = {
      name: "Mad Max: Estrada da Fúria",
      streaming_service_id: streamingService.id,
      genre_id: movieGenre.id,
    };

    const response = await server.post("/movies").send(body);

    expect(response.status).toEqual(201);
  });
});

describe("PATCH /movies/:id", () => {
  it("should respond with status 404 when given movie doesn't exist", async () => {
    await createStreamingService();
    await createMovieGenre();
    const body = {
      rating: 5,
    };

    const response = await server.patch("/movies/1000").send(body);

    expect(response.status).toEqual(404);
  });

  it("should respod with status 200", async () => {
    const streamingService = await createStreamingService();
    const movieGenre = await createMovieGenre();
    const movie = await createMovie(
      "Mad Max: Estrada da Fúria",
      streamingService.id,
      movieGenre.id
    );
    const body = {
      rating: 5,
    };

    const response = await server.patch(`/movies/${movie.id}`).send(body);

    expect(response.status).toEqual(200);
  });
});

describe("DELETE /movies/:id", () => {
  it("should respond with status 404 when given movie doesn't exist", async () => {
    await createStreamingService();
    await createMovieGenre();

    const response = await server.delete(`/movies/${1000}`);

    expect(response.status).toEqual(404);
  });

  it("should respod with status 200", async () => {
    const streamingService = await createStreamingService();
    const movieGenre = await createMovieGenre();
    const movie = await createMovie(
      "Mad Max: Estrada da Fúria",
      streamingService.id,
      movieGenre.id
    );

    const response = await server.delete(`/movies/${movie.id}`);

    expect(response.status).toEqual(200);
  });
});

describe("GET /movies/genre/:id", () => {
  it("should respond with status 404 when given movie genre doesn't exist", async () => {
    const streamingService = await createStreamingService();
    const movieGenre = await createMovieGenre();
    const movie = await createMovie(
      "Mad Max: Estrada da Fúria",
      streamingService.id,
      movieGenre.id
    );

    const response = await server.get("/movies/genre/1000");

    expect(response.status).toEqual(404);
  });

  it("should respod with status 200 and with movies data", async () => {
    const streamingService = await createStreamingService();
    const movieGenre = await createMovieGenre();
    const movie = await createMovie(
      "Mad Max: Estrada da Fúria",
      streamingService.id,
      movieGenre.id
    );

    const response = await server.get(`/movies/genre/${movie.genre_id}`);

    expect(response.status).toEqual(200);
    expect(response.body).toEqual([
      {
        id: movie.id,
        name: movie.name,
        streaming_services: {
          name: streamingService.name,
        },
        movie_genres: {
          name: movieGenre.name,
        },
        watched: movie.watched,
        date_watched: movie.date_watched,
        rating: movie.rating,
        created_at: expect.any(String),
      },
    ]);
  });
});
