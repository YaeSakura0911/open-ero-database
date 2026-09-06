"use server";

import { auth } from "@/lib/auth";
import { signInFormOption, SignInSchema } from "@/types/sign-in-schema";
import {
    ServerValidateError,
    createServerValidate,
} from "@tanstack/react-form-nextjs";
import { isAPIError } from "better-auth/api";

const serverValidate = createServerValidate({
    ...signInFormOption,
    onServerValidate: SignInSchema,
});

export default async function SignInAction(prev: unknown, formData: FormData) {
    try {
        const validatedData = await serverValidate(formData);

        const response = await auth.api.signInEmail({
            body: {
                email: validatedData.email,
                password: validatedData.password,
            },
        });
    } catch (e) {
        if (e instanceof ServerValidateError) {
            return e.formState;
        }
        if (isAPIError(e)) {
            return (e.message, e.status);
        }

        throw e;
    }
}
