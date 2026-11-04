# Design Craft

An interactive digital book that teaches the 23 Gang of Four design patterns through explanations, examples, and a programming game.

> **Status: Phase 1 — Foundation.** The design system, book-like layout shell, and landing page are in place. The Library content, the Workshop game, authentication, persistence, achievements, and GitHub README badges are not yet built.

## What it will be

- **The Library** — every GoF pattern explained as a chapter: problem, solution, trade-offs, UML-style diagram, and a practical TypeScript example.
- **The Workshop** — _Pattern Detective_, a game where you identify the pattern that solves each scenario.
- **Codex Identity** — XP, levels, achievements, public profiles, and verifiable SVG badges you can embed in a GitHub README.

Visual direction: vintage technical programming book — aged ivory paper, forest green, antique gold, serif headings, restrained typography.

## Stack

| Layer           | Choice                                  |
| --------------- | --------------------------------------- |
| Framework       | Next.js 16 (App Router, Turbopack)      |
| Language        | TypeScript (strict)                     |
| Styling         | Tailwind CSS 4 (CSS-first `@theme`)     |
| Components      | shadcn/ui (Base UI primitives)          |
| Package manager | pnpm (via Corepack)                     |
| Tests           | Vitest + Testing Library                |
| CI              | GitHub Actions                          |
| Deployment      | Vercel                                  |
| Database        | Neon Postgres + Drizzle ORM _(Phase 4)_ |
| Auth            | Auth.js + GitHub provider _(Phase 4)_   |

## Local development

Requires Node 20+ and Corepack.

```bash
corepack enable
pnpm install
pnpm dev
```
