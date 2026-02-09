import {
  ArrowRight,
  Loader2,
  Lock,
  Mail,
  Shield,
  User,
  UserCog,
} from "lucide-react";

import { Input } from "../ui/input";
import { Label } from "../ui/label";
import { Button } from "../ui/button";

import { useForm } from "react-hook-form";
import type { RegisterFormType } from "@/types/auth";
import { zodResolver } from "@hookform/resolvers/zod";
import { registerFormSchema } from "@/schemas/auth";
import { ErrorMessage } from "../ErrorMessage";

export const RegisterForm = () => {
  const initialValues: RegisterFormType = {
    email: "",
    nombre: "",
    password: "",
    rol: "OPERATOR",
  };

  const {
    register,
    handleSubmit,
    watch,
    setValue,
    formState: { errors, isSubmitting },
  } = useForm({
    resolver: zodResolver(registerFormSchema),
    defaultValues: initialValues,
  });

  const role = watch("rol");

  const onSubmit = async (formData: RegisterFormType) => {
    console.log(formData);

    // const success = await register(name, email, password, role);

    // if (success) {
    //   router.push("/dashboard");
    // }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor="name" className="text-sm font-medium">
          Nombre completo
        </Label>
        <div className="relative">
          <User className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <Input
            {...register("nombre")}
            id="name"
            type="text"
            placeholder="Juan Pérez"
            className="pl-10 bg-secondary/50 border-border/50 focus:border-primary focus:ring-primary/20 transition-all"
          />
        </div>
        {errors.nombre && <ErrorMessage>{errors.nombre.message}</ErrorMessage>}
      </div>

      <div className="space-y-2">
        <Label htmlFor="email" className="text-sm font-medium">
          Correo electrónico
        </Label>
        <div className="relative">
          <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <Input
            {...register("email")}
            id="email"
            type="email"
            placeholder="correo@ejemplo.com"
            className="pl-10 bg-secondary/50 border-border/50 focus:border-primary focus:ring-primary/20 transition-all"
          />
        </div>
        {errors.email && <ErrorMessage>{errors.email.message}</ErrorMessage>}
      </div>

      <div className="space-y-2">
        <Label htmlFor="password" className="text-sm font-medium">
          Contraseña
        </Label>
        <div className="relative">
          <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <Input
            {...register("password")}
            id="password"
            type="password"
            placeholder="••••••••"
            className="pl-10 bg-secondary/50 border-border/50 focus:border-primary focus:ring-primary/20 transition-all"
          />
        </div>
        {errors.password && (
          <ErrorMessage>{errors.password.message}</ErrorMessage>
        )}
      </div>

      <div className="space-y-2">
        <Label className="text-sm font-medium">Rol</Label>
        <div className="grid grid-cols-2 gap-3">
          <button
            type="button"
            onClick={() =>
              setValue("rol", "OPERATOR", { shouldValidate: true })
            }
            className={`p-4 rounded-xl border-2 transition-all duration-300 flex flex-col items-center gap-2 ${
              role === "OPERATOR"
                ? "border-primary bg-primary/10 text-primary"
                : "border-border/50 bg-secondary/30 text-muted-foreground hover:border-border"
            }`}
          >
            <UserCog className="w-6 h-6" />
            <span className="text-sm font-medium">Operador</span>
          </button>
          <button
            type="button"
            onClick={() => setValue("rol", "ADMIN", { shouldValidate: true })}
            className={`p-4 rounded-xl border-2 transition-all duration-300 flex flex-col items-center gap-2 ${
              role === "ADMIN"
                ? "border-primary bg-primary/10 text-primary"
                : "border-border/50 bg-secondary/30 text-muted-foreground hover:border-border"
            }`}
          >
            <Shield className="w-6 h-6" />
            <span className="text-sm font-medium">Administrador</span>
          </button>
        </div>
      </div>

      <Button
        type="submit"
        className="w-full bg-primary hover:bg-primary/90 text-primary-foreground font-medium transition-all duration-300 hover:shadow-lg hover:shadow-primary/25"
        disabled={isSubmitting}
      >
        {isSubmitting ? (
          <>
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            Creando cuenta...
          </>
        ) : (
          <>
            Crear cuenta
            <ArrowRight className="ml-2 h-4 w-4" />
          </>
        )}
      </Button>
    </form>
  );
};
