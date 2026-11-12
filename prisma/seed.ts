import { PrismaPg } from "@prisma/adapter-pg";
import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";

const databaseUrl = process.env.DATABASE_URL;
if (!databaseUrl) throw new Error("DATABASE_URL is required");

const prisma = new PrismaClient({
  adapter: new PrismaPg({ connectionString: databaseUrl }),
});

async function main() {
  const passwordHash = await bcrypt.hash("onyxify-dev-password", 12);
  const user = await prisma.user.upsert({
    where: { email: "listener@onyxify.local" },
    update: { passwordHash, name: "Onyxify Listener" },
    create: {
      email: "listener@onyxify.local",
      name: "Onyxify Listener",
      passwordHash,
    },
  });

  await prisma.playlist.upsert({
    where: { id: "onyxify-demo-playlist" },
    update: {},
    create: {
      id: "onyxify-demo-playlist",
      ownerId: user.id,
      name: "Fokus Pagi",
      description: "Playlist dev untuk mencoba koleksi Onyxify.",
      isPublic: false,
    },
  });
}

main()
  .then(async () => prisma.$disconnect())
  .catch(async (error) => {
    console.error(error);
    await prisma.$disconnect();
    process.exit(1);
  });
