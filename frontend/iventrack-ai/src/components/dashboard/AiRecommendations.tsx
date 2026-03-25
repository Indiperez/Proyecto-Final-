import {
  Sparkles,
  TrendingUp,
  TrendingDown,
  Package,
  RefreshCw,
} from "lucide-react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { useAlerts } from "@/services/alerts/useAlerts";
import type { Alerta } from "@/types/api";

type RecommendationType = "reorder" | "trend" | "low_rotation" | "critical";
type Priority = "high" | "medium" | "low";

interface Recommendation {
  id: number;
  type: RecommendationType;
  icon: typeof Package;
  title: string;
  description: string;
  priority: Priority;
  action: string;
}

function classifyAlerta(alerta: Alerta): Recommendation {
  const msg = alerta.mensaje.toLowerCase();

  let type: RecommendationType = "reorder";
  let priority: Priority = "medium";
  let icon = Package;
  let action = "Ver alerta";

  if (msg.includes("stock mínimo") || msg.includes("stock minimo")) {
    type = "critical";
    priority = "high";
    icon = RefreshCw;
    action = "Ordenar ahora";
  } else if (msg.includes("punto de reorden")) {
    type = "reorder";
    priority = "medium";
    icon = Package;
    action = "Generar orden";
  } else if (msg.includes("baja rotación") || msg.includes("baja rotacion")) {
    type = "low_rotation";
    priority = "low";
    icon = TrendingDown;
    action = "Ver producto";
  } else if (msg.includes("alta demanda")) {
    type = "trend";
    priority = "medium";
    icon = TrendingUp;
    action = "Ver análisis";
  }

  const titleMap: Record<RecommendationType, string> = {
    critical: "Reposición urgente",
    reorder: "Reordenar producto",
    low_rotation: "Baja rotación detectada",
    trend: "Alta demanda detectada",
  };

  return {
    id: alerta.id,
    type,
    icon,
    title: titleMap[type],
    description: alerta.mensaje,
    priority,
    action,
  };
}

const getPriorityStyles = (priority: string) => {
  switch (priority) {
    case "high":
      return "border-l-critical bg-critical/5";
    case "medium":
      return "border-l-warning bg-warning/5";
    default:
      return "border-l-primary bg-primary/5";
  }
};

export function AIRecommendations() {
  const { data: alerts, isLoading } = useAlerts();

  const recommendations: Recommendation[] = (alerts ?? [])
    .filter((a) => !a.leida)
    .map(classifyAlerta)
    .slice(0, 4);

  return (
    <Card
      className="border-border/50 bg-card/80 backdrop-blur-sm animate-fade-in opacity-0"
      style={{ animationDelay: "500ms", animationFillMode: "forwards" }}
    >
      <CardHeader>
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center">
            <Sparkles className="w-4 h-4 text-primary" />
          </div>
          <div>
            <CardTitle className="text-lg font-semibold">
              Recomendaciones IA
            </CardTitle>
            <CardDescription>
              Sugerencias basadas en análisis de datos
            </CardDescription>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        {isLoading ? (
          <p className="text-sm text-muted-foreground">Cargando...</p>
        ) : recommendations.length === 0 ? (
          <p className="text-sm text-muted-foreground">
            No hay recomendaciones pendientes.
          </p>
        ) : (
          <div className="space-y-3">
            {recommendations.map((rec, index) => {
              const Icon = rec.icon;
              return (
                <div
                  key={rec.id}
                  className={cn(
                    "p-4 rounded-xl border-l-4 transition-all duration-200 hover:shadow-md cursor-pointer animate-slide-in-left opacity-0",
                    getPriorityStyles(rec.priority),
                  )}
                  style={{
                    animationDelay: `${600 + index * 100}ms`,
                    animationFillMode: "forwards",
                  }}
                >
                  <div className="flex items-start gap-3">
                    <Icon
                      className={cn(
                        "w-5 h-5 mt-0.5 shrink-0",
                        rec.priority === "high"
                          ? "text-critical"
                          : rec.priority === "medium"
                            ? "text-warning"
                            : "text-primary",
                      )}
                    />
                    <div className="flex-1">
                      <div className="flex items-center justify-between mb-1">
                        <h4 className="text-sm font-medium text-foreground">
                          {rec.title}
                        </h4>
                        <Badge
                          variant="outline"
                          className={cn(
                            "text-xs",
                            rec.priority === "high"
                              ? "border-critical/30 text-critical"
                              : rec.priority === "medium"
                                ? "border-warning/30 text-warning"
                                : "border-primary/30 text-primary",
                          )}
                        >
                          {rec.priority === "high"
                            ? "Alta"
                            : rec.priority === "medium"
                              ? "Media"
                              : "Baja"}
                        </Badge>
                      </div>
                      <p className="text-xs text-muted-foreground mb-2">
                        {rec.description}
                      </p>
                      <Button
                        variant="ghost"
                        size="sm"
                        className="h-7 px-2 text-xs text-primary hover:text-primary/80 hover:bg-primary/10"
                      >
                        {rec.action}
                      </Button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </CardContent>
    </Card>
  );
}
