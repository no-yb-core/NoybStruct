# Noyb Struct

> A field guide to software design patterns — learn by solving challenges.

[![CI](https://github.com/no-yb-core/NoybStruct/actions/workflows/ci.yml/badge.svg)](https://github.com/no-yb-core/NoybStruct/actions/workflows/ci.yml)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](./LICENSE)

**Live:** [noyb-struct.vercel.app](https://struct.noybcore.com/)

## Features

- **18 software design patterns** documented with interactive UML diagrams.
- **Workshop mode** — solve challenges by selecting the appropriate design pattern and receive instant feedback.
- **XP and progression** — earn experience, advance through levels from Apprentice to Pattern Master, and unlock achievements. Progress is persisted per user.
- **Pattern mastery tracking** — monitor accuracy for each pattern and earn a mastered badge.
- **Installable PWA** — supports iOS Add to Home Screen and the Chrome installation prompt.

## How it works

1. **Explore** — learn about 18 design patterns through explanations and interactive UML diagrams.
2. **Practice** — enter Workshop mode, solve challenges, and receive instant feedback on your choices.
3. **Progress** — earn XP, advance through levels, unlock achievements, and track mastery for each pattern.

## Tech stack

| Layer          | Choice                                                                 |
| -------------- | ---------------------------------------------------------------------- |
| Framework      | Next.js 16 (App Router, Turbopack, Cache Components)                   |
| Language       | TypeScript                                                             |
| Database       | Prisma 7, `@prisma/adapter-pg`, Prisma Postgres                        |
| Authentication | Auth.js v5, GitHub OAuth, database sessions via `@auth/prisma-adapter` |
| Styling        | Tailwind CSS v4, shadcn/ui                                             |
| Testing        | Vitest, jsdom, PostgreSQL integration tests                            |
| Deployment     | Vercel via Git integration                                             |

## Local development

Prerequisites: Node.js, pnpm, Git, and a configured Prisma Postgres database.

```bash
git clone https://github.com/no-yb-core/NoybStruct.git
cd NoybStruct

pnpm install

cp .env.example .env
# Configure the environment variables in .env

pnpm db:migrate
pnpm dev
```

## Environment variables

| Variable               | Purpose                                                                        |
| ---------------------- | ------------------------------------------------------------------------------ |
| `DATABASE_URL`         | Prisma Postgres pooled connection URL. Must end with `?sslmode=verify-full`.   |
| `AUTH_SECRET`          | Auth.js secret. Generate a 32-byte hex value using `openssl rand -hex 32`.     |
| `AUTH_GITHUB_ID`       | GitHub OAuth App client ID.                                                    |
| `AUTH_GITHUB_SECRET`   | GitHub OAuth App client secret.                                                |
| `NEXT_PUBLIC_SITE_URL` | Canonical site URL, used for the OAuth callback and Open Graph image metadata. |

Configure the following callback URLs in your GitHub OAuth App:

- Local: `http://localhost:3000/api/auth/callback/github`
- Production: `https://noyb-struct.vercel.app/api/auth/callback/github`

## Scripts

| Script                  | What it does                                      |
| ----------------------- | ------------------------------------------------- |
| `pnpm dev`              | Start the development server.                     |
| `pnpm build`            | Generate Prisma Client and build the application. |
| `pnpm lint`             | Run ESLint.                                       |
| `pnpm typecheck`        | Run TypeScript type checking.                     |
| `pnpm test`             | Run unit tests.                                   |
| `pnpm test:integration` | Run PostgreSQL integration tests.                 |
| `pnpm db:migrate`       | Apply development database migrations.            |
| `pnpm db:deploy`        | Deploy pending migrations.                        |
| `pnpm db:studio`        | Open Prisma Studio.                               |
| `pnpm db:reset`         | Reset the development database.                   |
| `pnpm db:deploy:test`   | Deploy migrations to the test database.           |

## Testing

- **Unit:** 47 Vitest tests running in jsdom.
- **Integration:** 22 tests against a real PostgreSQL database.

Set up the test database before running integration tests:

```bash
# Configure a separate test database URL in your test environment.
pnpm db:deploy:test
pnpm test:integration
```

## Deployment

The application is deployed on Vercel through Git integration. Each deployment uses the configured Vercel build command to generate Prisma Client, apply pending production migrations, and build the Next.js application.

The `vercel-build` pipeline is:

```text
prisma generate
    &&
prisma migrate deploy
    &&
next build
```

## License

[MIT](./LICENSE) — Copyright 2026 Yassine Bouali.
