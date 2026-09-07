import "dotenv/config";

import { PrismaPg } from "@prisma/adapter-pg";
import { PrismaClient } from "../src/generated/prisma/client.js";

const connectionString = process.env.DATABASE_URL;

if (!connectionString) {
  throw new Error("DATABASE_URL is not defined");
}

const adapter = new PrismaPg({ connectionString });
const prisma = new PrismaClient({ adapter });

async function main() {
    
    // Seedを2回実行しても同じユーザーが作成されないようにするためにupsertを使用する
    const user = await prisma.user.upsert({
        where: {
            email: "example@example.com"
        },
        update:{},
        create: {
            email: "example@example.com",
            passwordHash: "examplepasswordhash",
            emailVerifiedAt: new Date()
        },
    });
    console.log({ "Seed user created": user });
}
main()
  .catch((error) => {
    console.error(error);
    process.exitCode = 1;
  })
  .finally(async () => {
    await prisma.$disconnect();
  });