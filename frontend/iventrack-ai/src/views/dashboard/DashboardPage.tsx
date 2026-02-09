import { AIRecommendations } from "@/components/dashboard/AiRecommendations";
import { AlertsList } from "@/components/dashboard/AlterList";
import { ConsumptionChart } from "@/components/dashboard/ConsumptionChart";
import { KpiCard } from "@/components/dashboard/KpiCard";
import type { Product, User } from "@/types/dashboard";
import { AlertCircle, AlertTriangle, Clock, Package } from "lucide-react";

export const DashboardPage = () => {
  const user: User = {
    email: "",
    id: "",
    name: "",
    role: "admin",
  };

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

  // Calculate KPIs
  const totalProducts = products.filter((p) => p.status === "active").length;
  const lowStockProducts = products.filter(
    (p) => p.currentStock > 0 && p.currentStock < p.stockMin,
  ).length;
  const criticalProducts = products.filter((p) => p.currentStock === 0).length;
  const noMovementProducts = 2; // Simulated
  return (
    <div className="space-y-6">
      {/* Page header */}
      <div className="animate-fade-in">
        <h1 className="text-2xl font-bold text-foreground">
          Bienvenido, {user?.name?.split(" ")[0] || "Usuario"}
        </h1>
        <p className="text-muted-foreground mt-1">
          Aquí tienes el resumen de tu inventario de hoy
        </p>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <KpiCard
          title="Total Productos"
          value={totalProducts}
          subtitle="productos activos"
          icon={Package}
          trend={{ value: 12, isPositive: true }}
          variant="default"
          animationDelay={100}
        />
        <KpiCard
          title="Stock Bajo"
          value={lowStockProducts}
          subtitle="requieren atención"
          icon={AlertCircle}
          variant="warning"
          animationDelay={150}
        />
        <KpiCard
          title="Stock Crítico"
          value={criticalProducts}
          subtitle="sin existencias"
          icon={AlertTriangle}
          variant="critical"
          animationDelay={200}
        />
        <KpiCard
          title="Sin Movimiento"
          value={noMovementProducts}
          subtitle="últimos 30 días"
          icon={Clock}
          variant="default"
          animationDelay={250}
        />
      </div>

      {/* Charts and Alerts Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <ConsumptionChart />
        <AlertsList />
      </div>

      {/* AI Recommendations */}
      <AIRecommendations />
    </div>
  );
};
