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
// import { useInventoryStore } from "@/lib/store";
import { cn } from "@/lib/utils";
import type { Product } from "@/types/dashboard";

export function AIRecommendations() {
  //   const { products, movements } = useInventoryStore();

  const products: Product[] = [
    {
      category: "",
      code: "",
      currentStock: 3,
      id: "",
      leadTime: 2,
      name: "",
      status: "active",
      stockMin: 1,
    },
  ];

  // Calculate recommendations based on data
  const recommendations = [
    {
      id: 1,
      type: "reorder",
      icon: Package,
      title: "Reordenar Mouse Inalámbrico",
      description:
        "El stock actual (5 unidades) está por debajo del mínimo. Se recomienda ordenar 30 unidades.",
      priority: "high",
      action: "Generar orden",
    },
    {
      id: 2,
      type: "trend",
      icon: TrendingUp,
      title: "Alta demanda de Laptops",
      description:
        "Las Laptop Dell XPS 15 muestran un incremento del 25% en salidas. Considere aumentar el stock.",
      priority: "medium",
      action: "Ver análisis",
    },
    {
      id: 3,
      type: "low_rotation",
      icon: TrendingDown,
      title: "Baja rotación detectada",
      description:
        "RAM DDR4 16GB sin movimiento en 30+ días. Evalúe promoción o redistribución.",
      priority: "low",
      action: "Ver producto",
    },
    {
      id: 4,
      type: "critical",
      icon: RefreshCw,
      title: "Reposición urgente",
      description:
        "SSD Samsung 1TB y Webcam HD 1080p con stock crítico. Ordenar inmediatamente.",
      priority: "high",
      action: "Ordenar ahora",
    },
  ];

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
                      "w-5 h-5 mt-0.5 flex-shrink-0",
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
      </CardContent>
    </Card>
  );
}
