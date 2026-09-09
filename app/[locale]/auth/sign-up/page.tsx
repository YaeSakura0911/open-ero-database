"use client";

import Link from "next/link";
import Image from "next/image";
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
import { toast } from "@/components/ui/toast";
import { z } from "zod";
import { useTranslations } from "next-intl";
import { useForm } from "@tanstack/react-form-nextjs";
import { useRouter } from "@/i18n/navigation";
import { authClient } from "@/lib/auth-client";

const SignUpSchema = z.object({
    name: z.string().min(1, "This field is required"),
    email: z.email(),
    password: z.string().min(8, "Must be at least 8 characters"),
});

export default function SignUpPage() {
    const t = useTranslations("AuthPage");
    const router = useRouter();
    const form = useForm({
        defaultValues: {
            name: "",
            email: "",
            password: "",
        },
        validators: {
            onSubmit: SignUpSchema,
            onChange: SignUpSchema,
            onBlur: SignUpSchema,
        },
        onSubmit: async ({ value }) => {
            // Better Auth 注册
            const { error } = await authClient.signUp.email({
                name: value.name,
                email: value.email,
                password: value.password,
            });

            // 注册失败
            if (error) {
                toast.add({ type: "error", description: error.message });
                return;
            }

            // 注册成功
            toast.add({ type: "success", description: "登录成功" });
            router.replace("/");
        },
    });
    return (
        <div className="flex w-full items-center justify-center">
            <Card className="w-full max-w-sm">
                <CardHeader>
                    <CardTitle className="text-xl font-semibold">
                        {t("sign_up")}
                    </CardTitle>
                </CardHeader>
                <CardContent>
                    <form
                        onSubmit={(e) => {
                            e.preventDefault();
                            form.handleSubmit();
                        }}
                    >
                        <FieldSet>
                            <FieldGroup>
                                {/* 姓名输入框 */}
                                <form.Field name="name">
                                    {(field) => {
                                        const isInvalid =
                                            field.state.meta.isTouched &&
                                            !field.state.meta.isValid;
                                        return (
                                            <Field data-invalid={isInvalid}>
                                                <FieldLabel
                                                    htmlFor={field.name}
                                                >
                                                    {t("name")}
                                                </FieldLabel>
                                                <Input
                                                    id={field.name}
                                                    name={field.name}
                                                    value={field.state.value}
                                                    onBlur={field.handleBlur}
                                                    onChange={(e) =>
                                                        field.handleChange(
                                                            e.target.value,
                                                        )
                                                    }
                                                    aria-invalid={isInvalid}
                                                    required
                                                />
                                                {isInvalid && (
                                                    <FieldError
                                                        errors={
                                                            field.state.meta
                                                                .errors
                                                        }
                                                    />
                                                )}
                                            </Field>
                                        );
                                    }}
                                </form.Field>

                                {/* 邮箱输入框 */}
                                <form.Field name="email">
                                    {(field) => {
                                        const isInvalid =
                                            field.state.meta.isTouched &&
                                            !field.state.meta.isValid;
                                        return (
                                            <Field data-invalid={isInvalid}>
                                                <FieldLabel
                                                    htmlFor={field.name}
                                                >
                                                    {t("email")}
                                                </FieldLabel>
                                                <Input
                                                    id={field.name}
                                                    name={field.name}
                                                    value={field.state.value}
                                                    type="email"
                                                    onBlur={field.handleBlur}
                                                    onChange={(e) =>
                                                        field.handleChange(
                                                            e.target.value,
                                                        )
                                                    }
                                                    aria-invalid={isInvalid}
                                                    required
                                                />
                                                {isInvalid && (
                                                    <FieldError
                                                        errors={
                                                            field.state.meta
                                                                .errors
                                                        }
                                                    />
                                                )}
                                            </Field>
                                        );
                                    }}
                                </form.Field>

                                {/* 密码输入框 */}
                                <form.Field name="password">
                                    {(field) => {
                                        const isInvalid =
                                            field.state.meta.isTouched &&
                                            !field.state.meta.isValid;
                                        return (
                                            <Field data-invalid={isInvalid}>
                                                <FieldLabel htmlFor="password">
                                                    {t("password")}
                                                </FieldLabel>
                                                <Input
                                                    id={field.name}
                                                    name={field.name}
                                                    value={field.state.value}
                                                    type="password"
                                                    onBlur={field.handleBlur}
                                                    onChange={(e) =>
                                                        field.handleChange(
                                                            e.target.value,
                                                        )
                                                    }
                                                    aria-invalid={isInvalid}
                                                    required
                                                />
                                                {isInvalid && (
                                                    <FieldError
                                                        errors={
                                                            field.state.meta
                                                                .errors
                                                        }
                                                    />
                                                )}
                                            </Field>
                                        );
                                    }}
                                </form.Field>

                                <form.Subscribe
                                    selector={(formState) => [
                                        formState.canSubmit,
                                        formState.isSubmitting,
                                    ]}
                                >
                                    {([canSubmit, isSubmitting]) => (
                                        <Field>
                                            <Button
                                                type="submit"
                                                disabled={!canSubmit}
                                            >
                                                {isSubmitting
                                                    ? "..."
                                                    : t("sign_up")}
                                            </Button>
                                        </Field>
                                    )}
                                </form.Subscribe>

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
                                    <FieldDescription>
                                        {t("already_have_an_account")}
                                        <Link
                                            href="/auth/sign-in"
                                            className="underline"
                                        >
                                            {t("sign_in")}
                                        </Link>
                                    </FieldDescription>
                                </div>
                            </FieldGroup>
                        </FieldSet>
                    </form>
                </CardContent>
            </Card>
        </div>
    );
}
