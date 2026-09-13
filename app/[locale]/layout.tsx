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
            <main className="flex flex-1 justify-center">
                <div className="sm w-full max-w-360 p-4 sm:p-8">{children}</div>
            </main>
        </NextIntlClientProvider>
    );
}
