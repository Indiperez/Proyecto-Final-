"use client";

import { useState } from "react";
import {
  FileText,
  Download,
  TrendingUp,
  TrendingDown,
  Calendar,
  Package,
  BarChart3,
  PieChart,
  Eye,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

import { cn } from "@/lib/utils";
import { useProducts } from "@/services/products/useProducts";
import type { Producto } from "@/types/api";

type ReportType =
  | "high_rotation"
  | "low_rotation"
  | "consumption"
  | "stock_vs_demand";

interface Report {
  id: ReportType;
  title: string;
  description: string;
  icon: typeof FileText;
  color: string;
  bg: string;
}

const reports: Report[] = [
  {
    id: "high_rotation",
    title: "Alta Rotación",
    description: "Productos con mayor movimiento en el período",
    icon: TrendingUp,
    color: "text-success",
    bg: "bg-success/10",
  },
  {
    id: "low_rotation",
    title: "Baja Rotación",
    description: "Productos con menor movimiento en el período",
    icon: TrendingDown,
    color: "text-warning",
    bg: "bg-warning/10",
  },
  {
    id: "consumption",
    title: "Consumo por Período",
    description: "Análisis detallado de consumo de inventario",
    icon: BarChart3,
    color: "text-primary",
    bg: "bg-primary/10",
  },
  {
    id: "stock_vs_demand",
    title: "Stock vs Demanda",
    description: "Comparación entre stock actual y demanda proyectada",
    icon: PieChart,
    color: "text-primary",
    bg: "bg-primary/10",
  },
];

// Mock report data (Empty until backend endpoint exists)
interface RotationData {
  product: string;
  code: string;
  movements: number;
  percentage?: number;
  daysWithoutMovement?: number;
}

interface ConsumptionData {
  period: string;
  entries: number;
  exits: number;
  balance: number;
}

const highRotationData: RotationData[] = [];
const lowRotationData: RotationData[] = [];
const consumptionData: ConsumptionData[] = [];

export default function ReportsPage() {
  const { data: productsData } = useProducts();
  const productList: Producto[] = Array.isArray(productsData) ? productsData : (productsData && typeof productsData === 'object' && 'data' in productsData ? (productsData as { data: Producto[] }).data : []);

  // Calculate real stock vs demand using products
  const stockVsDemandData = productList.map(p => ({
    product: p.nombre,
    stock: p.stockActual,
    demand: p.stockMinimo, // Proxy for demand
    coverage: p.stockActual > 0 ? (p.stockActual / (p.stockMinimo || 1)).toFixed(1) + "x" : "0"
  }));
  const [periodFilter, setPeriodFilter] = useState("30");
  const [selectedReport, setSelectedReport] = useState<ReportType | null>(null);

  const exportToCSV = (reportId: ReportType) => {
    // In a real app, this would generate and download a CSV file
    alert(`Exportando reporte: ${reportId}`);
  };

  const renderReportContent = (reportId: ReportType) => {
    switch (reportId) {
      case "high_rotation":
        return (
          <Table>
            <TableHeader>
              <TableRow className="border-border/50">
                <TableHead className="text-muted-foreground">
                  Producto
                </TableHead>
                <TableHead className="text-muted-foreground text-center">
                  Código
                </TableHead>
                <TableHead className="text-muted-foreground text-center">
                  Movimientos
                </TableHead>
                <TableHead className="text-muted-foreground text-center">
                  % Rotación
                </TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {highRotationData.map((item, index) => (
                <TableRow key={index} className="border-border/50">
                  <TableCell className="font-medium">{item.product}</TableCell>
                  <TableCell className="text-center font-mono text-muted-foreground">
                    {item.code}
                  </TableCell>
                  <TableCell className="text-center">
                    {item.movements}
                  </TableCell>
                  <TableCell className="text-center">
                    <Badge className="bg-success/10 text-success border-success/20">
                      {item.percentage}%
                    </Badge>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        );

      case "low_rotation":
        return (
          <Table>
            <TableHeader>
              <TableRow className="border-border/50">
                <TableHead className="text-muted-foreground">
                  Producto
                </TableHead>
                <TableHead className="text-muted-foreground text-center">
                  Código
                </TableHead>
                <TableHead className="text-muted-foreground text-center">
                  Movimientos
                </TableHead>
                <TableHead className="text-muted-foreground text-center">
                  Días sin movimiento
                </TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {lowRotationData.map((item, index) => (
                <TableRow key={index} className="border-border/50">
                  <TableCell className="font-medium">{item.product}</TableCell>
                  <TableCell className="text-center font-mono text-muted-foreground">
                    {item.code}
                  </TableCell>
                  <TableCell className="text-center">
                    {item.movements}
                  </TableCell>
                  <TableCell className="text-center">
                    <Badge className="bg-warning/10 text-warning border-warning/20">
                      {item.daysWithoutMovement} días
                    </Badge>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        );

      case "consumption":
        return (
          <Table>
            <TableHeader>
              <TableRow className="border-border/50">
                <TableHead className="text-muted-foreground">Período</TableHead>
                <TableHead className="text-muted-foreground text-center">
                  Entradas
                </TableHead>
                <TableHead className="text-muted-foreground text-center">
                  Salidas
                </TableHead>
                <TableHead className="text-muted-foreground text-center">
                  Balance
                </TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {consumptionData.map((item, index) => (
                <TableRow key={index} className="border-border/50">
                  <TableCell className="font-medium">{item.period}</TableCell>
                  <TableCell className="text-center text-success">
                    +{item.entries}
                  </TableCell>
                  <TableCell className="text-center text-critical">
                    -{item.exits}
                  </TableCell>
                  <TableCell className="text-center">
                    <Badge
                      className={cn(
                        "border",
                        item.balance >= 0
                          ? "bg-success/10 text-success border-success/20"
                          : "bg-critical/10 text-critical border-critical/20",
                      )}
                    >
                      {item.balance >= 0 ? "+" : ""}
                      {item.balance}
                    </Badge>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        );

      case "stock_vs_demand":
        return (
          <Table>
            <TableHeader>
              <TableRow className="border-border/50">
                <TableHead className="text-muted-foreground">
                  Producto
                </TableHead>
                <TableHead className="text-muted-foreground text-center">
                  Stock Actual
                </TableHead>
                <TableHead className="text-muted-foreground text-center">
                  Demanda Proyectada
                </TableHead>
                <TableHead className="text-muted-foreground text-center">
                  Cobertura
                </TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {stockVsDemandData.map((item, index) => {
                const isCritical = parseFloat(item.coverage) < 2;
                return (
                  <TableRow key={index} className="border-border/50">
                    <TableCell className="font-medium">
                      {item.product}
                    </TableCell>
                    <TableCell className="text-center">{item.stock}</TableCell>
                    <TableCell className="text-center">{item.demand}</TableCell>
                    <TableCell className="text-center">
                      <Badge
                        className={cn(
                          "border",
                          isCritical
                            ? "bg-critical/10 text-critical border-critical/20"
                            : "bg-success/10 text-success border-success/20",
                        )}
                      >
                        {item.coverage}
                      </Badge>
                    </TableCell>
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
        );

      default:
        return null;
    }
  };

  return (
    <div className="space-y-6">
      {/* Page header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 animate-fade-in">
        <div>
          <h1 className="text-2xl font-bold text-foreground">Reportes</h1>
          <p className="text-muted-foreground mt-1">
            Genera y exporta reportes de inventario
          </p>
        </div>
        <Select value={periodFilter} onValueChange={setPeriodFilter}>
          <SelectTrigger className="w-full sm:w-48 bg-secondary/50 border-border/50">
            <Calendar className="w-4 h-4 mr-2 text-muted-foreground" />
            <SelectValue placeholder="Período" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="7">Últimos 7 días</SelectItem>
            <SelectItem value="30">Últimos 30 días</SelectItem>
            <SelectItem value="90">Últimos 90 días</SelectItem>
            <SelectItem value="365">Último año</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Reports Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {reports.map((report, index) => {
          const Icon = report.icon;
          return (
            <Card
              key={report.id}
              className="border-border/50 bg-card/80 backdrop-blur-sm hover:border-border transition-all animate-fade-in opacity-0"
              style={{
                animationDelay: `${100 + index * 100}ms`,
                animationFillMode: "forwards",
              }}
            >
              <CardHeader className="pb-2">
                <div className="flex items-start justify-between">
                  <div className="flex items-center gap-3">
                    <div
                      className={cn(
                        "w-10 h-10 rounded-xl flex items-center justify-center",
                        report.bg,
                      )}
                    >
                      <Icon className={cn("w-5 h-5", report.color)} />
                    </div>
                    <div>
                      <CardTitle className="text-lg">{report.title}</CardTitle>
                      <CardDescription className="mt-1">
                        {report.description}
                      </CardDescription>
                    </div>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="pt-4">
                <div className="flex gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    className="flex-1 bg-transparent"
                    onClick={() => setSelectedReport(report.id)}
                  >
                    <Eye className="w-4 h-4 mr-2" />
                    Visualizar
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    className="flex-1 bg-transparent"
                    onClick={() => exportToCSV(report.id)}
                  >
                    <Download className="w-4 h-4 mr-2" />
                    Exportar
                  </Button>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* Report Preview Dialog */}
      <Dialog
        open={selectedReport !== null}
        onOpenChange={() => setSelectedReport(null)}
      >
        <DialogContent className="max-w-4xl max-h-[80vh] overflow-auto">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <FileText className="w-5 h-5 text-primary" />
              {reports.find((r) => r.id === selectedReport)?.title}
            </DialogTitle>
            <DialogDescription>
              {reports.find((r) => r.id === selectedReport)?.description}
            </DialogDescription>
          </DialogHeader>
          <div className="mt-4">
            {selectedReport && renderReportContent(selectedReport)}
          </div>
          <div className="flex justify-end gap-2 mt-4">
            <Button variant="outline" onClick={() => setSelectedReport(null)}>
              Cerrar
            </Button>
            <Button
              className="bg-primary text-primary-foreground"
              onClick={() => selectedReport && exportToCSV(selectedReport)}
            >
              <Download className="w-4 h-4 mr-2" />
              Exportar CSV
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      {/* Quick Stats */}
      <Card
        className="border-border/50 bg-card/80 backdrop-blur-sm animate-fade-in opacity-0"
        style={{ animationDelay: "500ms", animationFillMode: "forwards" }}
      >
        <CardHeader>
          <CardTitle className="text-lg font-semibold">
            Resumen del Período
          </CardTitle>
          <CardDescription>
            Estadísticas de los últimos {periodFilter} días
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="p-4 rounded-xl bg-secondary/30 border border-border/30 text-center">
              <Package className="w-6 h-6 text-primary mx-auto mb-2" />
              <p className="text-2xl font-bold text-foreground">
                {productList.length}
              </p>
              <p className="text-xs text-muted-foreground">Total Productos</p>
            </div>
            <div className="p-4 rounded-xl bg-secondary/30 border border-border/30 text-center">
              <TrendingUp className="w-6 h-6 text-success mx-auto mb-2" />
              <p className="text-2xl font-bold text-foreground">156</p>
              <p className="text-xs text-muted-foreground">Entradas</p>
            </div>
            <div className="p-4 rounded-xl bg-secondary/30 border border-border/30 text-center">
              <TrendingDown className="w-6 h-6 text-critical mx-auto mb-2" />
              <p className="text-2xl font-bold text-foreground">142</p>
              <p className="text-xs text-muted-foreground">Salidas</p>
            </div>
            <div className="p-4 rounded-xl bg-secondary/30 border border-border/30 text-center">
              <BarChart3 className="w-6 h-6 text-primary mx-auto mb-2" />
              <p className="text-2xl font-bold text-foreground">+14</p>
              <p className="text-xs text-muted-foreground">Balance Neto</p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
