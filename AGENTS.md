# AGENTS.md

Next.js 16.3 (App Router, React 19, React Compiler on via `next.config.ts`) auth starter: better-auth (email/password + `username()` plugin) + Drizzle on remote Postgres + next-intl i18n. The repo used to be built on @better-auth-ui and was migrated to hand-rolled pages (commit `509e15d 移除Better Auth UI`) — ignore any leftover @better-auth-ui assumptions. Top-level `README.md` is create-next-app boilerplate. `messages/` and recent commits are Chinese-language dev.

## Commands & env

- Use **pnpm** (pinned `pnpm@11.25.0`). Only scripts: `dev`, `build`, `start`, `lint`.
- **`pnpm lint` is broken (verified)**: `eslint.config.mjs:9` spreads `eslintConfigPrettier` (`eslint-config-prettier/flat` v10 exports a plain config object) → crash `eslintConfigPrettier is not iterable`. Fix: pass it as a plain array element (`eslintConfigPrettier,`) instead of `...`-spreading.
- No `typecheck`/`db:*` scripts. Type checking runs inside `next build`.
- `.env` is gitignored and **currently absent** (no `.env.example`). Code asserts with `process.env.X!`, so a fresh clone crashes: `DATABASE_URL` (read by `lib/db.ts` + `drizzle.config.ts`, both `import "dotenv/config"`) and `BETTER_AUTH_URL` (absolute URL, `lib/auth-client.ts`) are required.

## Routing & i18n (next-intl)

- All user-facing pages live under `app/[locale]/` (`en|ja|zh`, **default `zh`**, `localePrefix` always → URLs are `/zh/...`). `proxy.ts` (next-intl middleware) sets the locale and excludes `/api` in its matcher.
- `app/layout.tsx` (html/body/ThemeProvider) resolves the locale from the `x-next-intl-locale` header set by middleware; `i18n/request.ts` `notFound()`s on unknown locales.
- Components must navigate with the locale-aware wrappers from `i18n/navigation.ts` (`Link`, `useRouter`, `usePathname`) — see `components/locale-switcher.tsx`.
- Copy lives in `messages/{en,ja,zh}.json` (namespaces `HomePage`, `AuthPage`), kept in sync by hand across all three files.
- Current pages: `[locale]/` (home + locale/theme switchers), `[locale]/auth/sign-in` (implemented), `[locale]/auth/sign-up` (**static shell only** — no action; social/forgot buttons are decorative everywhere).

## Auth wiring (non-obvious)

- Server singleton `lib/auth.ts`: `emailAndPassword` + `username()` plugin + `nextCookies()`; DB via `drizzleAdapter` from `@better-auth/drizzle-adapter/relations-v2`. Mounted with `toNextJsHandler` at `app/api/auth/[...all]/route.ts` (NOT `app/_api/...`; outside `[locale]`).
- Client `lib/auth-client.ts` is `createAuthClient` with `baseURL: BETTER_AUTH_URL` only — no plugins, and no component calls it. **Sign-in is a server action**, not a client auth call: `app/[locale]/auth/sign-in/action.ts` calls `auth.api.signInEmail`, with TanStack React Form server validation (`createServerValidate` + shared `formOptions`/zod schemas in `types/sign-in-schema.ts`); the page pairs `useActionState(SignInAction, initialFormState)` with `useForm` from `@tanstack/react-form-nextjs`. Keep the zod schema, `formOptions`, and action in sync — validation runs on both sides. better-auth errors surface via `isAPIError` from `better-auth/api`.
- **Known divergence**: `username()` is registered in `lib/auth.ts`, but the `user` table in `db/schema/auth-schema.ts` (and the applied migration) has **no `username` column**. Only `signInEmail` works; anything touching username fails until you add the column (schema + migration) or drop the plugin.

## Database (bleeding-edge API — don't guess)

- `drizzle-orm`/`drizzle-kit` pinned to `1.0.0-rc.4`; keep in sync with the better-auth drizzle adapter (also rc-era). `drizzle.config.ts` (rc4 `defineConfig`): schema `./db/schema`, output `./drizzle`.
- Relations-v2 API: tables plus `defineRelationsPart(...)` exporting `authRelations`. Three places must stay in sync when adding tables: the schema file, `lib/db.ts` (`drizzle(url, { relations: { ...authRelations } })`), and the adapter import `@better-auth/drizzle-adapter/relations-v2` in `lib/auth.ts` — do not use the non-v2 adapter.
- DB is a remote dev Postgres (`DATABASE_URL`). Workflow after schema edits: `pnpm exec drizzle-kit generate`, then `pnpm exec drizzle-kit migrate`.
- Caveat: the `drizzle/` folder has only `20260905162819_cultured_vengeance/` — **no `drizzle/meta/` journal exists**, so the next `generate` rebuilds bookkeeping from scratch; read the generated SQL before migrating.

## UI conventions

- Tailwind v4, CSS-first: `app/globals.css` imports `tailwindcss`, `tw-animate-css`, and `shadcn/tailwind.css`; oklch tokens in `:root`/`.dark`; `@/*` → repo root. Theme via next-themes (`attribute="class"` provider in root layout; `components/theme-switcher.tsx`).
- `components/ui/*` are stock **shadcn registry** components, style **`base-nova`** (`components.json`), built on **@base-ui/react** + lucide. Add more with `pnpm exec shadcn add <component>` (stock registry; components.json has no custom `registries`); don't hand-mix other shadcn styles.
- Formatting split (deliberate, don't "fix" wholesale): app code (`app/`, `lib/`, `i18n/`, `types/`, newer components) is 4-space + semicolons; `components/ui/*` registry files are still 2-space/no-semicolons and import `cn` from the `cn` package, while app code re-exports it via `@/lib/utils`. `.prettierignore` doesn't exclude `components/ui/`, so `pnpm exec prettier --write` there produces huge diffs — match the file's existing style instead. `.prettierrc`: tabWidth 4 + prettier-plugin-tailwindcss.

## pnpm gotchas

- pnpm 11 blocks dependency postinstall scripts; new native deps need an `allowBuilds` entry in `pnpm-workspace.yaml` (`sharp` and `unrs-resolver` are deliberately `false`).
