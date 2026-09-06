import { z } from "zod";
import { formOptions } from "@tanstack/react-form-nextjs";

export const SignUpSchema = z.object({
    name: z.string().min(1, "This field is required"),
    email: z.email(),
    password: z.string().min(8, "Must be at least 8 characters"),
});

export const signUpFormOptions = formOptions({
    defaultValues: {
        name: "",
        email: "",
        password: "",
    },
    validators: {
        onSubmit: SignUpSchema,
        onChange: SignUpSchema,
        onBlur: SignUpSchema
    },
});
