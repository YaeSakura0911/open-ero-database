"use client";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button, buttonVariants } from "@/components/ui/button";
import { BellIcon, LogOutIcon, SettingsIcon, UserIcon } from "lucide-react";
import { authClient } from "@/lib/auth-client";
import { useTranslations } from "next-intl";
import { useRouter, Link } from "@/i18n/navigation";
import { cn } from "cn";
import { Badge } from "@/components/ui/badge";

export default function UserAvatar({
    initialSession,
}: {
    initialSession: typeof authClient.$Infer.Session | null;
}) {
    authClient.hydrateSession(initialSession);
    const { data, isPending, isRefetching } = authClient.useSession();
    const session = isPending && !isRefetching ? initialSession : data;

    const t = useTranslations("AuthPage");
    const router = useRouter();

    return (
        <>
            {session ? (
                <>
                    {/* 登录后 */}
                    <DropdownMenu>
                        <DropdownMenuTrigger
                            render={
                                <Button
                                    variant="ghost"
                                    size="icon"
                                    className="rounded-full"
                                >
                                    <Avatar>
                                        <AvatarImage
                                            src="https://github.com/shadcn.png"
                                            alt="shadcn"
                                        />
                                        <AvatarFallback>LR</AvatarFallback>
                                    </Avatar>
                                </Button>
                            }
                        />
                        <DropdownMenuContent>
                            <DropdownMenuItem>
                                <UserIcon />
                                Profile
                            </DropdownMenuItem>
                            <DropdownMenuItem>
                                <BellIcon />
                                Notification
                                <Badge variant="secondary">10</Badge>
                            </DropdownMenuItem>
                            <DropdownMenuItem>
                                <SettingsIcon />
                                Setting
                            </DropdownMenuItem>
                            <DropdownMenuSeparator />
                            <DropdownMenuItem
                                onClick={async () => {
                                    await authClient.signOut({
                                        fetchOptions: {
                                            onSuccess: () => {
                                                router.push("/");
                                            },
                                        },
                                    });
                                }}
                            >
                                <LogOutIcon />
                                Sign Out
                            </DropdownMenuItem>
                        </DropdownMenuContent>
                    </DropdownMenu>
                </>
            ) : (
                <>
                    {/* 登录前 */}
                    {/* TODO: 手机端登录 */}
                    <Link
                        href="/auth/sign-in"
                        className={cn(buttonVariants(), "lg:hidden")}
                    >
                        {t("sign_in")}
                    </Link>
                    {/* 桌面端登录 */}
                    <Link
                        href="/auth/sign-in"
                        className={cn(
                            buttonVariants({ variant: "outline" }),
                            "hidden hover:cursor-pointer lg:inline-flex",
                        )}
                    >
                        {t("sign_in")}
                    </Link>
                    <Link
                        href="/auth/sign-up"
                        className={cn(
                            buttonVariants(),
                            "hidden hover:cursor-pointer lg:inline-flex",
                        )}
                    >
                        {t("sign_up")}
                    </Link>
                </>
            )}
        </>
    );
}
