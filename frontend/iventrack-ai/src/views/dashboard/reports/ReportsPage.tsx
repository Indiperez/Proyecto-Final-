import { useState } from "react";
import {
  FileText,
  Download,
  TrendingUp,
  TrendingDown,
  Calendar,
  Package,
  BarChart3,
  Target,
  Eye,
  RefreshCw,
  AlertTriangle,
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
import { toast } from "sonner";
import { useProducts } from "@/services/products/useProducts";
import {
  useLowStockProducts,
  useHighRotationProducts,
  useLowRotationProducts,
  useReorderPointProducts,
} from "@/services/products/useProducts";
import type { Producto, PuntoReordenDto } from "@/types/api";

type ReportType =
  | "high_rotation"
  | "low_rotation"
  | "stock_bajo"
  | "reorder_point";

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
    id: "stock_bajo",
    title: "Stock Bajo",
    description: "Productos por debajo del stock mínimo requerido",
    icon: AlertTriangle,
    color: "text-critical",
    bg: "bg-critical/10",
  },
  {
    id: "reorder_point",
    title: "Punto de Reorden",
    description: "Productos que requieren reordenamiento según demanda",
    icon: Target,
    color: "text-primary",
    bg: "bg-primary/10",
  },
];

// ─── Reusable skeleton rows ──────────────────────────────────────────────────

function SkeletonRows({ cols }: { cols: number }) {
  return (
    <>
      {Array.from({ length: 3 }).map((_, i) => (
        <TableRow key={i} className="border-border/50">
          {Array.from({ length: cols }).map((_, j) => (
            <TableCell key={j}>
              <div className="h-4 bg-secondary/50 rounded animate-pulse" />
            </TableCell>
          ))}
        </TableRow>
      ))}
    </>
  );
}

function EmptyRow({ cols, message }: { cols: number; message: string }) {
  return (
    <TableRow className="border-border/50">
      <TableCell colSpan={cols} className="text-center text-muted-foreground py-8">
        {message}
      </TableCell>
    </TableRow>
  );
}

function ErrorRow({
  cols,
  onRetry,
}: {
  cols: number;
  onRetry: () => void;
}) {
  return (
    <TableRow className="border-border/50">
      <TableCell colSpan={cols} className="text-center py-8">
        <div className="flex flex-col items-center gap-3">
          <p className="text-sm text-critical">Error al cargar datos.</p>
          <Button variant="outline" size="sm" onClick={onRetry}>
            <RefreshCw className="w-3.5 h-3.5 mr-1.5" />
            Reintentar
          </Button>
        </div>
      </TableCell>
    </TableRow>
  );
}

// ─── Table renderers ─────────────────────────────────────────────────────────

function HighRotationTable({
  data,
  isLoading,
  isError,
  refetch,
}: {
  data: Producto[] | undefined;
  isLoading: boolean;
  isError: boolean;
  refetch: () => void;
}) {
  const COLS = 4;
  return (
    <Table>
      <TableHeader>
        <TableRow className="border-border/50">
          <TableHead className="text-muted-foreground">Producto</TableHead>
          <TableHead className="text-muted-foreground text-center">Stock actual</TableHead>
          <TableHead className="text-muted-foreground text-center">Stock mínimo</TableHead>
          <TableHead className="text-muted-foreground text-center">Fecha creación</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {isLoading ? (
          <SkeletonRows cols={COLS} />
        ) : isError ? (
          <ErrorRow cols={COLS} onRetry={refetch} />
        ) : !data || data.length === 0 ? (
          <EmptyRow cols={COLS} message="No hay productos en esta categoría" />
        ) : (
          data.map((p) => (
            <TableRow key={p.id} className="border-border/50">
              <TableCell className="font-medium">{p.nombre}</TableCell>
              <TableCell className="text-center font-mono">{p.stockActual}</TableCell>
              <TableCell className="text-center font-mono text-muted-foreground">{p.stockMinimo}</TableCell>
              <TableCell className="text-center text-muted-foreground">
                {new Date(p.fechaDeCreacion).toLocaleDateString("es-MX")}
              </TableCell>
            </TableRow>
          ))
        )}
      </TableBody>
    </Table>
  );
}

function LowRotationTable({
  data,
  isLoading,
  isError,
  refetch,
}: {
  data: Producto[] | undefined;
  isLoading: boolean;
  isError: boolean;
  refetch: () => void;
}) {
  const COLS = 4;
  return (
    <Table>
      <TableHeader>
        <TableRow className="border-border/50">
          <TableHead className="text-muted-foreground">Producto</TableHead>
          <TableHead className="text-muted-foreground text-center">Stock actual</TableHead>
          <TableHead className="text-muted-foreground text-center">Stock mínimo</TableHead>
          <TableHead className="text-muted-foreground text-center">Fecha creación</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {isLoading ? (
          <SkeletonRows cols={COLS} />
        ) : isError ? (
          <ErrorRow cols={COLS} onRetry={refetch} />
        ) : !data || data.length === 0 ? (
          <EmptyRow cols={COLS} message="No hay productos en esta categoría" />
        ) : (
          data.map((p) => (
            <TableRow key={p.id} className="border-border/50">
              <TableCell className="font-medium">{p.nombre}</TableCell>
              <TableCell className="text-center font-mono">{p.stockActual}</TableCell>
              <TableCell className="text-center font-mono text-muted-foreground">{p.stockMinimo}</TableCell>
              <TableCell className="text-center text-muted-foreground">
                {new Date(p.fechaDeCreacion).toLocaleDateString("es-MX")}
              </TableCell>
            </TableRow>
          ))
        )}
      </TableBody>
    </Table>
  );
}

function LowStockTable({
  data,
  isLoading,
  isError,
  refetch,
}: {
  data: Producto[] | undefined;
  isLoading: boolean;
  isError: boolean;
  refetch: () => void;
}) {
  const COLS = 4;
  return (
    <Table>
      <TableHeader>
        <TableRow className="border-border/50">
          <TableHead className="text-muted-foreground">Producto</TableHead>
          <TableHead className="text-muted-foreground text-center">Stock actual</TableHead>
          <TableHead className="text-muted-foreground text-center">Stock mínimo</TableHead>
          <TableHead className="text-muted-foreground text-center">Diferencia</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {isLoading ? (
          <SkeletonRows cols={COLS} />
        ) : isError ? (
          <ErrorRow cols={COLS} onRetry={refetch} />
        ) : !data || data.length === 0 ? (
          <EmptyRow cols={COLS} message="No hay productos en esta categoría" />
        ) : (
          data.map((p) => {
            const diferencia = p.stockActual - p.stockMinimo;
            return (
              <TableRow key={p.id} className="border-border/50">
                <TableCell className="font-medium">{p.nombre}</TableCell>
                <TableCell className="text-center font-mono">{p.stockActual}</TableCell>
                <TableCell className="text-center font-mono text-muted-foreground">{p.stockMinimo}</TableCell>
                <TableCell className="text-center">
                  <span
                    className={cn(
                      "font-mono font-semibold",
                      diferencia < 0 ? "text-critical" : "text-success",
                    )}
                  >
                    {diferencia >= 0 ? "+" : ""}
                    {diferencia}
                  </span>
                </TableCell>
              </TableRow>
            );
          })
        )}
      </TableBody>
    </Table>
  );
}

function ReorderPointTable({
  data,
  isLoading,
  isError,
  refetch,
}: {
  data: PuntoReordenDto[] | undefined;
  isLoading: boolean;
  isError: boolean;
  refetch: () => void;
}) {
  const COLS = 6;
  return (
    <Table>
      <TableHeader>
        <TableRow className="border-border/50">
          <TableHead className="text-muted-foreground">Producto</TableHead>
          <TableHead className="text-muted-foreground text-center">Stock actual</TableHead>
          <TableHead className="text-muted-foreground text-center">Stock mínimo</TableHead>
          <TableHead className="text-muted-foreground text-center">Punto reorden</TableHead>
          <TableHead className="text-muted-foreground text-center">Lead time</TableHead>
          <TableHead className="text-muted-foreground text-center">Acción</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {isLoading ? (
          <SkeletonRows cols={COLS} />
        ) : isError ? (
          <ErrorRow cols={COLS} onRetry={refetch} />
        ) : !data || data.length === 0 ? (
          <EmptyRow cols={COLS} message="No hay productos en esta categoría" />
        ) : (
          data.map((p) => (
            <TableRow key={p.productoId} className="border-border/50">
              <TableCell className="font-medium">{p.producto}</TableCell>
              <TableCell className="text-center font-mono">{p.stockActual}</TableCell>
              <TableCell className="text-center font-mono text-muted-foreground">{p.stockMinimo}</TableCell>
              <TableCell className="text-center font-mono">{p.puntoReorden}</TableCell>
              <TableCell className="text-center text-muted-foreground">
                {p.tiempoEntregaDias}d
              </TableCell>
              <TableCell className="text-center">
                {p.reordenar ? (
                  <Badge className="bg-critical/10 text-critical border-critical/20 border">
                    Reordenar ya
                  </Badge>
                ) : (
                  <Badge className="bg-success/10 text-success border-success/20 border">
                    OK
                  </Badge>
                )}
              </TableCell>
            </TableRow>
          ))
        )}
      </TableBody>
    </Table>
  );
}

// ─── Page ────────────────────────────────────────────────────────────────────

export default function ReportsPage() {
  const [periodFilter, setPeriodFilter] = useState("30");
  const [selectedReport, setSelectedReport] = useState<ReportType | null>(null);

  const { data: productsData } = useProducts();
  const productList: Producto[] = Array.isArray(productsData) ? productsData : [];

  const {
    data: highRotationData,
    isLoading: loadingHigh,
    isError: errorHigh,
    refetch: refetchHigh,
  } = useHighRotationProducts();

  const {
    data: lowRotationData,
    isLoading: loadingLow,
    isError: errorLow,
    refetch: refetchLow,
  } = useLowRotationProducts();

  const {
    data: lowStockData,
    isLoading: loadingStock,
    isError: errorStock,
    refetch: refetchStock,
  } = useLowStockProducts();

  const {
    data: reorderData,
    isLoading: loadingReorder,
    isError: errorReorder,
    refetch: refetchReorder,
  } = useReorderPointProducts();

  const exportToCSV = (reportId: ReportType) => {
    let rows: string[][] = [];
    let filename = "";

    switch (reportId) {
      case "high_rotation":
        if (!highRotationData?.length) {
          toast.error("No hay datos para exportar");
          return;
        }
        filename = "reporte-alta-rotacion.csv";
        rows = [
          ["Producto", "Stock Actual", "Stock Mínimo", "Fecha Creación"],
          ...highRotationData.map((p) => [
            p.nombre,
            p.stockActual.toString(),
            p.stockMinimo.toString(),
            new Date(p.fechaDeCreacion).toLocaleDateString("es-MX"),
          ]),
        ];
        break;

      case "low_rotation":
        if (!lowRotationData?.length) {
          toast.error("No hay datos para exportar");
          return;
        }
        filename = "reporte-baja-rotacion.csv";
        rows = [
          ["Producto", "Stock Actual", "Stock Mínimo", "Fecha Creación"],
          ...lowRotationData.map((p) => [
            p.nombre,
            p.stockActual.toString(),
            p.stockMinimo.toString(),
            new Date(p.fechaDeCreacion).toLocaleDateString("es-MX"),
          ]),
        ];
        break;

      case "stock_bajo":
        if (!lowStockData?.length) {
          toast.error("No hay datos para exportar");
          return;
        }
        filename = "reporte-stock-bajo.csv";
        rows = [
          ["Producto", "Stock Actual", "Stock Mínimo", "Diferencia"],
          ...lowStockData.map((p) => [
            p.nombre,
            p.stockActual.toString(),
            p.stockMinimo.toString(),
            (p.stockActual - p.stockMinimo).toString(),
          ]),
        ];
        break;

      case "reorder_point":
        if (!reorderData?.length) {
          toast.error("No hay datos para exportar");
          return;
        }
        filename = "reporte-punto-reorden.csv";
        rows = [
          [
            "Producto",
            "Stock Actual",
            "Stock Mínimo",
            "Punto Reorden",
            "Lead Time",
            "Reordenar",
          ],
          ...reorderData.map((p) => [
            p.producto,
            p.stockActual.toString(),
            p.stockMinimo.toString(),
            p.puntoReorden.toString(),
            `${p.tiempoEntregaDias}d`,
            p.reordenar ? "Sí" : "No",
          ]),
        ];
        break;
    }

    const csv = rows.map((r) => r.map((c) => `"${c}"`).join(",")).join("\n");
    const blob = new Blob(["\uFEFF" + csv], {
      type: "text/csv;charset=utf-8;",
    });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = filename;
    link.click();
    URL.revokeObjectURL(url);
    toast.success(`Reporte exportado: ${filename}`);
  };

  const renderReportContent = (reportId: ReportType) => {
    switch (reportId) {
      case "high_rotation":
        return (
          <HighRotationTable
            data={highRotationData ?? undefined}
            isLoading={loadingHigh}
            isError={errorHigh}
            refetch={refetchHigh}
          />
        );
      case "low_rotation":
        return (
          <LowRotationTable
            data={lowRotationData ?? undefined}
            isLoading={loadingLow}
            isError={errorLow}
            refetch={refetchLow}
          />
        );
      case "stock_bajo":
        return (
          <LowStockTable
            data={lowStockData ?? undefined}
            isLoading={loadingStock}
            isError={errorStock}
            refetch={refetchStock}
          />
        );
      case "reorder_point":
        return (
          <ReorderPointTable
            data={reorderData ?? undefined}
            isLoading={loadingReorder}
            isError={errorReorder}
            refetch={refetchReorder}
          />
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
              <p className="text-2xl font-bold text-foreground">
                {loadingHigh ? "—" : (highRotationData?.length ?? 0)}
              </p>
              <p className="text-xs text-muted-foreground">Alta Rotación</p>
            </div>
            <div className="p-4 rounded-xl bg-secondary/30 border border-border/30 text-center">
              <TrendingDown className="w-6 h-6 text-critical mx-auto mb-2" />
              <p className="text-2xl font-bold text-foreground">
                {loadingStock ? "—" : (lowStockData?.length ?? 0)}
              </p>
              <p className="text-xs text-muted-foreground">Stock Bajo</p>
            </div>
            <div className="p-4 rounded-xl bg-secondary/30 border border-border/30 text-center">
              <BarChart3 className="w-6 h-6 text-primary mx-auto mb-2" />
              <p className="text-2xl font-bold text-foreground">
                {loadingReorder
                  ? "—"
                  : (reorderData?.filter((p) => p.reordenar).length ?? 0)}
              </p>
              <p className="text-xs text-muted-foreground">Reordenar</p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
