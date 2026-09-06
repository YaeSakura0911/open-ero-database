import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardContent, CardTitle } from "@/components/ui/card";
import {
    Field,
    FieldDescription,
    FieldError,
    FieldGroup,
    FieldLabel,
    FieldSeparator,
    FieldSet,
} from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import Link from "next/link";
import { useTranslations } from "next-intl";
import Image from "next/image";

export default function SignInPage() {
    const t = useTranslations("AuthPage");
    return (
        <div className="flex w-full items-center justify-center">
            <Card className="w-full max-w-sm">
                <CardHeader>
                    <CardTitle className="text-xl font-semibold">
                        {t("sign_in")}
                    </CardTitle>
                </CardHeader>
                <CardContent>
                    <FieldSet>
                        <FieldGroup>
                            <Field>
                                <FieldLabel htmlFor="email">
                                    {t("email")}
                                </FieldLabel>
                                <Input name="email" type="email" required />
                            </Field>
                            <Field>
                                <FieldLabel htmlFor="password">
                                    {t("password")}
                                </FieldLabel>
                                <Input
                                    name="password"
                                    type="password"
                                    required
                                />
                            </Field>
                            <Field>
                                <Button>{t("sign_in")}</Button>
                            </Field>
                            <FieldSeparator>{t("or")}</FieldSeparator>
                            <div className="flex flex-col gap-3">
                                <Button variant="outline">
                                    <Image
                                        src="/github.svg"
                                        alt="Github Logo"
                                        width={16}
                                        height={16}
                                    />
                                    {t("social.github")}
                                </Button>
                                <Button variant="outline">
                                    <Image
                                        src="/google.svg"
                                        alt="Google Logo"
                                        width={16}
                                        height={16}
                                    />
                                    {t("social.google")}
                                </Button>
                            </div>
                            <div className="flex flex-col items-center gap-3">
                                <Link href="#" className="hover:underline">
                                    {t("forgot_password")}
                                </Link>
                                <FieldDescription>
                                    {t("need_to_create_an_account")}
                                    <Link
                                        href="/auth/sign-up"
                                        className="underline"
                                    >
                                        {t("sign_up")}
                                    </Link>
                                </FieldDescription>
                            </div>
                        </FieldGroup>
                    </FieldSet>
                </CardContent>
            </Card>
        </div>
    );
}
