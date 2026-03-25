import {
  Area,
  AreaChart,
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
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";
import { useAllAnalysis } from "@/services/predictions/usePredictions";

export function ConsumptionChart() {
  const { data: analysis, isLoading } = useAllAnalysis();

  const chartData = (analysis ?? [])
    .sort((a, b) => b.promedio30d - a.promedio30d)
    .slice(0, 8)
    .map((p) => ({
      week: p.nombre,
      weekly: p.promedio30d,
      monthly: p.promedio60d,
    }));

  return (
    <Card
      className="border-border/50 bg-card/80 backdrop-blur-sm animate-fade-in opacity-0"
      style={{ animationDelay: "300ms", animationFillMode: "forwards" }}
    >
      <CardHeader>
        <CardTitle className="text-lg font-semibold">
          Consumo de Inventario
        </CardTitle>
        <CardDescription>
          Comparación de salidas semanales vs mensuales
        </CardDescription>
      </CardHeader>
      <CardContent>
        {isLoading ? (
          <p className="text-sm text-muted-foreground">Cargando...</p>
        ) : chartData.length === 0 ? (
          <p className="text-sm text-muted-foreground">
            No hay datos de consumo disponibles.
          </p>
        ) : (
          <ChartContainer
            config={{
              weekly: {
                label: "Prom. 30d",
                color: "oklch(0.75 0.15 195)",
              },
              monthly: {
                label: "Prom. 60d",
                color: "oklch(0.7 0.18 160)",
              },
            }}
            className="h-75"
          >
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart
                data={chartData}
                margin={{ top: 10, right: 10, left: 0, bottom: 0 }}
              >
                <defs>
                  <linearGradient id="colorWeekly" x1="0" y1="0" x2="0" y2="1">
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
                  <linearGradient id="colorMonthly" x1="0" y1="0" x2="0" y2="1">
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
                  dataKey="week"
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
                  dataKey="weekly"
                  stroke="oklch(0.75 0.15 195)"
                  strokeWidth={2}
                  fill="url(#colorWeekly)"
                  name="Prom. 30d"
                />
                <Area
                  type="monotone"
                  dataKey="monthly"
                  stroke="oklch(0.7 0.18 160)"
                  strokeWidth={2}
                  fill="url(#colorMonthly)"
                  name="Prom. 60d"
                />
              </AreaChart>
            </ResponsiveContainer>
          </ChartContainer>
        )}
      </CardContent>
    </Card>
  );
}
