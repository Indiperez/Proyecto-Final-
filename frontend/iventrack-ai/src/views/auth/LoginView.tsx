import { LoginForm } from "@/components/auth/LoginForm";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Sparkles } from "lucide-react";
import { Link } from "react-router-dom";

export const LoginView = () => {
  return (
    <>
      <Card className="border-border/50 bg-card/80 backdrop-blur-xl shadow-2xl animate-fade-in stagger-1">
        <CardHeader className="space-y-1 pb-4">
          <CardTitle className="text-2xl font-semibold text-center">
            Iniciar Sesión
          </CardTitle>
          <CardDescription className="text-center">
            Ingresa tus credenciales para acceder al sistema
          </CardDescription>
        </CardHeader>
        <CardContent>
          <LoginForm />
        </CardContent>
        <CardFooter className="flex flex-col space-y-4 pt-0">
          <div className="relative w-full">
            <div className="absolute inset-0 flex items-center">
              <span className="w-full border-t border-border/50" />
            </div>
            <div className="relative flex justify-center text-xs uppercase">
              <span className="bg-card px-2 text-muted-foreground">o</span>
            </div>
          </div>
          <p className="text-center text-sm text-muted-foreground">
            ¿No tienes una cuenta?{" "}
            <Link
              to="/auth/register"
              className="text-primary hover:text-primary/80 font-medium transition-colors"
            >
              Regístrate aquí
            </Link>
          </p>
        </CardFooter>
      </Card>

      {/* Demo credentials hint */}
      <div className="mt-6 p-4 rounded-xl bg-secondary/30 border border-border/30 backdrop-blur-sm animate-fade-in stagger-2">
        <div className="flex items-center gap-2 text-primary mb-2">
          <Sparkles className="w-4 h-4" />
          <span className="text-sm font-medium">Credenciales de prueba</span>
        </div>
        <div className="space-y-1 text-xs text-muted-foreground">
          <p>
            <span className="text-foreground/70">Admin:</span>{" "}
            admin@inventrackup.com / admin123
          </p>
          <p>
            <span className="text-foreground/70">Operador:</span>{" "}
            operador@inventrackup.com / operador123
          </p>
        </div>
      </div>
    </>
  );
};
