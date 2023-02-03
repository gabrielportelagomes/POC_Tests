import prisma from "../../src/config/database";

export async function createMovieGenre() {
  return await prisma.movie_genres.create({
    data: {
      name: "Ação",
    },
  });
}
