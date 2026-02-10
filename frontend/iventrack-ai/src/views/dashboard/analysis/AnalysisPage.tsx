

import { useState } from "react";
import {
  TrendingUp,
  TrendingDown,
  Minus,
  Sparkles,
  BarChart3,
  Package,
  Target,
  Calendar,
} from "lucide-react";
import {
  Bar,
  BarChart,
  XAxis,
  YAxis,
  CartesianGrid,
  ResponsiveContainer,
  Area,
  AreaChart,
} from "recharts";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

import { cn } from "@/lib/utils";
import type { Product } from "@/types/dashboard";

// Mock historical consumption data
const consumptionHistory = [
  { period: "Ene", value: 120 },
  { period: "Feb", value: 145 },
  { period: "Mar", value: 132 },
  { period: "Abr", value: 168 },
  { period: "May", value: 155 },
  { period: "Jun", value: 189 },
  { period: "Jul", value: 176 },
  { period: "Ago", value: 198 },
];

// Mock prediction data
const predictionData = [
  { period: "Sep", actual: null, predicted: 205 },
  { period: "Oct", actual: null, predicted: 218 },
  { period: "Nov", actual: null, predicted: 235 },
  { period: "Dic", actual: null, predicted: 248 },
];

// Mock product analysis
const productAnalysis = [
  {
    id: "1",
    name: "Laptop Dell XPS 15",
    avg30: 8.5,
    avg60: 7.2,
    avg90: 6.8,
    trend: "up",
    rotation: "high",
    reorderPoint: 12,
  },
  {
    id: "2",
    name: 'Monitor Samsung 27"',
    avg30: 4.2,
    avg60: 5.1,
    avg90: 4.8,
    trend: "down",
    rotation: "medium",
    reorderPoint: 8,
  },
  {
    id: "3",
    name: "Teclado Mecánico RGB",
    avg30: 12.3,
    avg60: 11.8,
    avg90: 10.5,
    trend: "up",
    rotation: "high",
    reorderPoint: 25,
  },
  {
    id: "4",
    name: "Mouse Inalámbrico",
    avg30: 15.8,
    avg60: 14.2,
    avg90: 13.5,
    trend: "up",
    rotation: "high",
    reorderPoint: 30,
  },
  {
    id: "5",
    name: "Auriculares Bluetooth",
    avg30: 6.5,
    avg60: 7.2,
    avg90: 6.9,
    trend: "stable",
    rotation: "medium",
    reorderPoint: 15,
  },
  {
    id: "6",
    name: "Webcam HD 1080p",
    avg30: 3.2,
    avg60: 4.5,
    avg90: 3.8,
    trend: "down",
    rotation: "low",
    reorderPoint: 10,
  },
];

type PeriodFilter = "30" | "60" | "90";

export default function AnalysisPage() {
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
  const [periodFilter, setPeriodFilter] = useState<PeriodFilter>("30");

  const getTrendConfig = (trend: string) => {
    switch (trend) {
      case "up":
        return {
          icon: TrendingUp,
          color: "text-success",
          bg: "bg-success/10",
          label: "Ascendente",
        };
      case "down":
        return {
          icon: TrendingDown,
          color: "text-critical",
          bg: "bg-critical/10",
          label: "Descendente",
        };
      default:
        return {
          icon: Minus,
          color: "text-primary",
          bg: "bg-primary/10",
          label: "Estable",
        };
    }
  };

  const getRotationConfig = (rotation: string) => {
    switch (rotation) {
      case "high":
        return {
          color: "bg-success/10 text-success border-success/20",
          label: "Alta",
        };
      case "medium":
        return {
          color: "bg-warning/10 text-warning border-warning/20",
          label: "Media",
        };
      default:
        return {
          color: "bg-critical/10 text-critical border-critical/20",
          label: "Baja",
        };
    }
  };

  // Combine historical and predicted data for chart
  const combinedChartData = [
    ...consumptionHistory.map((d) => ({
      ...d,
      type: "actual",
      predicted: null,
    })),
    ...predictionData.map((d) => ({
      period: d.period,
      value: d.predicted,
      type: "predicted",
      predicted: d.predicted,
    })),
  ];

  return (
    <div className="space-y-6">
      {/* Page header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 animate-fade-in">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-2xl font-bold text-foreground">
              Análisis y Predicción
            </h1>
            <Badge className="bg-primary/10 text-primary border-primary/20">
              <Sparkles className="w-3 h-3 mr-1" />
              IA
            </Badge>
          </div>
          <p className="text-muted-foreground mt-1">
            Analiza el consumo y predice la demanda futura
          </p>
        </div>
        <Select
          value={periodFilter}
          onValueChange={(v) => setPeriodFilter(v as PeriodFilter)}
        >
          <SelectTrigger className="w-full sm:w-48 bg-secondary/50 border-border/50">
            <Calendar className="w-4 h-4 mr-2 text-muted-foreground" />
            <SelectValue placeholder="Período" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="30">Últimos 30 días</SelectItem>
            <SelectItem value="60">Últimos 60 días</SelectItem>
            <SelectItem value="90">Últimos 90 días</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Charts Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Consumption History Chart */}
        <Card
          className="border-border/50 bg-card/80 backdrop-blur-sm animate-fade-in opacity-0"
          style={{ animationDelay: "100ms", animationFillMode: "forwards" }}
        >
          <CardHeader>
            <CardTitle className="text-lg font-semibold flex items-center gap-2">
              <BarChart3 className="w-5 h-5 text-primary" />
              Consumo Histórico
            </CardTitle>
            <CardDescription>Unidades consumidas por período</CardDescription>
          </CardHeader>
          <CardContent>
            <ChartContainer
              config={{
                value: {
                  label: "Consumo",
                  color: "oklch(0.75 0.15 195)",
                },
              }}
              className="h-62.5"
            >
              <ResponsiveContainer width="100%" height="100%">
                <BarChart
                  data={consumptionHistory}
                  margin={{ top: 10, right: 10, left: 0, bottom: 0 }}
                >
                  <CartesianGrid
                    strokeDasharray="3 3"
                    stroke="oklch(0.28 0.01 260)"
                  />
                  <XAxis
                    dataKey="period"
                    stroke="oklch(0.65 0.02 260)"
                    fontSize={12}
                    tickLine={false}
                    axisLine={false}
                  />
                  <YAxis
                    stroke="oklch(0.65 0.02 260)"
                    fontSize={12}
                    tickLine={false}
                    axisLine={false}
                  />
                  <ChartTooltip content={<ChartTooltipContent />} />
                  <Bar
                    dataKey="value"
                    fill="oklch(0.75 0.15 195)"
                    radius={[4, 4, 0, 0]}
                    name="Consumo"
                  />
                </BarChart>
              </ResponsiveContainer>
            </ChartContainer>
          </CardContent>
        </Card>

        {/* Prediction Chart */}
        <Card
          className="border-border/50 bg-card/80 backdrop-blur-sm animate-fade-in opacity-0"
          style={{ animationDelay: "200ms", animationFillMode: "forwards" }}
        >
          <CardHeader>
            <CardTitle className="text-lg font-semibold flex items-center gap-2">
              <Sparkles className="w-5 h-5 text-primary" />
              Predicción de Demanda
            </CardTitle>
            <CardDescription>
              Proyección basada en análisis histórico
            </CardDescription>
          </CardHeader>
          <CardContent>
            <ChartContainer
              config={{
                value: {
                  label: "Actual",
                  color: "oklch(0.75 0.15 195)",
                },
                predicted: {
                  label: "Predicción",
                  color: "oklch(0.7 0.18 160)",
                },
              }}
              className="h-62.5"
            >
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart
                  data={combinedChartData}
                  margin={{ top: 10, right: 10, left: 0, bottom: 0 }}
                >
                  <defs>
                    <linearGradient
                      id="colorActual"
                      x1="0"
                      y1="0"
                      x2="0"
                      y2="1"
                    >
                      <stop
                        offset="5%"
                        stopColor="oklch(0.75 0.15 195)"
                        stopOpacity={0.3}
                      />
                      <stop
                        offset="95%"
                        stopColor="oklch(0.75 0.15 195)"
                        stopOpacity={0}
                      />
                    </linearGradient>
                    <linearGradient
                      id="colorPredicted"
                      x1="0"
                      y1="0"
                      x2="0"
                      y2="1"
                    >
                      <stop
                        offset="5%"
                        stopColor="oklch(0.7 0.18 160)"
                        stopOpacity={0.3}
                      />
                      <stop
                        offset="95%"
                        stopColor="oklch(0.7 0.18 160)"
                        stopOpacity={0}
                      />
                    </linearGradient>
                  </defs>
                  <CartesianGrid
                    strokeDasharray="3 3"
                    stroke="oklch(0.28 0.01 260)"
                  />
                  <XAxis
                    dataKey="period"
                    stroke="oklch(0.65 0.02 260)"
                    fontSize={12}
                    tickLine={false}
                    axisLine={false}
                  />
                  <YAxis
                    stroke="oklch(0.65 0.02 260)"
                    fontSize={12}
                    tickLine={false}
                    axisLine={false}
                  />
                  <ChartTooltip content={<ChartTooltipContent />} />
                  <Area
                    type="monotone"
                    dataKey="value"
                    stroke="oklch(0.75 0.15 195)"
                    strokeWidth={2}
                    fill="url(#colorActual)"
                    name="Actual"
                  />
                  <Area
                    type="monotone"
                    dataKey="predicted"
                    stroke="oklch(0.7 0.18 160)"
                    strokeWidth={2}
                    strokeDasharray="5 5"
                    fill="url(#colorPredicted)"
                    name="Predicción"
                  />
                </AreaChart>
              </ResponsiveContainer>
            </ChartContainer>
          </CardContent>
        </Card>
      </div>

      {/* Product Analysis Table */}
      <Card
        className="border-border/50 bg-card/80 backdrop-blur-sm animate-fade-in opacity-0"
        style={{ animationDelay: "300ms", animationFillMode: "forwards" }}
      >
        <CardHeader>
          <CardTitle className="text-lg font-semibold flex items-center gap-2">
            <Target className="w-5 h-5 text-primary" />
            Análisis por Producto
          </CardTitle>
          <CardDescription>
            Promedios móviles, tendencias y puntos de reorden calculados
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow className="hover:bg-transparent border-border/50">
                <TableHead className="text-muted-foreground">
                  Producto
                </TableHead>
                <TableHead className="text-muted-foreground text-center">
                  Prom. 30d
                </TableHead>
                <TableHead className="text-muted-foreground text-center">
                  Prom. 60d
                </TableHead>
                <TableHead className="text-muted-foreground text-center">
                  Prom. 90d
                </TableHead>
                <TableHead className="text-muted-foreground text-center">
                  Tendencia
                </TableHead>
                <TableHead className="text-muted-foreground text-center">
                  Rotación
                </TableHead>
                <TableHead className="text-muted-foreground text-center">
                  Punto Reorden
                </TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {productAnalysis.map((product, index) => {
                const trendConfig = getTrendConfig(product.trend);
                const rotationConfig = getRotationConfig(product.rotation);
                const TrendIcon = trendConfig.icon;

                return (
                  <TableRow
                    key={product.id}
                    className="border-border/50 hover:bg-secondary/30 transition-colors animate-fade-in opacity-0"
                    style={{
                      animationDelay: `${400 + index * 50}ms`,
                      animationFillMode: "forwards",
                    }}
                  >
                    <TableCell>
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center">
                          <Package className="w-4 h-4 text-primary" />
                        </div>
                        <span className="font-medium">{product.name}</span>
                      </div>
                    </TableCell>
                    <TableCell className="text-center font-mono">
                      <span
                        className={cn(
                          periodFilter === "30" && "text-primary font-bold",
                        )}
                      >
                        {product.avg30}
                      </span>
                    </TableCell>
                    <TableCell className="text-center font-mono">
                      <span
                        className={cn(
                          periodFilter === "60" && "text-primary font-bold",
                        )}
                      >
                        {product.avg60}
                      </span>
                    </TableCell>
                    <TableCell className="text-center font-mono">
                      <span
                        className={cn(
                          periodFilter === "90" && "text-primary font-bold",
                        )}
                      >
                        {product.avg90}
                      </span>
                    </TableCell>
                    <TableCell className="text-center">
                      <div
                        className={cn(
                          "inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium",
                          trendConfig.bg,
                          trendConfig.color,
                        )}
                      >
                        <TrendIcon className="w-3 h-3" />
                        {trendConfig.label}
                      </div>
                    </TableCell>
                    <TableCell className="text-center">
                      <Badge className={cn("border", rotationConfig.color)}>
                        {rotationConfig.label}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-center">
                      <div className="inline-flex items-center gap-1 px-3 py-1 rounded-full bg-secondary/50 text-foreground font-mono font-bold">
                        {product.reorderPoint}
                      </div>
                    </TableCell>
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      {/* AI Insights */}
      <Card
        className="border-border/50 bg-linear-to-brs from-primary/5 to-primary/10 backdrop-blur-sm animate-fade-in opacity-0"
        style={{ animationDelay: "500ms", animationFillMode: "forwards" }}
      >
        <CardHeader>
          <CardTitle className="text-lg font-semibold flex items-center gap-2">
            <Sparkles className="w-5 h-5 text-primary" />
            Insights de IA
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="p-4 rounded-xl bg-background/50 border border-border/50">
              <p className="text-sm text-muted-foreground mb-1">
                Demanda Proyectada
              </p>
              <p className="text-2xl font-bold text-foreground">+18%</p>
              <p className="text-xs text-success mt-1">
                para el próximo trimestre
              </p>
            </div>
            <div className="p-4 rounded-xl bg-background/50 border border-border/50">
              <p className="text-sm text-muted-foreground mb-1">
                Productos en Riesgo
              </p>
              <p className="text-2xl font-bold text-foreground">3</p>
              <p className="text-xs text-warning mt-1">
                requieren atención inmediata
              </p>
            </div>
            <div className="p-4 rounded-xl bg-background/50 border border-border/50">
              <p className="text-sm text-muted-foreground mb-1">
                Eficiencia de Stock
              </p>
              <p className="text-2xl font-bold text-foreground">87%</p>
              <p className="text-xs text-primary mt-1">
                sobre el objetivo mensual
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
