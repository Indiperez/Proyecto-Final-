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
  RefreshCw,
} from "lucide-react";
import {
  Bar,
  BarChart,
  XAxis,
  YAxis,
  CartesianGrid,
  ResponsiveContainer,
} from "recharts";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
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
import { useProducts } from "@/services/products/useProducts";
import {
  useAllAnalysis,
  usePrediction,
  useRecalculatePrediction,
} from "@/services/predictions/usePredictions";
import type { ProductoAnalisis } from "@/types/api";

type PeriodFilter = "30" | "60";

const getTrendConfig = (trend: ProductoAnalisis["tendencia"]) => {
  switch (trend) {
    case "Sube":
      return {
        icon: TrendingUp,
        color: "text-success",
        bg: "bg-success/10",
        label: "Ascendente",
      };
    case "Baja":
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

const getRotationConfig = (rotation: ProductoAnalisis["rotacion"]) => {
  switch (rotation) {
    case "Alta":
      return { color: "bg-success/10 text-success border-success/20", label: "Alta" };
    case "Media":
      return { color: "bg-warning/10 text-warning border-warning/20", label: "Media" };
    default:
      return { color: "bg-critical/10 text-critical border-critical/20", label: "Baja" };
  }
};

export default function AnalysisPage() {
  const [periodFilter, setPeriodFilter] = useState<PeriodFilter>("30");
  const [selectedProductId, setSelectedProductId] = useState<number | null>(null);

  const { data: products } = useProducts();

  const {
    data: analysisData,
    isLoading: isAnalysisLoading,
    isError: isAnalysisError,
    refetch: refetchAnalysis,
  } = useAllAnalysis();

  const {
    data: prediction,
    isLoading: isPredictionLoading,
  } = usePrediction(selectedProductId ?? 0);

  const { mutate: recalculate, isPending: isRecalculating } =
    useRecalculatePrediction();

  const productList = Array.isArray(products) ? products : [];
  const analysisList: ProductoAnalisis[] = analysisData ?? [];

  // Bar chart: top 8 by selected period
  const barData = analysisList
    .sort((a, b) =>
      periodFilter === "60"
        ? (b.promedio60d ?? 0) - (a.promedio60d ?? 0)
        : (b.promedio30d ?? 0) - (a.promedio30d ?? 0),
    )
    .slice(0, 8)
    .map((p) => ({
      period: p.nombre.length > 10 ? p.nombre.substring(0, 10) + "..." : p.nombre,
      value: periodFilter === "60" ? (p.promedio60d ?? 0) : (p.promedio30d ?? 0),
    }));

  // Derived insights from real data
  const atRiskCount = analysisList.filter(
    (a) => a.stockActual <= a.puntoReorden,
  ).length;
  const highRotationCount = analysisList.filter((p) => p.rotacion === "Alta").length;
  const efficiencyPct =
    analysisList.length > 0
      ? Math.round((highRotationCount / analysisList.length) * 100)
      : 0;
  const totalDemand30d = analysisList.reduce(
    (sum, p) => sum + (p.demandaEstimada30Dias ?? 0),
    0,
  );

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
              Consumo por Producto
            </CardTitle>
            <CardDescription>
              Promedio de salidas — top 8 productos ({periodFilter}d)
            </CardDescription>
          </CardHeader>
          <CardContent>
            {isAnalysisLoading ? (
              <p className="text-sm text-muted-foreground py-8 text-center">
                Cargando...
              </p>
            ) : barData.length === 0 ? (
              <p className="text-sm text-muted-foreground py-8 text-center">
                No hay datos de consumo disponibles.
              </p>
            ) : (
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
                  data={barData}
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
            )}
          </CardContent>
        </Card>

        {/* Demand Prediction Card */}
        <Card
          className="border-border/50 bg-card/80 backdrop-blur-sm animate-fade-in opacity-0"
          style={{ animationDelay: "200ms", animationFillMode: "forwards" }}
        >
          <CardHeader>
            <div className="flex items-start justify-between gap-2">
              <div>
                <CardTitle className="text-lg font-semibold flex items-center gap-2">
                  <Sparkles className="w-5 h-5 text-primary" />
                  Predicción de Demanda
                </CardTitle>
                <CardDescription>
                  Proyección basada en análisis histórico
                </CardDescription>
              </div>
              {selectedProductId !== null && (
                <Button
                  variant="outline"
                  size="sm"
                  className="shrink-0"
                  disabled={isRecalculating}
                  onClick={() => recalculate(selectedProductId)}
                >
                  <RefreshCw
                    className={cn(
                      "w-3.5 h-3.5 mr-1.5",
                      isRecalculating && "animate-spin",
                    )}
                  />
                  Recalcular
                </Button>
              )}
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            {/* Product selector */}
            <Select
              value={selectedProductId?.toString() ?? ""}
              onValueChange={(v) => setSelectedProductId(Number(v))}
            >
              <SelectTrigger className="w-full bg-secondary/50 border-border/50">
                <Package className="w-4 h-4 mr-2 text-muted-foreground" />
                <SelectValue placeholder="Selecciona un producto..." />
              </SelectTrigger>
              <SelectContent>
                {productList.map((p) => (
                  <SelectItem key={p.id} value={p.id.toString()}>
                    {p.nombre}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            {/* Prediction metrics */}
            {selectedProductId === null ? (
              <p className="text-sm text-muted-foreground text-center py-8">
                Selecciona un producto para ver su predicción de demanda.
              </p>
            ) : isPredictionLoading ? (
              <p className="text-sm text-muted-foreground text-center py-8">
                Cargando...
              </p>
            ) : !prediction ? (
              <p className="text-sm text-muted-foreground text-center py-8">
                No hay predicción disponible para este producto.
              </p>
            ) : (
              <div className="grid grid-cols-2 gap-3">
                <div className="p-3 rounded-xl bg-secondary/40 border border-border/50">
                  <p className="text-xs text-muted-foreground mb-1">
                    Consumo diario prom.
                  </p>
                  <p className="text-xl font-bold font-mono">
                    {prediction.consumoDiarioPromedio.toFixed(1)}
                  </p>
                  <p className="text-xs text-muted-foreground">unidades/día</p>
                </div>
                <div className="p-3 rounded-xl bg-secondary/40 border border-border/50">
                  <p className="text-xs text-muted-foreground mb-1">
                    Demanda estimada 30d
                  </p>
                  <p className="text-xl font-bold font-mono">
                    {prediction.demandaEstimada30Dias.toFixed(0)}
                  </p>
                  <p className="text-xs text-muted-foreground">unidades</p>
                </div>
                <div className="p-3 rounded-xl bg-secondary/40 border border-border/50">
                  <p className="text-xs text-muted-foreground mb-1">
                    Punto de reorden
                  </p>
                  <p className="text-xl font-bold font-mono">
                    {prediction.puntoReorden}
                  </p>
                  <p className="text-xs text-muted-foreground">unidades</p>
                </div>
                <div className="p-3 rounded-xl bg-secondary/40 border border-border/50">
                  <p className="text-xs text-muted-foreground mb-2">
                    Tendencia
                  </p>
                  {(() => {
                    const cfg = getTrendConfig(prediction.tendencia);
                    const Icon = cfg.icon;
                    return (
                      <div
                        className={cn(
                          "inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium",
                          cfg.bg,
                          cfg.color,
                        )}
                      >
                        <Icon className="w-3 h-3" />
                        {cfg.label}
                      </div>
                    );
                  })()}
                  <p className="text-xs text-muted-foreground mt-2">
                    calc.{" "}
                    {new Date(prediction.calculadoEn).toLocaleDateString(
                      "es-MX",
                    )}
                  </p>
                </div>
              </div>
            )}
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
          {isAnalysisLoading ? (
            <p className="text-sm text-muted-foreground py-6 text-center">
              Cargando...
            </p>
          ) : isAnalysisError ? (
            <div className="flex flex-col items-center gap-3 py-6">
              <p className="text-sm text-critical">
                Error al cargar el análisis de productos.
              </p>
              <Button variant="outline" size="sm" onClick={() => refetchAnalysis()}>
                <RefreshCw className="w-3.5 h-3.5 mr-1.5" />
                Reintentar
              </Button>
            </div>
          ) : analysisList.length === 0 ? (
            <p className="text-sm text-muted-foreground py-6 text-center">
              No hay datos de análisis disponibles.
            </p>
          ) : (
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
                {analysisList.map((product, index) => {
                  const trendConfig = getTrendConfig(product.tendencia);
                  const rotationConfig = getRotationConfig(product.rotacion);
                  const TrendIcon = trendConfig.icon;

                  return (
                    <TableRow
                      key={product.productoId}
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
                          <span className="font-medium">{product.nombre}</span>
                        </div>
                      </TableCell>
                      <TableCell className="text-center font-mono">
                        <span
                          className={cn(
                            periodFilter === "30" && "text-primary font-bold",
                          )}
                        >
                          {product.promedio30d.toFixed(1)}
                        </span>
                      </TableCell>
                      <TableCell className="text-center font-mono">
                        <span
                          className={cn(
                            periodFilter === "60" && "text-primary font-bold",
                          )}
                        >
                          {product.promedio60d.toFixed(1)}
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
                          {product.puntoReorden}
                        </div>
                      </TableCell>
                    </TableRow>
                  );
                })}
              </TableBody>
            </Table>
          )}
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
                Demanda Total 30d
              </p>
              <p className="text-2xl font-bold text-foreground">
                {isAnalysisLoading ? "—" : totalDemand30d.toFixed(0)}
              </p>
              <p className="text-xs text-success mt-1">
                unidades proyectadas
              </p>
            </div>
            <div className="p-4 rounded-xl bg-background/50 border border-border/50">
              <p className="text-sm text-muted-foreground mb-1">
                Productos en Riesgo
              </p>
              <p className="text-2xl font-bold text-foreground">
                {isAnalysisLoading ? "—" : atRiskCount}
              </p>
              <p className="text-xs text-warning mt-1">
                requieren atención inmediata
              </p>
            </div>
            <div className="p-4 rounded-xl bg-background/50 border border-border/50">
              <p className="text-sm text-muted-foreground mb-1">
                Alta Rotación
              </p>
              <p className="text-2xl font-bold text-foreground">
                {isAnalysisLoading ? "—" : `${efficiencyPct}%`}
              </p>
              <p className="text-xs text-primary mt-1">
                de los productos activos
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
