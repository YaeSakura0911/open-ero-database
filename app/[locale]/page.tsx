import { useTranslations } from "next-intl";
import LocaleSwitcher from "@/components/locale-switcher";
import ThemeSwitcher from "@/components/theme-switcher";

export default function Home() {
    const t = useTranslations("HomePage");
    return (
        <div>
            <h1>{t("title")}</h1>
            <LocaleSwitcher />
            <ThemeSwitcher />
        </div>
    );
}
