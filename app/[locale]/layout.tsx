import { NextIntlClientProvider } from "next-intl";
import { routing } from "@/i18n/routing";
import Header from "@/components/header";

export function generateStaticParams() {
    return routing.locales.map((locale) => ({ locale }));
}

export default function LocaleLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return (
        <NextIntlClientProvider>
            <Header />
            {children}
        </NextIntlClientProvider>
    );
}
