import { notFound } from "next/navigation";
import { getRequestConfig } from "next-intl/server";
import { hasLocale } from "next-intl";
import { routing } from "./routing";
import { headers } from "next/headers";

export default getRequestConfig(async () => {
    const requestHeaders = await headers();
    const locale =
        requestHeaders.get("x-next-intl-locale") ?? routing.defaultLocale;

    if (!hasLocale(routing.locales, locale)) {
        notFound();
    }

    return {
        locale,
        messages: (await import(`@/messages/${locale}.json`)).default,
    };
});
