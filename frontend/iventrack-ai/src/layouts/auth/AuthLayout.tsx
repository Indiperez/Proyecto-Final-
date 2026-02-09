import { Toaster } from "@/components/ui/sonner";
import { Package } from "lucide-react";
import { Outlet } from "react-router-dom";

export const AuthLayout = () => {
  return (
    <>
      <div className="min-h-screen flex items-center justify-center bg-background p-4 relative overflow-hidden">
        {/* Animated background elements */}
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute -top-40 -left-40 w-80 h-80 bg-primary/10 rounded-full blur-3xl animate-pulse" />
          <div
            className="absolute -bottom-40 -right-40 w-80 h-80 bg-primary/5 rounded-full blur-3xl animate-pulse"
            style={{ animationDelay: "1s" }}
          />
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-150 h-150 bg-primary/5 rounded-full blur-3xl" />
        </div>

        {/* Grid pattern overlay */}
        <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.02)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.02)_1px,transparent_1px)] bg-size-[50px_50px]" />

        <div className="w-full max-w-md z-10">
          {/* Logo and title */}
          <div className="text-center mb-8 animate-fade-in">
            <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-primary/10 border border-primary/20 mb-4 glow-primary">
              <Package className="w-8 h-8 text-primary" />
            </div>
            <h1 className="text-3xl font-bold text-foreground mb-2">
              InvenTrack AI
            </h1>
            <p className="text-muted-foreground">
              Sistema Inteligente de Inventarios
            </p>
          </div>
          <Outlet />
        </div>
      </div>
      <Toaster />
    </>
  );
};
