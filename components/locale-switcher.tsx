"use client";

import { useLocale } from "next-intl";
import { useRouter, usePathname } from "@/i18n/navigation";
import { routing } from "@/i18n/routing";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuRadioGroup,
    DropdownMenuRadioItem,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { LanguagesIcon } from "lucide-react";

type Locale = (typeof routing.locales)[number];

const localeNames: Record<string, string> = {
    en: "English",
    ja: "日本語",
    zh: "中文",
};

export default function LocaleSwitcher() {
    const locale = useLocale();
    const pathname = usePathname();
    const router = useRouter();

    return (
        <DropdownMenu>
            <DropdownMenuTrigger
                className={cn(buttonVariants({ variant: "link" }))}
            >
                <LanguagesIcon />
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
                <DropdownMenuRadioGroup
                    value={locale}
                    onValueChange={(next) => {
                        if (next === locale) return;
                        router.replace(pathname, { locale: next as Locale });
                    }}
                >
                    {routing.locales.map((l) => (
                        <DropdownMenuRadioItem key={l} value={l}>
                            {localeNames[l]}
                        </DropdownMenuRadioItem>
                    ))}
                </DropdownMenuRadioGroup>
            </DropdownMenuContent>
        </DropdownMenu>
    );
}
