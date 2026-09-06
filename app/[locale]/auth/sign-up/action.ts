"use server";

import { auth } from "@/lib/auth";
import { signUpFormOptions, SignUpSchema } from "@/types/sign-up-schema";
import {
    createServerValidate,
    ServerValidateError,
} from "@tanstack/react-form-nextjs";
import { isAPIError } from "better-auth/api";

const serverValidate = createServerValidate({
    ...signUpFormOptions,
    onServerValidate: SignUpSchema,
});

export default async function SignUpAction(prev: unknown, formData: FormData) {
    try {
        const validatedData = await serverValidate(formData);

        const response = await auth.api.signUpEmail({
            body: {
                name: validatedData.name,
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
