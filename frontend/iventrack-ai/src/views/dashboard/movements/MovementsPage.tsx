import { useState } from "react";
import { useCreateMovement, useMovements } from "@/services/movements/useMovements";
import { useProducts } from "@/services/products/useProducts";
import { Button } from "@/components/ui/button";
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
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
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
    Plus,
    CalendarDays,
    ArrowDownCircle,
    ArrowUpCircle,
    Search,
    Package,
} from "lucide-react";
import { cn } from "@/lib/utils";
import type { TipoMovimiento, Producto, MovimientoResponse } from "@/types/api";

// ─── Types ────────────────────────────────────────────────────────────────────

interface MovementFormData {
    productoId: number;
    tipo: TipoMovimiento;
    cantidad: number;
    observacion: string;
}

// ─── Tipo helpers ─────────────────────────────────────────────────────────────

function getTipoConfig(tipo: TipoMovimiento) {
    switch (tipo) {
        case "Entrada":
            return {
                badge: "bg-success/10 text-success border-success/20",
                dot: "bg-success",
                qty: (n: number) => ({ text: `+${n}`, cls: "text-success" }),
            };
        case "Salida":
            return {
                badge: "bg-critical/10 text-critical border-critical/20",
                dot: "bg-critical",
                qty: (n: number) => ({ text: `-${n}`, cls: "text-critical" }),
            };
        default: // Ajuste
            return {
                badge: "bg-warning/10 text-warning border-warning/20",
                dot: "bg-warning",
                qty: (n: number) => ({ text: `${n}`, cls: "text-warning" }),
            };
    }
}

// ─── Page ─────────────────────────────────────────────────────────────────────

export default function MovementsPage() {
    const [isCreateOpen, setIsCreateOpen] = useState(false);
    const [searchQuery, setSearchQuery] = useState("");
    const [tipoFilter, setTipoFilter] = useState("todos");

    // Queries
    const { data: products } = useProducts();

    // Mutations
    const createMutation = useCreateMovement();

    const [formData, setFormData] = useState<MovementFormData>({
        productoId: 0,
        tipo: "Entrada",
        cantidad: 0,
        observacion: "",
    });

    const resetForm = () => {
        setFormData({
            productoId: 0,
            tipo: "Entrada",
            cantidad: 0,
            observacion: "",
        });
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();

        if (formData.productoId === 0) return;

        createMutation.mutate(formData, {
            onSuccess: () => {
                setIsCreateOpen(false);
                resetForm();
            },
        });
    };

    // Real movement data
    const { data: movementsData, isLoading: isLoadingMovements } = useMovements();
    const allMovements: MovimientoResponse[] = Array.isArray(movementsData)
        ? movementsData
        : [];

    // KPI calculations
    const todayStr = new Date().toISOString().split("T")[0];
    const movimientosHoy = allMovements.filter(
        (m) => new Date(m.fecha).toISOString().split("T")[0] === todayStr,
    ).length;
    const totalEntradas = allMovements.filter((m) => m.tipo === "Entrada").length;
    const totalSalidas = allMovements.filter((m) => m.tipo === "Salida").length;

    // Client-side filtering
    const filteredMovements = allMovements.filter((m) => {
        const matchesSearch = searchQuery === "" ||
            m.nombreProducto.toLowerCase().includes(searchQuery.toLowerCase());
        const matchesTipo = tipoFilter === "todos" || m.tipo === tipoFilter;
        return matchesSearch && matchesTipo;
    });

    return (
        <div className="space-y-6">
            {/* ── Header ─────────────────────────────────────────────────── */}
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 animate-fade-in">
                <div>
                    <h1 className="text-2xl font-bold text-foreground">
                        Movimientos de Inventario
                    </h1>
                    <p className="text-muted-foreground mt-1">
                        Registra entradas, salidas y ajustes de stock
                    </p>
                </div>

                <Dialog
                    open={isCreateOpen}
                    onOpenChange={(open) => {
                        setIsCreateOpen(open);
                        if (!open) resetForm();
                    }}
                >
                    <DialogTrigger asChild>
                        <Button className="gap-2">
                            <Plus className="w-4 h-4" />
                            Registrar Movimiento
                        </Button>
                    </DialogTrigger>
                    <DialogContent>
                        <DialogHeader>
                            <DialogTitle>Registrar Movimiento</DialogTitle>
                        </DialogHeader>
                        <form onSubmit={handleSubmit} className="space-y-4">
                            <div>
                                <Label htmlFor="producto">Producto *</Label>
                                <Select
                                    value={formData.productoId === 0 ? "" : formData.productoId.toString()}
                                    onValueChange={(value) =>
                                        setFormData({ ...formData, productoId: parseInt(value) })
                                    }
                                >
                                    <SelectTrigger>
                                        <SelectValue placeholder="Seleccionar producto" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        {products?.map((product: Producto) => (
                                            <SelectItem
                                                key={product.id}
                                                value={product.id.toString()}
                                            >
                                                {product.nombre} (Stock: {product.stockActual})
                                            </SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                            </div>

                            <div>
                                <Label htmlFor="tipo">Tipo de Movimiento *</Label>
                                <Select
                                    value={formData.tipo}
                                    onValueChange={(value) =>
                                        setFormData({
                                            ...formData,
                                            tipo: value as TipoMovimiento,
                                        })
                                    }
                                >
                                    <SelectTrigger>
                                        <SelectValue />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="Entrada">Entrada (Agregar Stock)</SelectItem>
                                        <SelectItem value="Salida">Salida (Restar Stock)</SelectItem>
                                        <SelectItem value="Ajuste">Ajuste (Establecer Stock Exacto)</SelectItem>
                                    </SelectContent>
                                </Select>
                            </div>

                            <div>
                                <Label htmlFor="cantidad">Cantidad *</Label>
                                <Input
                                    id="cantidad"
                                    type="number"
                                    min="1"
                                    value={formData.cantidad}
                                    onChange={(e) =>
                                        setFormData({
                                            ...formData,
                                            cantidad: parseInt(e.target.value) || 0,
                                        })
                                    }
                                    required
                                />
                            </div>

                            <div>
                                <Label htmlFor="observacion">Observación</Label>
                                <Textarea
                                    id="observacion"
                                    value={formData.observacion}
                                    onChange={(e) =>
                                        setFormData({ ...formData, observacion: e.target.value })
                                    }
                                    placeholder="Ej: Compra a proveedor, Venta al cliente..."
                                />
                            </div>

                            <div className="flex justify-end gap-2">
                                <Button
                                    type="button"
                                    variant="outline"
                                    onClick={() => setIsCreateOpen(false)}
                                >
                                    Cancelar
                                </Button>
                                <Button type="submit" disabled={createMutation.isPending}>
                                    {createMutation.isPending ? "Registrando..." : "Registrar"}
                                </Button>
                            </div>
                        </form>
                    </DialogContent>
                </Dialog>
            </div>

            {/* ── KPI Cards ──────────────────────────────────────────────── */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <Card
                    className="border-border/50 bg-card/80 backdrop-blur-sm animate-fade-in opacity-0"
                    style={{ animationDelay: "100ms", animationFillMode: "forwards" }}
                >
                    <CardContent className="pt-6">
                        <div className="flex items-center gap-4">
                            <div className="w-10 h-10 rounded-xl bg-cyan-500/10 flex items-center justify-center shrink-0">
                                <CalendarDays className="w-5 h-5 text-cyan-500" />
                            </div>
                            <div>
                                <p className="text-2xl font-bold text-foreground">{isLoadingMovements ? "—" : movimientosHoy}</p>
                                <p className="text-sm text-muted-foreground">Movimientos hoy</p>
                            </div>
                        </div>
                    </CardContent>
                </Card>

                <Card
                    className="border-border/50 bg-card/80 backdrop-blur-sm animate-fade-in opacity-0"
                    style={{ animationDelay: "200ms", animationFillMode: "forwards" }}
                >
                    <CardContent className="pt-6">
                        <div className="flex items-center gap-4">
                            <div className="w-10 h-10 rounded-xl bg-success/10 flex items-center justify-center shrink-0">
                                <ArrowDownCircle className="w-5 h-5 text-success" />
                            </div>
                            <div>
                                <p className="text-2xl font-bold text-foreground">{isLoadingMovements ? "—" : totalEntradas}</p>
                                <p className="text-sm text-muted-foreground">Total Entradas</p>
                            </div>
                        </div>
                    </CardContent>
                </Card>

                <Card
                    className="border-border/50 bg-card/80 backdrop-blur-sm animate-fade-in opacity-0"
                    style={{ animationDelay: "300ms", animationFillMode: "forwards" }}
                >
                    <CardContent className="pt-6">
                        <div className="flex items-center gap-4">
                            <div className="w-10 h-10 rounded-xl bg-critical/10 flex items-center justify-center shrink-0">
                                <ArrowUpCircle className="w-5 h-5 text-critical" />
                            </div>
                            <div>
                                <p className="text-2xl font-bold text-foreground">{isLoadingMovements ? "—" : totalSalidas}</p>
                                <p className="text-sm text-muted-foreground">Total Salidas</p>
                            </div>
                        </div>
                    </CardContent>
                </Card>
            </div>

            {/* ── Search + Filter Bar ────────────────────────────────────── */}
            <div
                className="flex flex-col sm:flex-row gap-3 animate-fade-in opacity-0"
                style={{ animationDelay: "350ms", animationFillMode: "forwards" }}
            >
                <div className="relative flex-1">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground pointer-events-none" />
                    <Input
                        className="pl-9 bg-secondary/50 border-border/50"
                        placeholder="Buscar por producto..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                    />
                </div>
                <Select value={tipoFilter} onValueChange={setTipoFilter}>
                    <SelectTrigger className="w-full sm:w-48 bg-secondary/50 border-border/50">
                        <SelectValue placeholder="Todos los tipos" />
                    </SelectTrigger>
                    <SelectContent>
                        <SelectItem value="todos">Todos los tipos</SelectItem>
                        <SelectItem value="Entrada">Entrada</SelectItem>
                        <SelectItem value="Salida">Salida</SelectItem>
                        <SelectItem value="Ajuste">Ajuste</SelectItem>
                    </SelectContent>
                </Select>
            </div>

            {/* ── Movements Table ────────────────────────────────────────── */}
            <Card
                className="border-border/50 bg-card/80 backdrop-blur-sm animate-fade-in opacity-0"
                style={{ animationDelay: "400ms", animationFillMode: "forwards" }}
            >
                <Table>
                    <TableHeader>
                        <TableRow className="hover:bg-transparent border-border/50">
                            <TableHead className="text-muted-foreground">Fecha</TableHead>
                            <TableHead className="text-muted-foreground">Producto</TableHead>
                            <TableHead className="text-muted-foreground text-center">Tipo</TableHead>
                            <TableHead className="text-muted-foreground text-center">Cantidad</TableHead>
                            <TableHead className="text-muted-foreground">Observación</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {/* Loading skeleton */}
                        {isLoadingMovements && Array.from({ length: 5 }).map((_, i) => (
                            <TableRow key={i} className="border-border/50">
                                {Array.from({ length: 5 }).map((_, j) => (
                                    <TableCell key={j}>
                                        <div className="h-4 rounded bg-secondary/50 animate-pulse" />
                                    </TableCell>
                                ))}
                            </TableRow>
                        ))}

                        {/* Empty state */}
                        {!isLoadingMovements && filteredMovements.length === 0 && (
                            <TableRow className="hover:bg-transparent border-border/50">
                                <TableCell colSpan={5} className="py-16 text-center">
                                    <div className="flex flex-col items-center gap-3">
                                        <div className="w-12 h-12 rounded-full bg-secondary/50 flex items-center justify-center">
                                            <Package className="w-6 h-6 text-muted-foreground" />
                                        </div>
                                        <p className="text-sm font-medium text-foreground">
                                            No hay movimientos registrados
                                        </p>
                                        <p className="text-xs text-muted-foreground">
                                            Registra un movimiento usando el botón superior
                                        </p>
                                    </div>
                                </TableCell>
                            </TableRow>
                        )}

                        {/* Data rows */}
                        {!isLoadingMovements && filteredMovements.map((mov: MovimientoResponse, index: number) => {
                            const cfg = getTipoConfig(mov.tipo);
                            const qty = cfg.qty(mov.cantidad);
                            return (
                                <TableRow
                                    key={mov.id}
                                    className="border-border/50 hover:bg-secondary/30 transition-colors animate-fade-in opacity-0"
                                    style={{
                                        animationDelay: `${500 + index * 40}ms`,
                                        animationFillMode: "forwards",
                                    }}
                                >
                                    <TableCell className="font-mono text-sm text-muted-foreground">
                                        {new Date(mov.fecha).toISOString().split("T")[0]}
                                    </TableCell>
                                    <TableCell>
                                        <div className="flex items-center gap-2">
                                            <div className={cn("w-2.5 h-2.5 rounded-full shrink-0", cfg.dot)} />
                                            <span className="text-sm font-medium text-foreground">
                                                {mov.nombreProducto}
                                            </span>
                                        </div>
                                    </TableCell>
                                    <TableCell className="text-center">
                                        <Badge className={cn("border text-xs", cfg.badge)}>
                                            {mov.tipo}
                                        </Badge>
                                    </TableCell>
                                    <TableCell className={cn("text-center font-mono font-semibold", qty.cls)}>
                                        {qty.text}
                                    </TableCell>
                                    <TableCell className="text-sm text-muted-foreground max-w-60 truncate">
                                        {mov.observacion || "—"}
                                    </TableCell>
                                </TableRow>
                            );
                        })}
                    </TableBody>
                </Table>
            </Card>
        </div>
    );
}
