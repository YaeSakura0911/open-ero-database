"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardContent, CardTitle } from "@/components/ui/card";
import {
    Field,
    FieldDescription,
    FieldError,
    FieldGroup,
    FieldLabel,
    FieldSet,
} from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { z } from "zod";
import { useTranslations } from "next-intl";
import { useForm } from "@tanstack/react-form-nextjs";

const ForgotPasswordSchema = z.object({
    email: z.email(),
});

export default function ForgotPasswordPage() {
    const t = useTranslations("AuthPage");
    const form = useForm({
        defaultValues: {
            email: "",
        },
        validators: {
            onSubmit: ForgotPasswordSchema,
            onChange: ForgotPasswordSchema,
            onBlur: ForgotPasswordSchema,
        },
    });

    return (
        <div className="flex w-full items-center justify-center">
            <Card className="w-full max-w-sm">
                <CardHeader>
                    <CardTitle className="text-xl font-semibold">
                        {t("forgot")}
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
                                {/* 邮箱输入框 */}
                                <form.Field name="email">
                                    {(field) => {
                                        const isInvalid =
                                            field.state.meta.isTouched &&
                                            !field.state.meta.isValid;
                                        return (
                                            <Field>
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
                                                className="hover: cursor-pointer"
                                                disabled={!canSubmit}
                                            >
                                                {isSubmitting
                                                    ? "..."
                                                    : t("send_reset_link")}
                                            </Button>
                                        </Field>
                                    )}
                                </form.Subscribe>

                                <div className="flex flex-col items-center gap-3">
                                    <FieldDescription>
                                        {t("remember_your_password")}
                                        <Link href="/auth/sign-in" className="hover: cursor-pointer">
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
