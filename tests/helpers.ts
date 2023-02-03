import prisma from "../src/config/database";

export async function cleanDb() {
  await prisma.movie_genres.deleteMany({});
  await prisma.streaming_services.deleteMany({});
  await prisma.movies.deleteMany({});
}
