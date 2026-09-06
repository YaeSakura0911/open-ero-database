import { z } from "zod";
import { formOptions } from "@tanstack/react-form-nextjs";

export const SignInSchema = z.object({
    email: z.email(),
    password: z.string().min(8, "Must be at least 8 characters"),
});

export const signInFormOption = formOptions({
    defaultValues: {
        email: "",
        password: "",
    },
    validators: {
        onSubmit: SignInSchema,
        onChange: SignInSchema,
        onBlur: SignInSchema,
    },
});
