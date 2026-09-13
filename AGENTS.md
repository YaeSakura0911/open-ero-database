# AGENTS.md

Next.js 16.3（App Router、React 19、React Compiler 通过 `next.config.ts` 开启）认证起始模板：better-auth（邮箱密码 + i18n 插件）+ Drizzle 连接远程 Postgres + next-intl 国际化。仓库曾基于 @better-auth-ui 构建，已迁移到手写页面（commit `509e15d 移除Better Auth UI`）——忽略任何残留的 @better-auth-ui 假设。顶层 `README.md` 是 create-next-app 样板；`app/layout.tsx` 的根 metadata 也仍是默认值（`"Create Next App"`）。`messages/` 和近期 commit 是中文开发。

## 硬约束（必须遵守）

- 不要使用 `any`、`@ts-ignore` 或类型断言绕过错误。
- 不要改 `components/ui/*`；新增 UI 用 `pnpm exec shadcn add <component>`，走 stock registry。
- 所有用户可见文案必须同时更新 `messages/{en,ja,zh}.json`（当前三者已不同步，见下文）。
- 导航优先用 `i18n/navigation.ts` 的包装器（`Link`/`redirect`/`usePathname`/`useRouter`/`getPathname`）。**注意 sign-in/sign-up 现状混用了 `next/link`**（见下文），不要照抄。
- Auth：不要加 `username()` 插件；不要写 server action 登录；用 `authClient.signIn.email` / `authClient.signUp.email`。
- DB：schema、`lib/db.ts`、`lib/auth.ts` 三处同步；用 relations-v2；生成迁移后先读 SQL。
- 不要提交 `.env` 或打印密钥。
- 保持文件现有缩进/分号风格；不要全局 `pnpm exec prettier --write components/ui`。
- 与代码冲突时以代码为准，并提醒我更新本文件。

## 命令与环境

- 使用 **pnpm**（锁定 `pnpm@11.25.0`）。仅有脚本：`dev`、`build`、`start`、`lint`。
- **`pnpm lint` 当前坏掉（已验证）**：`eslint.config.mjs:9` 展开了 `eslintConfigPrettier`（`eslint-config-prettier/flat` v10 导出的是普通配置对象）→ 崩溃 `eslintConfigPrettier is not iterable`。修法：把它作为普通数组元素（`eslintConfigPrettier,`）而不是 `...` 展开。
- 没有 `typecheck`/`db:*` 脚本。类型检查在 `next build` 里跑；`tsconfig.json` 开启 `strict: true`，`target ES2017`，`moduleResolution bundler`，路径别名 `@/* -> ./*`，include 了 `db/schema`。
- `.env` 被 gitignore 且**本地存在**（没有 `.env.example`）。代码用 `process.env.X!` 断言，所以 fresh clone 会崩：`DATABASE_URL`（`lib/db.ts` 和 `drizzle.config.ts` 都 `import "dotenv/config"` 读取）和 `BETTER_AUTH_URL`（绝对 URL，`lib/auth-client.ts`）是必需的。

## 路由与 i18n（next-intl）

- Locale 定义在 `i18n/routing.ts`：`["en","ja","zh"]`，**默认 `zh`**，`localePrefix` always → URL 形如 `/zh/...`、`/en/...`、`/ja/...`。
- `proxy.ts`（next-intl 中间件）用 `createMiddleware(routing)`；matcher 排除 `/api`、`/trpc`、`/_next`、`/_vercel`，以及任何含点的路径。
- `i18n/request.ts` 从 `x-next-intl-locale` 头（由中间件设置）解析 locale，回退到 `routing.defaultLocale`，未知 locale 走 `notFound()`，加载 `@/messages/${locale}.json`。
- `i18n/navigation.ts` 从 `createNavigation(routing)` 导出 `Link`、`redirect`、`usePathname`、`useRouter`、`getPathname`。
- `app/[locale]/layout.tsx` 用 `NextIntlClientProvider` 包裹 children（没有显式传 `locale`/`messages` —— next-intl v4 从 `i18n/request.ts` 自动注入），渲染来自 `@/components/header` 的 `<Header />`，并导出 `generateStaticParams()` 返回 `routing.locales.map((locale) => ({ locale }))`。根 `app/layout.tsx` 只负责 `<html lang>` + ThemeProvider + Toaster。
- `components/locale-switcher.tsx` 是正确 locale 导航的参考（`useLocale` + `useRouter().replace(pathname, { locale })`）。
- 文案在 `messages/{en,ja,zh}.json`（命名空间 `HomePage`、`AuthPage`）。**当前三者不同步**：
  - `zh.json` 有 `AuthPage.forgot`、`send_reset_link`、`remember_your_password`，以及一个**未被使用的** `AuthPage.errors` 命名空间（`invalid_email_or_password`、`invalid_email`、`generic`）。
  - `en.json` 有 `forgot`、`send_reset_link`、`remember_your_password`；**没有 `errors`**。
  - `ja.json` **四个都缺**（`forgot`、`send_reset_link`、`remember_your_password`、`errors`）。
  - 代码目前用 better-auth 的 `error.message`，没有用 `AuthPage.errors.*`。
- 页面：
  - `app/[locale]/page.tsx` —— 服务端组件，只有 `HomePage.title`。
  - `app/[locale]/auth/sign-in/page.tsx` —— 客户端组件，已实现。
  - `app/[locale]/auth/sign-up/page.tsx` —— 客户端组件，已实现。
  - `/auth/forgot-password` —— 被链接但**页面不存在**。
- **不一致点**：`sign-in/page.tsx` 和 `sign-up/page.tsx` 从 `next/link` 导入 `Link`（不是 `@/i18n/navigation`），却用 `@/i18n/navigation` 的 `useRouter`。它们的 href 是硬编码的（`/auth/sign-in`、`/auth/sign-up`、`/auth/forgot-password`），在 `localePrefix: "always"` 下依赖 `proxy.ts` 重定向而不是直接生成 locale 前缀。新代码优先用 `@/i18n/navigation` 的 `Link`。

## Auth 接线（非显而易见）

- 服务端单例 `lib/auth.ts`：`emailAndPassword` + `i18n()` + `nextCookies()`；DB 通过 `@better-auth/drizzle-adapter/relations-v2` 的 `drizzleAdapter`，provider `pg`，`advanced.database.joins: true`。
- `@better-auth/i18n` 配置：`defaultLocale: "zh"`，detection `["cookie","header"]`，`localeCookie: "NEXT_LOCALE"`，翻译来自 `locales.en/zh/ja`。
- **没有 `username()` 插件。** `user` 表没有 `username` 列。
- 用 `toNextJsHandler` 挂载在 `app/api/auth/[...all]/route.ts`（在 `[locale]` 外，被 i18n matcher 排除）。
- 客户端 `lib/auth-client.ts`：从 **`better-auth/react`** 导入 `createAuthClient`，只配 `baseURL: BETTER_AUTH_URL`，无插件。
- **登录和注册都是客户端**（`"use client"`），用 `@tanstack/react-form-nextjs` 的 `useForm` 和 `authClient.signIn.email` / `authClient.signUp.email`。
  - zod schema **内联在各 page.tsx**（`SignInSchema`、`SignUpSchema`），不共享，不在 `types/`。
  - validators 在 `onSubmit`、`onChange`、`onBlur` 三个时机都跑。
  - 错误通过 `@/components/ui/toast` 的 `toast.add({ type: "error", description: error.message })` 呈现（是 shadcn toast，不是 sonner）。
  - 成功用 `toast.add({ type: "success", ... })` 然后 `router.replace("/")`。
- zod 是 **v4**：`z.email("Invalid email address")`、`z.string("Password is null")` 把消息作为第一个参数。不要写 v3 风格的 `z.string({ message })`。
- sign-up 页已知 bug：
  - 成功 toast 写的是 `"登录成功"`，应该是注册成功。
  - social 按钮（`github` / `google`）是装饰性的（无 `onClick`）。
  - `/auth/forgot-password` 链接无目标页面。

## 数据库（前沿 API —— 不要猜）

- `drizzle-orm`/`drizzle-kit` 锁定 `1.0.0-rc.4`；与 better-auth 的 drizzle adapter（也是 rc 期）保持同步。`drizzle.config.ts`：schema `./db/schema`，output `./drizzle`，dialect `postgresql`，`dbCredentials.url = process.env.DATABASE_URL!`。
- Relations-v2 API：表（`user`、`session`、`account`、`verification`）加 `defineRelationsPart(...)` 导出 `authRelations`。加表时三处必须同步：schema 文件、`lib/db.ts`（`drizzle(url, { relations: { ...authRelations } })`）、以及 `lib/auth.ts` 里的 adapter import `@better-auth/drizzle-adapter/relations-v2` —— 不要用非 v2 adapter。
- schema 改动后工作流：`pnpm exec drizzle-kit generate`，**读生成的 SQL**，再 `pnpm exec drizzle-kit migrate`。
- 注意事项：`drizzle/` 目前只有 `20260905162819_cultured_vengeance/{migration.sql,snapshot.json}`，**没有 `drizzle/meta/` journal**，所以下一次 `generate` 会从头重建 bookkeeping。

## UI 约定

- Tailwind v4，CSS-first：`app/globals.css` 依次 `@import "tailwindcss"; @import "tw-animate-css"; @import "shadcn/tailwind.css";`，定义 `@custom-variant dark (&:is(.dark *))` 和一个 `@theme inline` 块把 `:root` / `.dark` 里的 oklch token 映射过去；`@/*` → 仓库根。
- **已知 CSS bug**：`@theme inline` 里 `--font-sans: var(--font-sans)` 是自引用；next/font 注入的是 `--font-geist-sans` 而非 `--font-sans`。`--font-heading: var(--font-sans)` 继承了这个问题。不要靠猜"修复"——先跟维护者确认。
- 主题用 next-themes（`app/layout.tsx` 里 `attribute="class"`、`defaultTheme="system"`、`enableSystem`、`disableTransitionOnChange`）；`<html suppressHydrationWarning>`。`components/theme-switcher.tsx` 硬编码 `"System"`/`"Dark"`/`"Light"` —— 还没 i18n。
- `components/ui/*` 是 stock **shadcn registry** 组件，style 为 **`base-maia`**（`components.json`），基于 **@base-ui/react** + lucide，`baseColor: neutral`，`iconLibrary: lucide`，`menuColor: default`，`menuAccent: subtle`，`rsc: true`，`tsx: true`。新增用 `pnpm exec shadcn add <component>`（stock registry；无自定义 `registries`）。
- `lib/utils.ts` 就是 `export { cn } from "cn"` —— 应用代码从 `@/lib/utils` 导入 `cn`；`components/ui/*` 直接从 `cn` 导入。
- 格式化分裂（有意为之，不要"顺手统一"）：应用代码（`app/`、`lib/`、`i18n/`、`types/`、较新组件）是 4 空格 + 分号；`components/ui/*` registry 文件仍是 2 空格/无分号。`.prettierignore` 只排除 `build` 和 `coverage`，所以对 `components/ui/` 跑 `pnpm exec prettier --write` 会产生巨大 diff —— 匹配文件现有风格。`.prettierrc`：`plugins: ["prettier-plugin-tailwindcss"]`、`tabWidth: 4`。
- 来自 `@/components/ui/toast` 的 `Toaster` 挂在根布局的 `ThemeProvider` 内。

## pnpm 坑

- pnpm 11 阻止依赖的 postinstall 脚本；新增原生依赖需要在 `pnpm-workspace.yaml` 里加 `allowBuilds` 条目。当前条目：`@parcel/watcher: true`、`@swc/core: true`、`esbuild: true`、`sharp: false`、`unrs-resolver: false`。

## 已知小问题（非阻塞）

- `app/[locale]/layout.tsx`：`className="sm w-full max-w-360 p-4 sm:p-8"` 里的 `sm` 是无效 class（缺 `sm:` 前缀），疑似笔误。
- `app/layout.tsx` metadata 仍是 create-next-app 默认值。
- `components/theme-switcher.tsx` 的 `"System"/"Dark"/"Light"` 硬编码英文。
- `messages/{en,ja,zh}.json` 三者不同步（详见上文）。
- sign-in/sign-up 混用 `next/link` 与 `@/i18n/navigation`。
- sign-up 成功 toast 文案是 `"登录成功"`。
- `/auth/forgot-password` 链接无对应页面。
- `app/globals.css` 的 `--font-sans: var(--font-sans)` 自引用。

## 验证清单

- 改完先跑 `pnpm lint`；若仍报 `eslintConfigPrettier is not iterable`，先修 `eslint.config.mjs`。
- 类型检查依赖 `pnpm build`；没有独立 `typecheck` 脚本。
- 涉及 DB：`pnpm exec drizzle-kit generate`，读生成的 SQL，再 `pnpm exec drizzle-kit migrate`。
- 涉及文案：确认 `messages/{en,ja,zh}.json` 三个文件都更新。
- 涉及 auth 页面：确认是 client component + `authClient.*`，不要引入 server action。
- 涉及导航：新代码用 `@/i18n/navigation` 的 `Link`/`useRouter`/`usePathname`，不要用 `next/link`。