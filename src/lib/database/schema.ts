import {
  pgTable,
  text,
  timestamp,
  integer,
  uuid,
  uniqueIndex,
  index,
  primaryKey,
  pgEnum,
} from "drizzle-orm/pg-core";

// =========================================================================
// Auth.js tables
// =========================================================================

export const users = pgTable("users", {
  id: text("id").primaryKey(),
  name: text("name"),
  email: text("email").unique(),
  emailVerified: timestamp("email_verified", {
    withTimezone: true,
    mode: "date",
  }),
  image: text("image"),

  // Denormalized from accounts for /profile/:username and the badge route.
  githubUsername: text("github_username").unique(),
  githubId: text("github_id").unique(),

  createdAt: timestamp("created_at", { withTimezone: true, mode: "date" })
    .notNull()
    .defaultNow(),
  updatedAt: timestamp("updated_at", { withTimezone: true, mode: "date" })
    .notNull()
    .defaultNow(),
});

export const accounts = pgTable(
  "accounts",
  {
    userId: text("user_id")
      .notNull()
      .references(() => users.id, { onDelete: "cascade" }),
    type: text("type").notNull(),
    provider: text("provider").notNull(),
    providerAccountId: text("provider_account_id").notNull(),
    refreshToken: text("refresh_token"),
    accessToken: text("access_token"),
    expiresAt: integer("expires_at"),
    tokenType: text("token_type"),
    scope: text("scope"),
    idToken: text("id_token"),
    sessionState: text("session_state"),
  },
  (table) => [
    primaryKey({ columns: [table.provider, table.providerAccountId] }),
    index("accounts_user_id_idx").on(table.userId),
  ],
);

export const sessions = pgTable(
  "sessions",
  {
    sessionToken: text("session_token").primaryKey(),
    userId: text("user_id")
      .notNull()
      .references(() => users.id, { onDelete: "cascade" }),
    expires: timestamp("expires", {
      withTimezone: true,
      mode: "date",
    }).notNull(),
  },
  (table) => [index("sessions_user_id_idx").on(table.userId)],
);

export const verificationTokens = pgTable(
  "verification_tokens",
  {
    identifier: text("identifier").notNull(),
    token: text("token").notNull(),
    expires: timestamp("expires", {
      withTimezone: true,
      mode: "date",
    }).notNull(),
  },
  (table) => [primaryKey({ columns: [table.identifier, table.token] })],
);

// =========================================================================
// Domain tables
// =========================================================================

export const visibilityEnum = pgEnum("visibility", ["public", "private"]);

export const challengeAttempts = pgTable(
  "challenge_attempts",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    userId: text("user_id")
      .notNull()
      .references(() => users.id, { onDelete: "cascade" }),
    challengeSlug: text("challenge_slug").notNull(),

    firstAttemptedAt: timestamp("first_attempted_at", {
      withTimezone: true,
      mode: "date",
    })
      .notNull()
      .defaultNow(),
    lastAttemptedAt: timestamp("last_attempted_at", {
      withTimezone: true,
      mode: "date",
    })
      .notNull()
      .defaultNow(),

    // null until the user has answered correctly at least once.
    correctAt: timestamp("correct_at", { withTimezone: true, mode: "date" }),

    attemptsCount: integer("attempts_count").notNull().default(0),
  },
  (table) => [
    uniqueIndex("challenge_attempts_user_challenge_idx").on(
      table.userId,
      table.challengeSlug,
    ),
    index("challenge_attempts_user_idx").on(table.userId),
  ],
);

export const xpTransactions = pgTable(
  "xp_transactions",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    userId: text("user_id")
      .notNull()
      .references(() => users.id, { onDelete: "cascade" }),
    amount: integer("amount").notNull(),

    // 'challenge_correct_first' | 'challenge_correct_retry' | 'achievement' | …
    source: text("source").notNull(),
    // challenge slug or achievement slug, depending on source.
    sourceId: text("source_id").notNull(),

    // e.g. 'challenge:{slug}:correct_first' — prevents double rewards.
    idempotencyKey: text("idempotency_key").notNull(),

    createdAt: timestamp("created_at", { withTimezone: true, mode: "date" })
      .notNull()
      .defaultNow(),
  },
  (table) => [
    uniqueIndex("xp_transactions_idempotency_idx").on(
      table.userId,
      table.idempotencyKey,
    ),
    index("xp_transactions_user_created_idx").on(table.userId, table.createdAt),
  ],
);

export const patternMastery = pgTable(
  "pattern_mastery",
  {
    userId: text("user_id")
      .notNull()
      .references(() => users.id, { onDelete: "cascade" }),
    patternSlug: text("pattern_slug").notNull(),
    attemptsCount: integer("attempts_count").notNull().default(0),
    correctCount: integer("correct_count").notNull().default(0),
    masteredAt: timestamp("mastered_at", { withTimezone: true, mode: "date" }),
  },
  (table) => [primaryKey({ columns: [table.userId, table.patternSlug] })],
);

export const earnedAchievements = pgTable(
  "earned_achievements",
  {
    userId: text("user_id")
      .notNull()
      .references(() => users.id, { onDelete: "cascade" }),
    achievementSlug: text("achievement_slug").notNull(),
    earnedAt: timestamp("earned_at", { withTimezone: true, mode: "date" })
      .notNull()
      .defaultNow(),

    // Badge customization — presentation only, never affects verification.
    badgeTheme: text("badge_theme").notNull().default("default"),
    badgeStyle: text("badge_style"),
  },
  (table) => [primaryKey({ columns: [table.userId, table.achievementSlug] })],
);

export const profiles = pgTable("profiles", {
  userId: text("user_id")
    .primaryKey()
    .references(() => users.id, { onDelete: "cascade" }),
  displayName: text("display_name"),
  bio: text("bio"),
  visibility: visibilityEnum("visibility").notNull().default("public"),
  createdAt: timestamp("created_at", { withTimezone: true, mode: "date" })
    .notNull()
    .defaultNow(),
  updatedAt: timestamp("updated_at", { withTimezone: true, mode: "date" })
    .notNull()
    .defaultNow(),
});

// =========================================================================
// Type exports
// =========================================================================

export type User = typeof users.$inferSelect;
export type NewUser = typeof users.$inferInsert;
export type ChallengeAttempt = typeof challengeAttempts.$inferSelect;
export type XpTransaction = typeof xpTransactions.$inferSelect;
export type EarnedAchievement = typeof earnedAchievements.$inferSelect;
export type PatternMasteryRow = typeof patternMastery.$inferSelect;
export type Profile = typeof profiles.$inferSelect;
