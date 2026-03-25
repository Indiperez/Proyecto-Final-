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
import type { Alert } from "@/types/dashboard";
import { useAlerts, useMarkAlertAsRead } from "@/services/alerts/useAlerts";
import { useProducts } from "@/services/products/useProducts";
import type { Alerta, Producto } from "@/types/api";

export function AlertsList() {
  const { data: alertsData } = useAlerts();
  const { data: productsData } = useProducts();
  const markAsReadMutation = useMarkAlertAsRead();

  // Normalize data
  const productList: Producto[] = Array.isArray(productsData) ? productsData : (productsData && typeof productsData === 'object' && 'data' in productsData ? (productsData as { data: Producto[] }).data : []);

  const alertsList: Alerta[] = Array.isArray(alertsData) ? alertsData : (alertsData && typeof alertsData === 'object' && 'data' in alertsData ? (alertsData as { data: Alerta[] }).data : []);

  // Map API alerts to UI alerts
  const alerts: Alert[] = alertsList.map(a => ({
    id: a.id.toString(),
    productId: a.productoId.toString(),
    type: 'reorder', // Default type as API doesn't provide it yet
    priority: 'medium', // Default priority
    date: new Date(a.fecha).toLocaleDateString(),
    status: a.leida ? 'attended' : 'pending',
    recommendation: a.mensaje
  }));

  const pendingAlerts = alerts
    .filter((a) => a.status === "pending")
    .slice(0, 5);

  const getProductName = (productId: string) => {
    return (
      productList.find((p) => p.id.toString() === productId)?.nombre || "Producto desconocido"
    );
  };

  const handleMarkAsRead = (id: string) => {
    markAsReadMutation.mutate(parseInt(id));
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

                    {alert.status === "pending" && (
                      <div className="flex items-center" onClick={(e) => e.stopPropagation()}>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleMarkAsRead(alert.id)}
                          className="flex-shrink-0 hover:bg-success/10 hover:text-success hover:border-success/30 ml-2"
                        >
                          Marcar leída
                        </Button>
                      </div>
                    )}
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
