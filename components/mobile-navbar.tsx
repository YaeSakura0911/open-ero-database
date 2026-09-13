"use client";

import {
    Sheet,
    SheetClose,
    SheetContent,
    SheetDescription,
    SheetFooter,
    SheetHeader,
    SheetTitle,
    SheetTrigger,
} from "@/components/ui/sheet";
import {
    NavigationMenu,
    NavigationMenuItem,
    NavigationMenuLink,
    NavigationMenuList,
    navigationMenuTriggerStyle,
} from "@/components/ui/navigation-menu";
import { MenuIcon } from "lucide-react";
import { Link } from "@/i18n/navigation";

export default function MobileNavbar() {
    return (
        <Sheet>
            <SheetTrigger>
                <MenuIcon />
            </SheetTrigger>
            <SheetContent side="left" className="p-6">
                <NavigationMenu className="flex w-full flex-col items-start justify-start">
                    <NavigationMenuList className="flex w-full flex-col items-start justify-start gap-2">
                        <NavigationMenuItem className="w-full">
                            <NavigationMenuLink
                                render={
                                    <Link
                                        href="/anime"
                                        className="w-full text-xl"
                                    />
                                }
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
            </SheetContent>
        </Sheet>
    );
}
