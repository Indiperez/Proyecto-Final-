

import { useState } from "react";
import {
  Search,
  Filter,
  Package,
  AlertTriangle,
  AlertCircle,
  CheckCircle,
} from "lucide-react";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
// import { useInventoryStore } from "@/lib/store"
import { cn } from "@/lib/utils";
import type { Product } from "@/types/dashboard";
import { useProducts } from "@/services/products/useProducts";
import type { Producto } from "@/types/api";

type StockStatus = "all" | "normal" | "low" | "critical";

export default function InventoryPage() {
  const { data: productsData } = useProducts();

  const productList: Producto[] = Array.isArray(productsData) ? productsData : (productsData && typeof productsData === 'object' && 'data' in productsData ? (productsData as { data: Producto[] }).data : []);

  const products: Product[] = productList.map(p => ({
    id: p.id.toString(),
    code: `PROD-${p.id}`,
    name: p.nombre,
    category: "General",
    currentStock: p.stockActual,
    stockMin: p.stockMinimo,
    leadTime: 0,
    status: "active"
  }));

  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState<StockStatus>("all");

  const getStockStatus = (current: number, min: number) => {
    if (current === 0) return "critical";
    if (current < min) return "low";
    return "normal";
  };

  const getStockConfig = (status: string) => {
    switch (status) {
      case "critical":
        return {
          label: "Crítico",
          icon: AlertTriangle,
          color: "text-critical",
          bg: "bg-critical/10",
          badge: "bg-critical/10 text-critical border-critical/20",
          progress: "bg-critical",
        };
      case "low":
        return {
          label: "Bajo",
          icon: AlertCircle,
          color: "text-warning",
          bg: "bg-warning/10",
          badge: "bg-warning/10 text-warning border-warning/20",
          progress: "bg-warning",
        };
      default:
        return {
          label: "Normal",
          icon: CheckCircle,
          color: "text-success",
          bg: "bg-success/10",
          badge: "bg-success/10 text-success border-success/20",
          progress: "bg-success",
        };
    }
  };

  const activeProducts = products.filter((p) => p.status === "active");

  const filteredProducts = activeProducts.filter((product) => {
    const matchesSearch =
      product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      product.code.toLowerCase().includes(searchTerm.toLowerCase());
    const stockStatus = getStockStatus(product.currentStock, product.stockMin);
    const matchesStatus =
      statusFilter === "all" || stockStatus === statusFilter;
    return matchesSearch && matchesStatus;
  });

  // Calculate summary stats
  const normalCount = activeProducts.filter(
    (p) => getStockStatus(p.currentStock, p.stockMin) === "normal",
  ).length;
  const lowCount = activeProducts.filter(
    (p) => getStockStatus(p.currentStock, p.stockMin) === "low",
  ).length;
  const criticalCount = activeProducts.filter(
    (p) => getStockStatus(p.currentStock, p.stockMin) === "critical",
  ).length;

  return (
    <div className="space-y-6">
      {/* Page header */}
      <div className="animate-fade-in">
        <h1 className="text-2xl font-bold text-foreground">Inventario</h1>
        <p className="text-muted-foreground mt-1">
          Vista general del stock actual
        </p>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <Card
          className={cn(
            "border-border/50 bg-card/80 backdrop-blur-sm cursor-pointer transition-all hover:border-success/30 animate-fade-in opacity-0",
            statusFilter === "normal" && "border-success/50 bg-success/5",
          )}
          style={{ animationDelay: "100ms", animationFillMode: "forwards" }}
          onClick={() =>
            setStatusFilter(statusFilter === "normal" ? "all" : "normal")
          }
        >
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg bg-success/10 flex items-center justify-center">
                <CheckCircle className="w-5 h-5 text-success" />
              </div>
              <div>
                <p className="text-2xl font-bold text-foreground">
                  {normalCount}
                </p>
                <p className="text-sm text-muted-foreground">Stock Normal</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card
          className={cn(
            "border-border/50 bg-card/80 backdrop-blur-sm cursor-pointer transition-all hover:border-warning/30 animate-fade-in opacity-0",
            statusFilter === "low" && "border-warning/50 bg-warning/5",
          )}
          style={{ animationDelay: "150ms", animationFillMode: "forwards" }}
          onClick={() =>
            setStatusFilter(statusFilter === "low" ? "all" : "low")
          }
        >
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg bg-warning/10 flex items-center justify-center">
                <AlertCircle className="w-5 h-5 text-warning" />
              </div>
              <div>
                <p className="text-2xl font-bold text-foreground">{lowCount}</p>
                <p className="text-sm text-muted-foreground">Stock Bajo</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card
          className={cn(
            "border-border/50 bg-card/80 backdrop-blur-sm cursor-pointer transition-all hover:border-critical/30 animate-fade-in opacity-0",
            statusFilter === "critical" && "border-critical/50 bg-critical/5",
          )}
          style={{ animationDelay: "200ms", animationFillMode: "forwards" }}
          onClick={() =>
            setStatusFilter(statusFilter === "critical" ? "all" : "critical")
          }
        >
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg bg-critical/10 flex items-center justify-center">
                <AlertTriangle className="w-5 h-5 text-critical" />
              </div>
              <div>
                <p className="text-2xl font-bold text-foreground">
                  {criticalCount}
                </p>
                <p className="text-sm text-muted-foreground">Stock Crítico</p>
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
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <Input
            placeholder="Buscar por nombre o código..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10 bg-secondary/50 border-border/50"
          />
        </div>
        <Select
          value={statusFilter}
          onValueChange={(v) => setStatusFilter(v as StockStatus)}
        >
          <SelectTrigger className="w-full sm:w-48 bg-secondary/50 border-border/50">
            <Filter className="w-4 h-4 mr-2 text-muted-foreground" />
            <SelectValue placeholder="Estado" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Todos los estados</SelectItem>
            <SelectItem value="normal">Normal</SelectItem>
            <SelectItem value="low">Bajo</SelectItem>
            <SelectItem value="critical">Crítico</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Inventory Table */}
      <div
        className="border border-border/50 rounded-xl overflow-hidden bg-card/50 backdrop-blur-sm animate-fade-in"
        style={{ animationDelay: "300ms" }}
      >
        <Table>
          <TableHeader>
            <TableRow className="hover:bg-transparent border-border/50">
              <TableHead className="text-muted-foreground">Producto</TableHead>
              <TableHead className="text-muted-foreground text-center">
                Stock Actual
              </TableHead>
              <TableHead className="text-muted-foreground text-center">
                Stock Mínimo
              </TableHead>
              <TableHead className="text-muted-foreground">Nivel</TableHead>
              <TableHead className="text-muted-foreground text-center">
                Estado
              </TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredProducts.length === 0 ? (
              <TableRow>
                <TableCell colSpan={5} className="h-32 text-center">
                  <div className="flex flex-col items-center text-muted-foreground">
                    <Package className="w-10 h-10 mb-2 opacity-50" />
                    <p>No se encontraron productos</p>
                  </div>
                </TableCell>
              </TableRow>
            ) : (
              filteredProducts.map((product, index) => {
                const status = getStockStatus(
                  product.currentStock,
                  product.stockMin,
                );
                const config = getStockConfig(status);
                const Icon = config.icon;
                const percentage = Math.min(
                  (product.currentStock / (product.stockMin * 2)) * 100,
                  100,
                );

                return (
                  <TableRow
                    key={product.id}
                    className="border-border/50 hover:bg-secondary/30 transition-colors animate-fade-in opacity-0"
                    style={{
                      animationDelay: `${350 + index * 50}ms`,
                      animationFillMode: "forwards",
                    }}
                  >
                    <TableCell>
                      <div className="flex items-center gap-3">
                        <div
                          className={cn(
                            "w-10 h-10 rounded-lg flex items-center justify-center",
                            config.bg,
                          )}
                        >
                          <Package className={cn("w-5 h-5", config.color)} />
                        </div>
                        <div>
                          <p className="font-medium">{product.name}</p>
                          <p className="text-xs text-muted-foreground font-mono">
                            {product.code}
                          </p>
                        </div>
                      </div>
                    </TableCell>
                    <TableCell className="text-center">
                      <span className={cn("text-lg font-bold", config.color)}>
                        {product.currentStock}
                      </span>
                    </TableCell>
                    <TableCell className="text-center text-muted-foreground">
                      {product.stockMin}
                    </TableCell>
                    <TableCell>
                      <div className="w-full max-w-32">
                        <Progress
                          value={percentage}
                          className="h-2 bg-secondary"
                        />
                      </div>
                    </TableCell>
                    <TableCell className="text-center">
                      <Badge className={cn("border", config.badge)}>
                        <Icon className="w-3 h-3 mr-1" />
                        {config.label}
                      </Badge>
                    </TableCell>
                  </TableRow>
                );
              })
            )}
          </TableBody>
        </Table>
      </div>

      {/* Summary */}
      <div className="flex items-center justify-between text-sm text-muted-foreground animate-fade-in">
        <p>
          Mostrando {filteredProducts.length} de {activeProducts.length}{" "}
          productos activos
        </p>
      </div>
    </div>
  );
}
