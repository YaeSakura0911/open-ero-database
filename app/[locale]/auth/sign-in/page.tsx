"use client";

import { useActionState } from "react";
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
import SignInAction from "./action";
import { initialFormState, useForm } from "@tanstack/react-form-nextjs";
import { signInFormOption } from "@/types/sign-in-schema";

export default function SignInPage() {
    const t = useTranslations("AuthPage");
    const [state, action] = useActionState(SignInAction, initialFormState);
    const form = useForm({
        ...signInFormOption,
    });

    return (
        <div className="flex w-full items-center justify-center">
            <Card className="w-full max-w-sm">
                <CardHeader>
                    <CardTitle className="text-xl font-semibold">
                        {t("sign_in")}
                    </CardTitle>
                </CardHeader>
                <CardContent>
                    <form
                        action={action as never}
                        onSubmit={() => form.handleSubmit()}
                    >
                        <FieldSet>
                            <FieldGroup>
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

                                <form.Field name="password">
                                    {(field) => {
                                        const isInvalid =
                                            field.state.meta.isTouched &&
                                            !field.state.meta.isValid;
                                        return (
                                            <Field data-invalid={isInvalid}>
                                                <FieldLabel
                                                    htmlFor={field.name}
                                                >
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
                                                    : t("sign_in")}
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
                    </form>
                </CardContent>
            </Card>
        </div>
    );
}
