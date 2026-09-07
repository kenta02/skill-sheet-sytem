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


   // Seedを複数回実行しても同じプロフィールが作成されないようにする
const profile = await prisma.profile.upsert({
  where: {
    userId: user.id,
  },
  update: {},
  create: {
    userId: user.id,
    familyName: "Example",
    givenName: "User",
    familyNameRomaji: "Example",
    givenNameRomaji: "User",
    birthDate: new Date("1990-01-01T00:00:00.000Z"),
  },
});

console.log({ "Seed profile created": profile });

const existingProject = await prisma.careerProject.findFirst({
  where: {
    profileId: profile.id,
    projectName: "公営競技向け業務システム刷新",
    startMonth: new Date("2026-04-01T00:00:00.000Z"),
  },
});

if (!existingProject) {
  const project = await prisma.careerProject.create({
    data: {
      profileId: profile.id,
      projectName: "公営競技向け業務システム刷新",
      clientName: "サンプル顧客",
      status: "COMPLETED",
      startMonth: new Date("2026-04-01T00:00:00.000Z"),
      endMonth: new Date("2026-09-01T00:00:00.000Z"),
      summary: "公営競技向け業務システムのマイグレーション開発",
      details: "React・TypeScriptを中心とした画面開発および一部バックエンド開発を担当。",
      teamSize: 8,
      teamStructure: "リーダー1名、サブリーダー1名、PG6名",
      commercialFlow: "エンド → 元請 → 2次請 → 自社",
    },
  });

  console.log({ "Seed project created": project });
}


}
main()
  .catch((error) => {
    console.error(error);
    process.exitCode = 1;
  })
  .finally(async () => {
    await prisma.$disconnect();
  });