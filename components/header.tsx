import Link from "next/link";
import {
    NavigationMenu,
    NavigationMenuItem,
    NavigationMenuLink,
    NavigationMenuList,
    navigationMenuTriggerStyle,
} from "@/components/ui/navigation-menu";

import { getTranslations } from "next-intl/server";
import LocaleSwitcher from "@/components/locale-switcher";
import ThemeSwitcher from "@/components/theme-switcher";
import UserAvatar from "./user-avatar";
import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import MobileNavbar from "./mobile-navbar";

export default async function Header() {
    const t = await getTranslations("AuthPage");
    const session = await auth.api.getSession({
        headers: await headers(),
    });

    return (
        <header className="h-16 w-full border-b">
            <div className="mx-auto flex h-full w-full max-w-360 items-center justify-between p-4">
                {/* 导航栏左侧 */}
                <div className="flex items-center gap-4 align-middle">
                    {/* TODO: 移动端菜单 */}
                    <MobileNavbar />
                    {/* Logo */}
                    <p className="text-xl font-bold">OEDB</p>
                    {/* 桌面端菜单 */}
                    <NavigationMenu className="hidden lg:flex">
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
                                >
                                    角色
                                </NavigationMenuLink>
                            </NavigationMenuItem>
                            <NavigationMenuItem>
                                <NavigationMenuLink
                                    render={<Link href="/person" />}
                                    className={navigationMenuTriggerStyle()}
                                >
                                    人员
                                </NavigationMenuLink>
                            </NavigationMenuItem>
                        </NavigationMenuList>
                    </NavigationMenu>
                </div>

                {/* 导航栏右侧 */}
                <div className="flex items-center gap-4">
                    <LocaleSwitcher />
                    <ThemeSwitcher />
                    <UserAvatar initialSession={session} />
                </div>
            </div>
        </header>
    );
}
