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

const consumptionData = [
  { week: "Sem 1", weekly: 45, monthly: 180 },
  { week: "Sem 2", weekly: 52, monthly: 195 },
  { week: "Sem 3", weekly: 38, monthly: 165 },
  { week: "Sem 4", weekly: 65, monthly: 220 },
  { week: "Sem 5", weekly: 48, monthly: 185 },
  { week: "Sem 6", weekly: 72, monthly: 245 },
  { week: "Sem 7", weekly: 58, monthly: 210 },
  { week: "Sem 8", weekly: 43, monthly: 175 },
];

export function ConsumptionChart() {
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
        <ChartContainer
          config={{
            weekly: {
              label: "Semanal",
              color: "oklch(0.75 0.15 195)",
            },
            monthly: {
              label: "Mensual",
              color: "oklch(0.7 0.18 160)",
            },
          }}
          className="h-75"
        >
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart
              data={consumptionData}
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
                name="Semanal"
              />
              <Area
                type="monotone"
                dataKey="monthly"
                stroke="oklch(0.7 0.18 160)"
                strokeWidth={2}
                fill="url(#colorMonthly)"
                name="Mensual"
              />
            </AreaChart>
          </ResponsiveContainer>
        </ChartContainer>
      </CardContent>
    </Card>
  );
}
