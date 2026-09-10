import Link from "next/link";
import {
    NavigationMenu,
    NavigationMenuContent,
    NavigationMenuItem,
    NavigationMenuLink,
    NavigationMenuList,
    navigationMenuTriggerStyle,
} from "@/components/ui/navigation-menu";
import { Button } from "@/components/ui/button";
import { useTranslations } from "next-intl";
import LocaleSwitcher from "@/components/locale-switcher";
import ThemeSwitcher from "@/components/theme-switcher";

export default function Header() {
    const t = useTranslations("AuthPage");
    return (
        <div className="flex h-16 w-full items-center justify-between px-8 shadow-md">
            {/* 左侧 */}
            <div className="flex items-center">
                {/* Logo */}
                <p>OpenEroDatabase</p>
                {/* 菜单 */}
                <div className="flex items-center">
                    <NavigationMenu>
                        <NavigationMenuList>
                            <NavigationMenuItem>
                                <NavigationMenuLink
                                    render={<Link href="/anime" />}
                                    className={navigationMenuTriggerStyle()}
                                >
                                    动画
                                </NavigationMenuLink>
                            </NavigationMenuItem>
                            <NavigationMenuItem>
                                <NavigationMenuLink
                                    render={<Link href="/character" />}
                                    className={navigationMenuTriggerStyle()}
                                >角色</NavigationMenuLink>
                            </NavigationMenuItem>
                            <NavigationMenuItem>
                                <NavigationMenuLink
                                    render={<Link href="/person" />}
                                    className={navigationMenuTriggerStyle()}
                                >人员</NavigationMenuLink>
                            </NavigationMenuItem>
                        </NavigationMenuList>
                    </NavigationMenu>
                </div>
            </div>

            {/* 右侧 */}
            <div className="flex gap-3">
                <LocaleSwitcher />
                <ThemeSwitcher />
                <Button variant="outline" className="hover: cursor-pointer">
                    {t("sign_in")}
                </Button>
                <Button className="hover: cursor-pointer">
                    {t("sign_up")}
                </Button>
            </div>
        </div>
    );
}
