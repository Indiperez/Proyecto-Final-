import { AIRecommendations } from "@/components/dashboard/AiRecommendations";
import { AlertsList } from "@/components/dashboard/AlterList";
import { ConsumptionChart } from "@/components/dashboard/ConsumptionChart";
import { KpiCard } from "@/components/dashboard/KpiCard";
import type { User } from "@/types/dashboard";
import { AlertCircle, AlertTriangle, Clock, Package } from "lucide-react";
import { useProducts, useLowStockProducts } from "@/services/products/useProducts";
import type { Producto } from "@/types/api";

export const DashboardPage = () => {
  const user: User = {
    email: "",
    id: "",
    name: "",
    role: "admin",
  };

  const { data: products } = useProducts();
  const { data: lowStock } = useLowStockProducts();

  // Normalización de datos
  const productList = Array.isArray(products) ? products : (products && typeof products === 'object' && 'data' in products ? (products as { data: Producto[] }).data : []);
  const lowStockList = Array.isArray(lowStock) ? lowStock : (lowStock && typeof lowStock === 'object' && 'data' in lowStock ? (lowStock as { data: Producto[] }).data : []);

  // Calculate KPIs
  const totalProducts = productList.length;
  const lowStockProducts = lowStockList.length;
  const criticalProducts = productList.filter((p: Producto) => p.stockActual === 0).length;
  const noMovementProducts = 0; // Simulated (Requires backend logic for movements analysis)

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
          subtitle="productos registrados"
          icon={Package}
          trend={{ value: 0, isPositive: true }}
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
