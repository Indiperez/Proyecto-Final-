import type { loginFromSchema, registerFormSchema } from "@/schemas/auth";
import { z } from "zod";

export type RegisterFormType = z.infer<typeof registerFormSchema>;

export type LoginFormType = z.infer<typeof loginFromSchema>;
