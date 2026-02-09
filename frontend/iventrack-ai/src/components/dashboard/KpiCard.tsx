import type { LucideIcon } from "lucide-react";
import { cn } from "@/lib/utils";

type KpiCardProps = {
  title: string;
  value: string | number;
  subtitle?: string;
  icon: LucideIcon;
  trend?: {
    value: number;
    isPositive: boolean;
  };
  variant?: "default" | "success" | "warning" | "critical";
  className?: string;
  animationDelay?: number;
};

export function KpiCard({
  title,
  value,
  subtitle,
  icon: Icon,
  trend,
  variant = "default",
  className,
  animationDelay = 0,
}: KpiCardProps) {
  const variantStyles = {
    default: {
      bg: "bg-card",
      iconBg: "bg-primary/10",
      iconColor: "text-primary",
      glow: "",
    },
    success: {
      bg: "bg-card",
      iconBg: "bg-success/10",
      iconColor: "text-success",
      glow: "hover:glow-success",
    },
    warning: {
      bg: "bg-card",
      iconBg: "bg-warning/10",
      iconColor: "text-warning",
      glow: "hover:glow-warning",
    },
    critical: {
      bg: "bg-card",
      iconBg: "bg-critical/10",
      iconColor: "text-critical",
      glow: "hover:glow-critical",
    },
  };

  const styles = variantStyles[variant];

  return (
    <div
      className={cn(
        "p-6 rounded-2xl border border-border/50 transition-all duration-300 hover:border-border hover:shadow-lg group animate-fade-in opacity-0",
        styles.bg,
        styles.glow,
        className,
      )}
      style={{
        animationDelay: `${animationDelay}ms`,
        animationFillMode: "forwards",
      }}
    >
      <div className="flex items-start justify-between">
        <div className="space-y-1">
          <p className="text-sm text-muted-foreground font-medium">{title}</p>
          <p className="text-3xl font-bold text-foreground tracking-tight">
            {value}
          </p>
          {subtitle && (
            <p className="text-xs text-muted-foreground">{subtitle}</p>
          )}
          {trend && (
            <div
              className={cn(
                "inline-flex items-center gap-1 text-xs font-medium mt-2 px-2 py-1 rounded-full",
                trend.isPositive
                  ? "bg-success/10 text-success"
                  : "bg-critical/10 text-critical",
              )}
            >
              <span>
                {trend.isPositive ? "+" : ""}
                {trend.value}%
              </span>
              <span>vs mes anterior</span>
            </div>
          )}
        </div>
        <div
          className={cn(
            "w-12 h-12 rounded-xl flex items-center justify-center transition-transform duration-300 group-hover:scale-110",
            styles.iconBg,
          )}
        >
          <Icon className={cn("w-6 h-6", styles.iconColor)} />
        </div>
      </div>
    </div>
  );
}
