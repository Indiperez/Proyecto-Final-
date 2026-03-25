import { ArrowRight, Loader2, Lock, Mail } from "lucide-react";

import { Input } from "../ui/input";
import { Label } from "../ui/label";
import { Button } from "../ui/button";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { loginFromSchema } from "@/schemas/auth";
import type { LoginFormType } from "@/types/auth";
import { ErrorMessage } from "../ErrorMessage";
import { useLogin } from "@/services/auth/useAuth";
import { useNavigate } from "react-router-dom";

export const LoginForm = () => {
  const initialValues: LoginFormType = {
    email: "",
    password: "",
  };

  const {
    handleSubmit,
    register,
    formState: { errors, isSubmitting },
  } = useForm({
    resolver: zodResolver(loginFromSchema),
    defaultValues: initialValues,
  });

  const { mutateAsync: login } = useLogin();
  const navigate = useNavigate();

  const onSubmit = async (data: LoginFormType) => {
    try {
      await login(data);
      navigate("/dashboard");
    } catch (error) {
      // Error is handled by useLogin mutation (toast)
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
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

      <Button
        type="submit"
        className="w-full bg-primary hover:bg-primary/90 text-primary-foreground font-medium transition-all duration-300 hover:shadow-lg hover:shadow-primary/25"
        disabled={isSubmitting}
      >
        {isSubmitting ? (
          <>
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            Ingresando...
          </>
        ) : (
          <>
            Ingresar
            <ArrowRight className="ml-2 h-4 w-4" />
          </>
        )}
      </Button>
    </form>
  );
};
