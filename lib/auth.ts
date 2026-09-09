import { betterAuth } from "better-auth";
import { username } from "better-auth/plugins";
import { drizzleAdapter } from "@better-auth/drizzle-adapter/relations-v2";
import { db } from "@/lib/db";
import { i18n, locales } from "@better-auth/i18n";
import { nextCookies } from "better-auth/next-js";

export const auth = betterAuth({
    database: drizzleAdapter(db, {
        provider: "pg",
    }),
    advanced: {
        database: {
            joins: true,
        },
    },
    emailAndPassword: {
        enabled: true,
    },
    plugins: [
        username(),
        i18n({
            translations: {
                en: locales.en,
                zh: locales.zh,
                ja: locales.ja,
            },
            defaultLocale: "zh",
            detection: ["cookie", "header"],
            localeCookie: "NEXT_LOCALE"
        }),
        nextCookies(),
    ],
});
