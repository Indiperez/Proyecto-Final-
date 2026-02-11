import { Loader2, Package } from "lucide-react";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

export const LoadingPage = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    // Redirect based on authentication status
    const timer = setTimeout(() => {
      if (isAuthenticated) {
        navigate("/dashboard");
      } else {
        navigate("auth/login");
      }
    }, 4000);

    return () => clearTimeout(timer);
  }, [isAuthenticated]);

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-background relative overflow-hidden">
      {/* Animated background elements */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-primary/10 rounded-full blur-3xl animate-pulse" />
        <div
          className="absolute -bottom-40 -left-40 w-80 h-80 bg-primary/5 rounded-full blur-3xl animate-pulse"
          style={{ animationDelay: "1s" }}
        />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-150 h-150 bg-primary/5 rounded-full blur-3xl" />
      </div>

      {/* Grid pattern overlay */}
      <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.02)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.02)_1px,transparent_1px)] bg-size-[50px_50px]" />

      <div className="z-10 text-center animate-fade-in">
        <div className="inline-flex items-center justify-center w-20 h-20 rounded-2xl bg-primary/10 border border-primary/20 mb-6 glow-primary animate-pulse-glow">
          <Package className="w-10 h-10 text-primary" />
        </div>

        <h1 className="text-4xl font-bold text-foreground mb-2">
          InvenTrack AI
        </h1>
        <p className="text-muted-foreground mb-8">
          Sistema Inteligente de Inventarios
        </p>

        <div className="flex items-center justify-center gap-2 text-primary">
          <Loader2 className="w-5 h-5 animate-spin" />
          <span className="text-sm">Cargando...</span>
        </div>
      </div>
    </div>
  );
};
