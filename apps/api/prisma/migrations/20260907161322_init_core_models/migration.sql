-- CreateEnum
CREATE TYPE "UserRole" AS ENUM ('ADMIN', 'USER');

-- CreateEnum
CREATE TYPE "CareerProjectStatus" AS ENUM ('ACTIVE', 'COMPLETED');

-- CreateTable
CREATE TABLE "users" (
    "id" UUID NOT NULL,
    "email" VARCHAR(255) NOT NULL,
    "password_hash" VARCHAR(255) NOT NULL,
    "email_verified_at" TIMESTAMPTZ(3),
    "role" "UserRole" NOT NULL DEFAULT 'USER',
    "created_at" TIMESTAMPTZ(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMPTZ(3) NOT NULL,

    CONSTRAINT "users_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "profiles" (
    "id" UUID NOT NULL,
    "user_id" UUID NOT NULL,
    "family_name" VARCHAR(100) NOT NULL,
    "given_name" VARCHAR(100) NOT NULL,
    "family_name_romaji" VARCHAR(100) NOT NULL,
    "given_name_romaji" VARCHAR(100) NOT NULL,
    "birth_date" DATE NOT NULL,
    "gender" VARCHAR(50),
    "nationality" VARCHAR(100),
    "nearest_station" VARCHAR(255),
    "organization" VARCHAR(255),
    "position" VARCHAR(100),
    "education" TEXT,
    "self_pr" TEXT,
    "personality_description" TEXT,
    "learning_status" TEXT,
    "future_goal" TEXT,
    "created_at" TIMESTAMPTZ(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMPTZ(3) NOT NULL,

    CONSTRAINT "profiles_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "career_projects" (
    "id" UUID NOT NULL,
    "profile_id" UUID NOT NULL,
    "project_name" VARCHAR(255) NOT NULL,
    "client_name" VARCHAR(255),
    "status" "CareerProjectStatus" NOT NULL,
    "start_month" DATE NOT NULL,
    "end_month" DATE,
    "summary" TEXT,
    "details" TEXT,
    "team_size" INTEGER,
    "team_structure" TEXT,
    "commercial_flow" TEXT,
    "created_at" TIMESTAMPTZ(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMPTZ(3) NOT NULL,

    CONSTRAINT "career_projects_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "users_email_key" ON "users"("email");

-- CreateIndex
CREATE UNIQUE INDEX "profiles_user_id_key" ON "profiles"("user_id");

-- CreateIndex
CREATE INDEX "career_projects_profile_id_start_month_created_at_idx"
ON "career_projects"("profile_id", "start_month", "created_at");

-- AddForeignKey
ALTER TABLE "profiles" ADD CONSTRAINT "profiles_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "career_projects" ADD CONSTRAINT "career_projects_profile_id_fkey" FOREIGN KEY ("profile_id") REFERENCES "profiles"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddCheckConstraint
ALTER TABLE "career_projects"
ADD CONSTRAINT "career_projects_team_size_check"
CHECK ("team_size" IS NULL OR "team_size" >= 1);

-- AddCheckConstraint
ALTER TABLE "career_projects"
ADD CONSTRAINT "career_projects_period_check"
CHECK (
  "end_month" IS NULL
  OR "end_month" >= "start_month"
);

-- AddCheckConstraint
ALTER TABLE "career_projects"
ADD CONSTRAINT "career_projects_status_end_month_check"
CHECK (
  (
    "status" = 'ACTIVE'
    AND "end_month" IS NULL
  )
  OR
  (
    "status" = 'COMPLETED'
    AND "end_month" IS NOT NULL
  )
);


-- AddCheckConstraint
ALTER TABLE "career_projects"
ADD CONSTRAINT "career_projects_month_first_day_check"
CHECK (
  EXTRACT(DAY FROM "start_month") = 1
  AND (
    "end_month" IS NULL
    OR EXTRACT(DAY FROM "end_month") = 1
  )
);