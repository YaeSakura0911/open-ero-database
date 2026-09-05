# AGENTS.md

Next.js 16 (App Router, React 19, React Compiler enabled) auth starter built on better-auth + @better-auth-ui, Drizzle (Postgres, rc), Tailwind v4. The top-level `README.md` is unhelpful create-next-app boilerplate.

## Commands

- Use **pnpm** (pinned `pnpm@11.25.0`). Only scripts in `package.json` are `dev`, `build`, `start`, `lint`.
- **`pnpm lint` is currently broken**: `eslint.config.mjs` spreads `eslint-config-prettier/flat`, which in v10.1.8 exports a plain config object → crashes with `eslintConfigPrettier is not iterable`. Fix: pass it as an array element instead of spreading.
- No `typecheck` or `db:*` scripts exist. Type checking runs inside `next build`. DB commands run via `pnpm exec drizzle-kit generate|migrate`.
- Format with `pnpm exec prettier --write <file>` (tabWidth 4, prettier-plugin-tailwindcss sorts classes). Several new files (`lib/auth/*`, `components/auth/*`, `components/ui/*`) are still 2-space/unformatted — run prettier after touching them.

## Auth wiring (non-obvious)

- Server better-auth instance: `lib/auth.ts`, mounted at `app/_api/auth/[...all]/route.ts`. Client: `lib/auth-client.ts` (reads `BETTER_AUTH_URL`, must be an absolute URL). Env lives in local `.env` (gitignored, already present); `lib/db.ts` and `drizzle.config.ts` each `import "dotenv/config"` themselves.
- Server instance registers only `username()` + email/password. Social providers, theme plugin, delete-user plugin, session settings are client-side only (via `AuthProvider` in `components/providers.tsx`).
- UI is routed through dynamic pages `app/auth/[path]/page.tsx` and `app/settings/[path]/page.tsx`, which **whitelist** paths from `@better-auth-ui/core` `viewPaths` plus plugin `viewPaths` (magic-link, organization). Adding a new view requires adding its path to that `Set` or it 404s. Settings pages are server-rendered with an `ensureSessionServer` guard that redirects to `/auth/sign-in?redirectTo=...`.

## Database (bleeding-edge API — don't guess)

- `drizzle-orm`/`drizzle-kit` pinned to `1.0.0-rc.4`; keep in sync with the better-auth drizzle adapter (also rc-era). Schema dir `db/schema/` (configured in `drizzle.config.ts`, output `drizzle/`).
- Schema uses the new relations-v2 API: tables plus `defineRelationsPart(...)` exporting `authRelations`. Three places must stay in sync when adding tables: the schema file, `lib/db.ts` (`relations: { ...authRelations }`), and the adapter import path `@better-auth/drizzle-adapter/relations-v2` in `lib/auth.ts` — do not use the non-v2 adapter.
- DB is a remote dev Postgres from `DATABASE_URL` in `.env`. After schema edits: `pnpm exec drizzle-kit generate`, then `pnpm exec drizzle-kit migrate` (applies to the remote db). One migration already applied: `drizzle/20260905162819_cultured_vengeance`.

## UI conventions

- Tailwind v4, CSS-first (no config file; theme tokens in `app/globals.css`). Alias `@/*` → repo root.
- `components/ui/*` are shadcn-style but come from the **better-auth-ui** registry (`components.json`, style `base-nova`), not stock shadcn. To add components use the shadcn CLI (`pnpm exec shadcn add ...` resolves via the configured `registries`); don't hand-mix stock-shadcn registry output.

## pnpm gotchas

- pnpm 11 blocks dependency postinstall scripts; any new native dep must get an `allowBuilds` entry in `pnpm-workspace.yaml` (`sharp` is deliberately `false`).
