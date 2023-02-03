import prisma from "../../src/config/database";

export async function createStreamingService() {
  return await prisma.streaming_services.create({
    data: {
      name: "HBO Max",
    },
  });
}
