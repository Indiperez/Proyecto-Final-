import { useState } from "react";
import {
  Plus,
  Search,
  ArrowUpCircle,
  ArrowDownCircle,
  RefreshCw,
  Filter,
  Calendar,
  Package,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
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
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { Card, CardContent } from "@/components/ui/card";
// import { useInventoryStore } from "@/lib/store";
import { cn } from "@/lib/utils";
import type { Movement, Product } from "@/types/dashboard";

type MovementType = "entry" | "exit" | "adjustment";

export default function MovementsPage() {
  //   const { products, movements, addMovement } = useInventoryStore();

  const movements: Movement[] = [
    {
      id: "1",
      productId: "1",
      type: "entry",
      quantity: 10,
      date: "2025-01-28",
      observation: "Recepción de pedido #1234",
    },
    {
      id: "2",
      productId: "2",
      type: "exit",
      quantity: 5,
      date: "2025-01-29",
      observation: "Envío a sucursal norte",
    },
    {
      id: "3",
      productId: "3",
      type: "entry",
      quantity: 20,
      date: "2025-01-30",
      observation: "Reposición de stock",
    },
    {
      id: "4",
      productId: "4",
      type: "exit",
      quantity: 15,
      date: "2025-01-31",
      observation: "Venta corporativa",
    },
    {
      id: "5",
      productId: "6",
      type: "exit",
      quantity: 8,
      date: "2025-02-01",
      observation: "Distribución regional",
    },
    {
      id: "6",
      productId: "1",
      type: "exit",
      quantity: 3,
      date: "2025-02-01",
      observation: "Pedido cliente premium",
    },
    {
      id: "7",
      productId: "5",
      type: "adjustment",
      quantity: -2,
      date: "2025-02-02",
      observation: "Ajuste por inventario físico",
    },
  ];

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

  const [searchTerm, setSearchTerm] = useState("");
  const [typeFilter, setTypeFilter] = useState<MovementType | "all">("all");
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [formData, setFormData] = useState({
    productId: "",
    type: "entry" as MovementType,
    quantity: 0,
    observation: "",
  });

  const activeProducts = products.filter((p) => p.status === "active");

  const getProductName = (productId: string) => {
    return (
      products.find((p) => p.id === productId)?.name || "Producto desconocido"
    );
  };

  const getProductCode = (productId: string) => {
    return products.find((p) => p.id === productId)?.code || "";
  };

  const getMovementConfig = (type: MovementType) => {
    switch (type) {
      case "entry":
        return {
          label: "Entrada",
          icon: ArrowDownCircle,
          color: "text-success",
          bg: "bg-success/10",
          badge: "bg-success/10 text-success border-success/20",
        };
      case "exit":
        return {
          label: "Salida",
          icon: ArrowUpCircle,
          color: "text-critical",
          bg: "bg-critical/10",
          badge: "bg-critical/10 text-critical border-critical/20",
        };
      default:
        return {
          label: "Ajuste",
          icon: RefreshCw,
          color: "text-warning",
          bg: "bg-warning/10",
          badge: "bg-warning/10 text-warning border-warning/20",
        };
    }
  };

  const filteredMovements = movements
    .filter((movement) => {
      const productName = getProductName(movement.productId).toLowerCase();
      const matchesSearch = productName.includes(searchTerm.toLowerCase());
      const matchesType = typeFilter === "all" || movement.type === typeFilter;
      return matchesSearch && matchesType;
    })
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());

  const handleSubmit = () => {
    if (!formData.productId || formData.quantity <= 0) return;

    // addMovement({
    //   productId: formData.productId,
    //   type: formData.type,
    //   quantity:
    //     formData.type === "adjustment"
    //       ? formData.quantity
    //       : Math.abs(formData.quantity),
    //   date: new Date().toISOString().split("T")[0],
    //   observation: formData.observation,
    // });

    setIsDialogOpen(false);
    setFormData({
      productId: "",
      type: "entry",
      quantity: 0,
      observation: "",
    });
  };

  // Calculate stats
  const todayMovements = movements.filter(
    (m) => m.date === new Date().toISOString().split("T")[0],
  );
  const totalEntries = movements.filter((m) => m.type === "entry").length;
  const totalExits = movements.filter((m) => m.type === "exit").length;

  return (
    <div className="space-y-6">
      {/* Page header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 animate-fade-in">
        <div>
          <h1 className="text-2xl font-bold text-foreground">Movimientos</h1>
          <p className="text-muted-foreground mt-1">
            Registra entradas, salidas y ajustes de inventario
          </p>
        </div>
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button className="bg-primary hover:bg-primary/90 text-primary-foreground">
              <Plus className="w-4 h-4 mr-2" />
              Nuevo Movimiento
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-md">
            <DialogHeader>
              <DialogTitle>Nuevo Movimiento</DialogTitle>
              <DialogDescription>
                Registra un movimiento de inventario
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-4 py-4">
              <div className="space-y-2">
                <Label htmlFor="product">Producto</Label>
                <Select
                  value={formData.productId}
                  onValueChange={(value) =>
                    setFormData({ ...formData, productId: value })
                  }
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Selecciona un producto" />
                  </SelectTrigger>
                  <SelectContent>
                    {activeProducts.map((product) => (
                      <SelectItem key={product.id} value={product.id}>
                        <div className="flex items-center gap-2">
                          <span className="font-mono text-xs text-muted-foreground">
                            {product.code}
                          </span>
                          <span>{product.name}</span>
                          <Badge variant="outline" className="ml-auto text-xs">
                            Stock: {product.currentStock}
                          </Badge>
                        </div>
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label>Tipo de Movimiento</Label>
                <div className="grid grid-cols-3 gap-2">
                  {(["entry", "exit", "adjustment"] as MovementType[]).map(
                    (type) => {
                      const config = getMovementConfig(type);
                      const Icon = config.icon;
                      return (
                        <button
                          key={type}
                          type="button"
                          onClick={() => setFormData({ ...formData, type })}
                          className={cn(
                            "p-3 rounded-xl border-2 transition-all duration-200 flex flex-col items-center gap-1",
                            formData.type === type
                              ? `border-current ${config.bg} ${config.color}`
                              : "border-border/50 bg-secondary/30 text-muted-foreground hover:border-border",
                          )}
                        >
                          <Icon className="w-5 h-5" />
                          <span className="text-xs font-medium">
                            {config.label}
                          </span>
                        </button>
                      );
                    },
                  )}
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="quantity">
                  Cantidad
                  {formData.type === "adjustment" && (
                    <span className="text-xs text-muted-foreground ml-2">
                      (usa valores negativos para reducir)
                    </span>
                  )}
                </Label>
                <Input
                  id="quantity"
                  type="number"
                  placeholder="0"
                  value={formData.quantity || ""}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      quantity: Number(e.target.value),
                    })
                  }
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="observation">Observación</Label>
                <Textarea
                  id="observation"
                  placeholder="Ej: Recepción de pedido #1234"
                  value={formData.observation}
                  onChange={(e) =>
                    setFormData({ ...formData, observation: e.target.value })
                  }
                  rows={3}
                />
              </div>
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setIsDialogOpen(false)}>
                Cancelar
              </Button>
              <Button
                onClick={handleSubmit}
                className="bg-primary text-primary-foreground"
                disabled={!formData.productId || formData.quantity === 0}
              >
                Registrar Movimiento
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <Card
          className="border-border/50 bg-card/80 backdrop-blur-sm animate-fade-in opacity-0"
          style={{ animationDelay: "100ms", animationFillMode: "forwards" }}
        >
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
                <Calendar className="w-5 h-5 text-primary" />
              </div>
              <div>
                <p className="text-2xl font-bold text-foreground">
                  {todayMovements.length}
                </p>
                <p className="text-sm text-muted-foreground">Movimientos hoy</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card
          className="border-border/50 bg-card/80 backdrop-blur-sm animate-fade-in opacity-0"
          style={{ animationDelay: "150ms", animationFillMode: "forwards" }}
        >
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg bg-success/10 flex items-center justify-center">
                <ArrowDownCircle className="w-5 h-5 text-success" />
              </div>
              <div>
                <p className="text-2xl font-bold text-foreground">
                  {totalEntries}
                </p>
                <p className="text-sm text-muted-foreground">Total Entradas</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card
          className="border-border/50 bg-card/80 backdrop-blur-sm animate-fade-in opacity-0"
          style={{ animationDelay: "200ms", animationFillMode: "forwards" }}
        >
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg bg-critical/10 flex items-center justify-center">
                <ArrowUpCircle className="w-5 h-5 text-critical" />
              </div>
              <div>
                <p className="text-2xl font-bold text-foreground">
                  {totalExits}
                </p>
                <p className="text-sm text-muted-foreground">Total Salidas</p>
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
            placeholder="Buscar por producto..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10 bg-secondary/50 border-border/50"
          />
        </div>
        <Select
          value={typeFilter}
          onValueChange={(v) => setTypeFilter(v as MovementType | "all")}
        >
          <SelectTrigger className="w-full sm:w-48 bg-secondary/50 border-border/50">
            <Filter className="w-4 h-4 mr-2 text-muted-foreground" />
            <SelectValue placeholder="Tipo" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Todos los tipos</SelectItem>
            <SelectItem value="entry">Entradas</SelectItem>
            <SelectItem value="exit">Salidas</SelectItem>
            <SelectItem value="adjustment">Ajustes</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Movements Table */}
      <div
        className="border border-border/50 rounded-xl overflow-hidden bg-card/50 backdrop-blur-sm animate-fade-in"
        style={{ animationDelay: "300ms" }}
      >
        <Table>
          <TableHeader>
            <TableRow className="hover:bg-transparent border-border/50">
              <TableHead className="text-muted-foreground">Fecha</TableHead>
              <TableHead className="text-muted-foreground">Producto</TableHead>
              <TableHead className="text-muted-foreground text-center">
                Tipo
              </TableHead>
              <TableHead className="text-muted-foreground text-center">
                Cantidad
              </TableHead>
              <TableHead className="text-muted-foreground">
                Observación
              </TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredMovements.length === 0 ? (
              <TableRow>
                <TableCell colSpan={5} className="h-32 text-center">
                  <div className="flex flex-col items-center text-muted-foreground">
                    <Package className="w-10 h-10 mb-2 opacity-50" />
                    <p>No se encontraron movimientos</p>
                  </div>
                </TableCell>
              </TableRow>
            ) : (
              filteredMovements.map((movement, index) => {
                const config = getMovementConfig(movement.type);
                const Icon = config.icon;

                return (
                  <TableRow
                    key={movement.id}
                    className="border-border/50 hover:bg-secondary/30 transition-colors animate-fade-in opacity-0"
                    style={{
                      animationDelay: `${350 + index * 50}ms`,
                      animationFillMode: "forwards",
                    }}
                  >
                    <TableCell className="text-muted-foreground">
                      {movement.date}
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-3">
                        <div
                          className={cn(
                            "w-8 h-8 rounded-lg flex items-center justify-center",
                            config.bg,
                          )}
                        >
                          <Icon className={cn("w-4 h-4", config.color)} />
                        </div>
                        <div>
                          <p className="font-medium">
                            {getProductName(movement.productId)}
                          </p>
                          <p className="text-xs text-muted-foreground font-mono">
                            {getProductCode(movement.productId)}
                          </p>
                        </div>
                      </div>
                    </TableCell>
                    <TableCell className="text-center">
                      <Badge className={cn("border", config.badge)}>
                        {config.label}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-center">
                      <span className={cn("font-bold", config.color)}>
                        {movement.type === "entry"
                          ? "+"
                          : movement.type === "exit"
                            ? "-"
                            : ""}
                        {movement.quantity}
                      </span>
                    </TableCell>
                    <TableCell className="text-muted-foreground max-w-xs truncate">
                      {movement.observation || "-"}
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
          Mostrando {filteredMovements.length} de {movements.length} movimientos
        </p>
      </div>
    </div>
  );
}
