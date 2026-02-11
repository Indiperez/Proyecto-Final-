import { z } from "zod";

export const roles = ["OPERATOR", "ADMIN"] as const;

export const authSchema = z.object({
  nombre: z.string().min(2, "El nombre debe tener al menos 2 caracteres"),
  email: z.email("Email inválido"),
  password: z.string().min(6, "La contraseña debe tener al menos 6 caracteres"),
  rol: z.enum(roles, { error: "Debe seleccionar un rol" }),
});

export const registerFormSchema = authSchema.pick({
  email: true,
  nombre: true,
  password: true,
  rol: true,
});

export const loginFromSchema = authSchema.pick({
  email: true,
  password: true,
});
