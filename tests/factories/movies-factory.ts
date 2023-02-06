import prisma from "../../src/config/database";

export async function createMovie(
  name: string,
  streaming_service_id: number,
  genre_id: number
) {
  return await prisma.movies.create({
    data: {
      name,
      streaming_service_id,
      genre_id,
    },
  });
}
