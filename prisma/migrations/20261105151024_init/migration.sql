-- CreateEnum
CREATE TYPE "visibility" AS ENUM ('public', 'private');

-- CreateTable
CREATE TABLE "users" (
    "id" TEXT NOT NULL,
    "name" TEXT,
    "email" TEXT,
    "email_verified" TIMESTAMPTZ(6),
    "image" TEXT,
    "github_username" TEXT,
    "github_id" TEXT,
    "created_at" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "users_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "accounts" (
    "user_id" TEXT NOT NULL,
    "type" TEXT NOT NULL,
    "provider" TEXT NOT NULL,
    "provider_account_id" TEXT NOT NULL,
    "refresh_token" TEXT,
    "access_token" TEXT,
    "expires_at" INTEGER,
    "token_type" TEXT,
    "scope" TEXT,
    "id_token" TEXT,
    "session_state" TEXT,

    CONSTRAINT "accounts_pkey" PRIMARY KEY ("provider","provider_account_id")
);

-- CreateTable
CREATE TABLE "sessions" (
    "session_token" TEXT NOT NULL,
    "user_id" TEXT NOT NULL,
    "expires" TIMESTAMPTZ(6) NOT NULL,

    CONSTRAINT "sessions_pkey" PRIMARY KEY ("session_token")
);

-- CreateTable
CREATE TABLE "verification_tokens" (
    "identifier" TEXT NOT NULL,
    "token" TEXT NOT NULL,
    "expires" TIMESTAMPTZ(6) NOT NULL,

    CONSTRAINT "verification_tokens_pkey" PRIMARY KEY ("identifier","token")
);

-- CreateTable
CREATE TABLE "challenge_attempts" (
    "id" UUID NOT NULL,
    "user_id" TEXT NOT NULL,
    "challenge_slug" TEXT NOT NULL,
    "first_attempted_at" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "last_attempted_at" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "correct_at" TIMESTAMPTZ(6),
    "attempts_count" INTEGER NOT NULL DEFAULT 0,

    CONSTRAINT "challenge_attempts_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "xp_transactions" (
    "id" UUID NOT NULL,
    "user_id" TEXT NOT NULL,
    "amount" INTEGER NOT NULL,
    "source" TEXT NOT NULL,
    "source_id" TEXT NOT NULL,
    "idempotency_key" TEXT NOT NULL,
    "created_at" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "xp_transactions_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "pattern_mastery" (
    "user_id" TEXT NOT NULL,
    "pattern_slug" TEXT NOT NULL,
    "attempts_count" INTEGER NOT NULL DEFAULT 0,
    "correct_count" INTEGER NOT NULL DEFAULT 0,
    "mastered_at" TIMESTAMPTZ(6),

    CONSTRAINT "pattern_mastery_pkey" PRIMARY KEY ("user_id","pattern_slug")
);

-- CreateTable
CREATE TABLE "earned_achievements" (
    "user_id" TEXT NOT NULL,
    "achievement_slug" TEXT NOT NULL,
    "earned_at" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "badge_theme" TEXT NOT NULL DEFAULT 'default',
    "badge_style" TEXT,

    CONSTRAINT "earned_achievements_pkey" PRIMARY KEY ("user_id","achievement_slug")
);

-- CreateTable
CREATE TABLE "profiles" (
    "user_id" TEXT NOT NULL,
    "display_name" TEXT,
    "bio" TEXT,
    "visibility" "visibility" NOT NULL DEFAULT 'public',
    "created_at" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "profiles_pkey" PRIMARY KEY ("user_id")
);

-- CreateIndex
CREATE UNIQUE INDEX "users_email_key" ON "users"("email");

-- CreateIndex
CREATE UNIQUE INDEX "users_github_username_key" ON "users"("github_username");

-- CreateIndex
CREATE UNIQUE INDEX "users_github_id_key" ON "users"("github_id");

-- CreateIndex
CREATE INDEX "accounts_user_id_idx" ON "accounts"("user_id");

-- CreateIndex
CREATE INDEX "sessions_user_id_idx" ON "sessions"("user_id");

-- CreateIndex
CREATE INDEX "challenge_attempts_user_idx" ON "challenge_attempts"("user_id");

-- CreateIndex
CREATE UNIQUE INDEX "challenge_attempts_user_id_challenge_slug_key" ON "challenge_attempts"("user_id", "challenge_slug");

-- CreateIndex
CREATE INDEX "xp_transactions_user_created_idx" ON "xp_transactions"("user_id", "created_at");

-- CreateIndex
CREATE UNIQUE INDEX "xp_transactions_user_id_idempotency_key_key" ON "xp_transactions"("user_id", "idempotency_key");

-- AddForeignKey
ALTER TABLE "accounts" ADD CONSTRAINT "accounts_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "sessions" ADD CONSTRAINT "sessions_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "challenge_attempts" ADD CONSTRAINT "challenge_attempts_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "xp_transactions" ADD CONSTRAINT "xp_transactions_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "pattern_mastery" ADD CONSTRAINT "pattern_mastery_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "earned_achievements" ADD CONSTRAINT "earned_achievements_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "profiles" ADD CONSTRAINT "profiles_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;
