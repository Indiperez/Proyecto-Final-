import { AlertTriangle, AlertCircle, Info, ChevronRight } from "lucide-react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
// import { useInventoryStore } from "@/lib/store"
import { cn } from "@/lib/utils";
import { Link } from "react-router-dom";
import type { Alert, Product } from "@/types/dashboard";

export function AlertsList() {
  //   const { alerts, products } = useInventoryStore()
  const alerts: Alert[] = [
    {
      date: "",
      id: "",
      priority: "high",
      productId: "",
      recommendation: "",
      status: "attended",
      type: "critical_stock",
    },
  ];

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

  const pendingAlerts = alerts
    .filter((a) => a.status === "pending")
    .slice(0, 5);

  const getProductName = (productId: string) => {
    return (
      products.find((p) => p.id === productId)?.name || "Producto desconocido"
    );
  };

  const getPriorityConfig = (priority: string) => {
    switch (priority) {
      case "high":
        return {
          icon: AlertTriangle,
          color: "text-critical",
          bg: "bg-critical/10",
          badge: "bg-critical/10 text-critical border-critical/20",
        };
      case "medium":
        return {
          icon: AlertCircle,
          color: "text-warning",
          bg: "bg-warning/10",
          badge: "bg-warning/10 text-warning border-warning/20",
        };
      default:
        return {
          icon: Info,
          color: "text-primary",
          bg: "bg-primary/10",
          badge: "bg-primary/10 text-primary border-primary/20",
        };
    }
  };

  const getTypeLabel = (type: string) => {
    switch (type) {
      case "low_stock":
        return "Stock bajo";
      case "critical_stock":
        return "Stock crítico";
      case "no_movement":
        return "Sin movimiento";
      case "reorder":
        return "Reordenar";
      default:
        return type;
    }
  };

  return (
    <Card
      className="border-border/50 bg-card/80 backdrop-blur-sm animate-fade-in opacity-0"
      style={{ animationDelay: "400ms", animationFillMode: "forwards" }}
    >
      <CardHeader className="flex flex-row items-center justify-between">
        <div>
          <CardTitle className="text-lg font-semibold">
            Alertas Activas
          </CardTitle>
          <CardDescription>
            {pendingAlerts.length} alertas pendientes de atención
          </CardDescription>
        </div>
        <Link to="/dashboard/alerts">
          <Button
            variant="ghost"
            size="sm"
            className="text-primary hover:text-primary/80"
          >
            Ver todas
            <ChevronRight className="w-4 h-4 ml-1" />
          </Button>
        </Link>
      </CardHeader>
      <CardContent>
        <div className="space-y-3">
          {pendingAlerts.length === 0 ? (
            <div className="text-center py-8 text-muted-foreground">
              <Info className="w-10 h-10 mx-auto mb-2 opacity-50" />
              <p>No hay alertas pendientes</p>
            </div>
          ) : (
            pendingAlerts.map((alert, index) => {
              const config = getPriorityConfig(alert.priority);
              const Icon = config.icon;

              return (
                <div
                  key={alert.id}
                  className={cn(
                    "p-4 rounded-xl border border-border/50 hover:border-border transition-all duration-200 group cursor-pointer animate-slide-in-right opacity-0",
                  )}
                  style={{
                    animationDelay: `${500 + index * 100}ms`,
                    animationFillMode: "forwards",
                  }}
                >
                  <div className="flex items-start gap-3">
                    <div
                      className={cn(
                        "w-10 h-10 rounded-lg flex items-center justify-center shrink-0",
                        config.bg,
                      )}
                    >
                      <Icon className={cn("w-5 h-5", config.color)} />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-1">
                        <Badge
                          variant="outline"
                          className={cn("text-xs", config.badge)}
                        >
                          {getTypeLabel(alert.type)}
                        </Badge>
                        <span className="text-xs text-muted-foreground">
                          {alert.date}
                        </span>
                      </div>
                      <p className="text-sm font-medium text-foreground truncate">
                        {getProductName(alert.productId)}
                      </p>
                      <p className="text-xs text-muted-foreground mt-1 line-clamp-2">
                        {alert.recommendation}
                      </p>
                    </div>
                    <ChevronRight className="w-4 h-4 text-muted-foreground group-hover:text-foreground transition-colors shrink-0" />
                  </div>
                </div>
              );
            })
          )}
        </div>
      </CardContent>
    </Card>
  );
}
