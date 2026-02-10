

import { useState } from "react";
import {
  AlertTriangle,
  AlertCircle,
  Info,
  CheckCircle,
  Filter,
  Package,
  Check,
  Sparkles,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

import { cn } from "@/lib/utils";
import type { Alert, Product } from "@/types/dashboard";

type StatusFilter = "all" | "pending" | "attended";
type PriorityFilter = "all" | "high" | "medium" | "low";

export default function AlertsPage() {
  const alerts: Alert[] = [
    {
      id: "1",
      productId: "4",
      type: "low_stock",
      priority: "high",
      date: "2025-02-02",
      status: "pending",
      recommendation:
        "Reordenar 30 unidades de Mouse Inalámbrico para mantener nivel óptimo",
    },
    {
      id: "2",
      productId: "6",
      type: "critical_stock",
      priority: "high",
      date: "2025-02-02",
      status: "pending",
      recommendation:
        "Stock crítico: Ordenar inmediatamente 15 unidades de Webcam HD 1080p",
    },
    {
      id: "3",
      productId: "9",
      type: "critical_stock",
      priority: "high",
      date: "2025-02-01",
      status: "pending",
      recommendation: "Sin stock: Reordenar urgente SSD Samsung 1TB",
    },
    {
      id: "4",
      productId: "2",
      type: "low_stock",
      priority: "medium",
      date: "2025-02-01",
      status: "attended",
      recommendation: 'Considerar reorden de Monitor Samsung 27"',
    },
    {
      id: "5",
      productId: "10",
      type: "no_movement",
      priority: "low",
      date: "2025-01-25",
      status: "pending",
      recommendation:
        "RAM DDR4 16GB sin movimiento en 30+ días. Evaluar promoción o redistribución.",
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
  const [statusFilter, setStatusFilter] = useState<StatusFilter>("all");
  const [priorityFilter, setPriorityFilter] = useState<PriorityFilter>("all");

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
          label: "Alta",
        };
      case "medium":
        return {
          icon: AlertCircle,
          color: "text-warning",
          bg: "bg-warning/10",
          badge: "bg-warning/10 text-warning border-warning/20",
          label: "Media",
        };
      default:
        return {
          icon: Info,
          color: "text-primary",
          bg: "bg-primary/10",
          badge: "bg-primary/10 text-primary border-primary/20",
          label: "Baja",
        };
    }
  };

  const getTypeLabel = (type: string) => {
    switch (type) {
      case "low_stock":
        return "Stock Bajo";
      case "critical_stock":
        return "Stock Crítico";
      case "no_movement":
        return "Sin Movimiento";
      case "reorder":
        return "Reordenar";
      default:
        return type;
    }
  };

  const filteredAlerts = alerts
    .filter((alert) => {
      const matchesStatus =
        statusFilter === "all" || alert.status === statusFilter;
      const matchesPriority =
        priorityFilter === "all" || alert.priority === priorityFilter;
      return matchesStatus && matchesPriority;
    })
    .sort((a, b) => {
      // Sort by status (pending first), then by priority, then by date
      if (a.status !== b.status) return a.status === "pending" ? -1 : 1;
      const priorityOrder = { high: 0, medium: 1, low: 2 };
      if (a.priority !== b.priority)
        return priorityOrder[a.priority] - priorityOrder[b.priority];
      return new Date(b.date).getTime() - new Date(a.date).getTime();
    });

  // Stats
  const pendingCount = alerts.filter((a) => a.status === "pending").length;
  const highPriorityCount = alerts.filter(
    (a) => a.status === "pending" && a.priority === "high",
  ).length;
  const attendedCount = alerts.filter((a) => a.status === "attended").length;

  return (
    <div className="space-y-6">
      {/* Page header */}
      <div className="animate-fade-in">
        <h1 className="text-2xl font-bold text-foreground">Alertas</h1>
        <p className="text-muted-foreground mt-1">
          Gestiona las alertas generadas automáticamente
        </p>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <Card
          className={cn(
            "border-border/50 bg-card/80 backdrop-blur-sm cursor-pointer transition-all hover:border-warning/30 animate-fade-in opacity-0",
            statusFilter === "pending" && "border-warning/50 bg-warning/5",
          )}
          style={{ animationDelay: "100ms", animationFillMode: "forwards" }}
          onClick={() =>
            setStatusFilter(statusFilter === "pending" ? "all" : "pending")
          }
        >
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg bg-warning/10 flex items-center justify-center">
                <AlertCircle className="w-5 h-5 text-warning" />
              </div>
              <div>
                <p className="text-2xl font-bold text-foreground">
                  {pendingCount}
                </p>
                <p className="text-sm text-muted-foreground">Pendientes</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card
          className={cn(
            "border-border/50 bg-card/80 backdrop-blur-sm cursor-pointer transition-all hover:border-critical/30 animate-fade-in opacity-0",
            priorityFilter === "high" && "border-critical/50 bg-critical/5",
          )}
          style={{ animationDelay: "150ms", animationFillMode: "forwards" }}
          onClick={() =>
            setPriorityFilter(priorityFilter === "high" ? "all" : "high")
          }
        >
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg bg-critical/10 flex items-center justify-center">
                <AlertTriangle className="w-5 h-5 text-critical" />
              </div>
              <div>
                <p className="text-2xl font-bold text-foreground">
                  {highPriorityCount}
                </p>
                <p className="text-sm text-muted-foreground">Alta Prioridad</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card
          className={cn(
            "border-border/50 bg-card/80 backdrop-blur-sm cursor-pointer transition-all hover:border-success/30 animate-fade-in opacity-0",
            statusFilter === "attended" && "border-success/50 bg-success/5",
          )}
          style={{ animationDelay: "200ms", animationFillMode: "forwards" }}
          onClick={() =>
            setStatusFilter(statusFilter === "attended" ? "all" : "attended")
          }
        >
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg bg-success/10 flex items-center justify-center">
                <CheckCircle className="w-5 h-5 text-success" />
              </div>
              <div>
                <p className="text-2xl font-bold text-foreground">
                  {attendedCount}
                </p>
                <p className="text-sm text-muted-foreground">Atendidas</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Filters */}
      <div
        className="flex flex-col sm:flex-row gap-4 animate-fade-in"
        style={{ animationDelay: "250ms" }}
      >
        <Select
          value={statusFilter}
          onValueChange={(v) => setStatusFilter(v as StatusFilter)}
        >
          <SelectTrigger className="w-full sm:w-48 bg-secondary/50 border-border/50">
            <Filter className="w-4 h-4 mr-2 text-muted-foreground" />
            <SelectValue placeholder="Estado" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Todos los estados</SelectItem>
            <SelectItem value="pending">Pendientes</SelectItem>
            <SelectItem value="attended">Atendidas</SelectItem>
          </SelectContent>
        </Select>
        <Select
          value={priorityFilter}
          onValueChange={(v) => setPriorityFilter(v as PriorityFilter)}
        >
          <SelectTrigger className="w-full sm:w-48 bg-secondary/50 border-border/50">
            <AlertTriangle className="w-4 h-4 mr-2 text-muted-foreground" />
            <SelectValue placeholder="Prioridad" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Todas las prioridades</SelectItem>
            <SelectItem value="high">Alta</SelectItem>
            <SelectItem value="medium">Media</SelectItem>
            <SelectItem value="low">Baja</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Alerts List */}
      <div className="space-y-3">
        {filteredAlerts.length === 0 ? (
          <div className="text-center py-16 animate-fade-in">
            <Info className="w-12 h-12 mx-auto mb-4 text-muted-foreground opacity-50" />
            <p className="text-muted-foreground">No se encontraron alertas</p>
          </div>
        ) : (
          filteredAlerts.map((alert, index) => {
            const config = getPriorityConfig(alert.priority);
            const Icon = config.icon;

            return (
              <Card
                key={alert.id}
                className={cn(
                  "border-border/50 bg-card/80 backdrop-blur-sm transition-all hover:border-border animate-fade-in opacity-0",
                  alert.status === "attended" && "opacity-60",
                )}
                style={{
                  animationDelay: `${300 + index * 50}ms`,
                  animationFillMode: "forwards",
                }}
              >
                <CardContent className="p-4">
                  <div className="flex items-start gap-4">
                    <div
                      className={cn(
                        "w-12 h-12 rounded-xl flex items-center justify-center flex-shrink-0",
                        config.bg,
                      )}
                    >
                      <Icon className={cn("w-6 h-6", config.color)} />
                    </div>

                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 flex-wrap mb-2">
                        <Badge className={cn("border", config.badge)}>
                          {config.label}
                        </Badge>
                        <Badge variant="outline" className="bg-secondary/50">
                          {getTypeLabel(alert.type)}
                        </Badge>
                        <span className="text-xs text-muted-foreground">
                          {alert.date}
                        </span>
                        {alert.status === "attended" && (
                          <Badge className="bg-success/10 text-success border-success/20">
                            <Check className="w-3 h-3 mr-1" />
                            Atendida
                          </Badge>
                        )}
                      </div>

                      <div className="flex items-center gap-2 mb-2">
                        <Package className="w-4 h-4 text-muted-foreground" />
                        <span className="font-medium">
                          {getProductName(alert.productId)}
                        </span>
                      </div>

                      <div className="p-3 rounded-lg bg-secondary/30 border border-border/30">
                        <div className="flex items-start gap-2">
                          <Sparkles className="w-4 h-4 text-primary mt-0.5 flex-shrink-0" />
                          <p className="text-sm text-muted-foreground">
                            {alert.recommendation}
                          </p>
                        </div>
                      </div>
                    </div>

                    {alert.status === "pending" && (
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => {} /*attendAlert(alert.id)*/}
                        className="flex-shrink-0 hover:bg-success/10 hover:text-success hover:border-success/30"
                      >
                        <Check className="w-4 h-4 mr-2" />
                        Marcar como atendida
                      </Button>
                    )}
                  </div>
                </CardContent>
              </Card>
            );
          })
        )}
      </div>

      {/* Summary */}
      <div className="flex items-center justify-between text-sm text-muted-foreground animate-fade-in">
        <p>
          Mostrando {filteredAlerts.length} de {alerts.length} alertas
        </p>
      </div>
    </div>
  );
}
