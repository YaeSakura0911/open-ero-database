"use client";

import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuRadioGroup,
    DropdownMenuRadioItem,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { useTheme } from "next-themes";
import { MonitorIcon, MoonIcon, SunIcon, SunMoonIcon } from "lucide-react";

export default function ThemeSwitcher() {
    const { theme, setTheme } = useTheme();

    return (
        <DropdownMenu>
            <DropdownMenuTrigger
                className={cn(
                    buttonVariants({ variant: "link" }),
                    "hover:cursor-pointer",
                )}
            >
                <SunMoonIcon />
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
                <DropdownMenuRadioGroup
                    value={theme}
                    onValueChange={(value) => {
                        console.log(value);
                        setTheme(value);
                    }}
                >
                    <DropdownMenuRadioItem value="system">
                        <MonitorIcon />
                        System
                    </DropdownMenuRadioItem>
                    <DropdownMenuRadioItem value="dark">
                        <MoonIcon />
                        Dark
                    </DropdownMenuRadioItem>
                    <DropdownMenuRadioItem value="light">
                        <SunIcon />
                        Light
                    </DropdownMenuRadioItem>
                </DropdownMenuRadioGroup>
            </DropdownMenuContent>
        </DropdownMenu>
    );
}
