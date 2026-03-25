import { useState } from "react";
import {
  Plus,
  Search,
  Edit2,
  Trash2,
  MoreHorizontal,
  Package,
  AlertTriangle,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
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
import { cn } from "@/lib/utils";
import {
  useProducts,
  useCreateProduct,
  useUpdateProduct,
  useDeleteProduct,
} from "@/services/products/useProducts";
import type { Producto, CreateProductoRequest, UpdateProductoRequest } from "@/types/api";

// ─── Types ────────────────────────────────────────────────────────────────────

type StockFilter = "all" | "normal" | "bajo" | "sin_stock";

interface ProductFormData {
  nombre: string;
  descripcion: string;
  stockActual: number;
  stockMinimo: number;
}

const emptyForm: ProductFormData = {
  nombre: "",
  descripcion: "",
  stockActual: 0,
  stockMinimo: 0,
};

// ─── Page ─────────────────────────────────────────────────────────────────────

export function ProductsPage() {
  const [searchTerm, setSearchTerm] = useState("");
  const [stockFilter, setStockFilter] = useState<StockFilter>("all");
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Producto | null>(null);
  const [formData, setFormData] = useState<ProductFormData>(emptyForm);

  // ── Queries & Mutations ───────────────────────────────────────────────────
  const { data: productsData, isLoading } = useProducts();
  const productList: Producto[] = Array.isArray(productsData)
    ? productsData
    : (productsData && "data" in (productsData as object)
        ? (productsData as { data: Producto[] }).data
        : []);

  const createMutation = useCreateProduct();
  const updateMutation = useUpdateProduct();
  const deleteMutation = useDeleteProduct();

  // ── Helpers ───────────────────────────────────────────────────────────────
  const getCode = (p: Producto) => `PRD-${String(p.id).padStart(3, "0")}`;

  const getStockStatus = (p: Producto) => {
    if (p.stockActual === 0) return "sin_stock";
    if (p.stockActual <= p.stockMinimo) return "bajo";
    return "normal";
  };

  // ── Filtering ─────────────────────────────────────────────────────────────
  const filteredProducts = productList.filter((p) => {
    const matchesSearch = p.nombre.toLowerCase().includes(searchTerm.toLowerCase());
    const status = getStockStatus(p);
    const matchesStock =
      stockFilter === "all" ||
      (stockFilter === "normal" && status === "normal") ||
      (stockFilter === "bajo" && status === "bajo") ||
      (stockFilter === "sin_stock" && status === "sin_stock");
    return matchesSearch && matchesStock;
  });

  // ── Dialog helpers ────────────────────────────────────────────────────────
  const handleOpenCreate = () => {
    setEditingProduct(null);
    setFormData(emptyForm);
    setIsDialogOpen(true);
  };

  const handleOpenEdit = (product: Producto) => {
    setEditingProduct(product);
    setFormData({
      nombre: product.nombre,
      descripcion: product.descripcion ?? "",
      stockActual: product.stockActual,
      stockMinimo: product.stockMinimo,
    });
    setIsDialogOpen(true);
  };

  const closeDialog = () => {
    setIsDialogOpen(false);
    setEditingProduct(null);
    setFormData(emptyForm);
  };

  const handleSubmit = () => {
    if (!formData.nombre.trim()) return;

    if (editingProduct) {
      const payload: UpdateProductoRequest = {
        nombre: formData.nombre,
        descripcion: formData.descripcion || undefined,
        stockActual: formData.stockActual,
        stockMinimo: formData.stockMinimo,
      };
      updateMutation.mutate(
        { id: editingProduct.id, data: payload },
        { onSuccess: closeDialog },
      );
    } else {
      const payload: CreateProductoRequest = {
        nombre: formData.nombre,
        descripcion: formData.descripcion || undefined,
        stockActual: formData.stockActual,
        stockMinimo: formData.stockMinimo,
      };
      createMutation.mutate(payload, { onSuccess: closeDialog });
    }
  };

  const handleDelete = (product: Producto) => {
    if (confirm(`¿Eliminar "${product.nombre}"? Esta acción no se puede deshacer.`)) {
      deleteMutation.mutate(product.id);
    }
  };

  const isPending = createMutation.isPending || updateMutation.isPending;

  return (
    <div className="space-y-6">
      {/* ── Page header ────────────────────────────────────────────────── */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 animate-fade-in">
        <div>
          <h1 className="text-2xl font-bold text-foreground">Productos</h1>
          <p className="text-muted-foreground mt-1">
            Gestiona el catálogo de productos
          </p>
        </div>

        <Dialog open={isDialogOpen} onOpenChange={(open) => { if (!open) closeDialog(); }}>
          <DialogTrigger asChild>
            <Button
              onClick={handleOpenCreate}
              className="bg-primary hover:bg-primary/90 text-primary-foreground"
            >
              <Plus className="w-4 h-4 mr-2" />
              Nuevo Producto
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-md">
            <DialogHeader>
              <DialogTitle>
                {editingProduct ? "Editar Producto" : "Nuevo Producto"}
              </DialogTitle>
              <DialogDescription>
                {editingProduct
                  ? "Modifica los datos del producto"
                  : "Añade un nuevo producto al catálogo"}
              </DialogDescription>
            </DialogHeader>

            <div className="space-y-4 py-4">
              <div className="space-y-2">
                <Label htmlFor="nombre">Nombre *</Label>
                <Input
                  id="nombre"
                  placeholder="Nombre del producto"
                  value={formData.nombre}
                  onChange={(e) => setFormData({ ...formData, nombre: e.target.value })}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="descripcion">Descripción</Label>
                <Input
                  id="descripcion"
                  placeholder="Descripción opcional"
                  value={formData.descripcion}
                  onChange={(e) => setFormData({ ...formData, descripcion: e.target.value })}
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="stockActual">Stock Inicial</Label>
                  <Input
                    id="stockActual"
                    type="number"
                    min="0"
                    placeholder="0"
                    value={formData.stockActual}
                    onChange={(e) =>
                      setFormData({ ...formData, stockActual: Number(e.target.value) })
                    }
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="stockMinimo">Stock Mínimo</Label>
                  <Input
                    id="stockMinimo"
                    type="number"
                    min="0"
                    placeholder="0"
                    value={formData.stockMinimo}
                    onChange={(e) =>
                      setFormData({ ...formData, stockMinimo: Number(e.target.value) })
                    }
                  />
                </div>
              </div>
            </div>

            <DialogFooter>
              <Button variant="outline" onClick={closeDialog}>
                Cancelar
              </Button>
              <Button
                onClick={handleSubmit}
                disabled={isPending || !formData.nombre.trim()}
                className="bg-primary text-primary-foreground"
              >
                {isPending
                  ? "Guardando..."
                  : editingProduct
                    ? "Guardar Cambios"
                    : "Crear Producto"}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>

      {/* ── Trazabilidad banner ──────────────────────────────────────────── */}
      <div className="flex items-start gap-3 p-4 rounded-xl bg-amber-500/10 border border-amber-500/30 text-amber-400 animate-fade-in">
        <AlertTriangle className="w-5 h-5 shrink-0 mt-0.5" />
        <div>
          <p className="font-medium text-sm">Control de inventario activo</p>
          <p className="text-xs mt-0.5 text-amber-400/80">
            Los cambios de stock deben realizarse a través de Movimientos para
            mantener trazabilidad completa del inventario.
          </p>
        </div>
      </div>

      {/* ── Filters ──────────────────────────────────────────────────────── */}
      <div className="flex flex-col sm:flex-row gap-4 animate-fade-in stagger-1">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <Input
            placeholder="Buscar por nombre..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10 bg-secondary/50 border-border/50"
          />
        </div>
        <Select value={stockFilter} onValueChange={(v) => setStockFilter(v as StockFilter)}>
          <SelectTrigger className="w-full sm:w-48 bg-secondary/50 border-border/50">
            <SelectValue placeholder="Estado de stock" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Todos</SelectItem>
            <SelectItem value="normal">Stock normal</SelectItem>
            <SelectItem value="bajo">Stock bajo</SelectItem>
            <SelectItem value="sin_stock">Sin stock</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* ── Products Table ───────────────────────────────────────────────── */}
      <div className="border border-border/50 rounded-xl overflow-hidden bg-card/50 backdrop-blur-sm animate-fade-in stagger-2">
        <Table>
          <TableHeader>
            <TableRow className="hover:bg-transparent border-border/50">
              <TableHead className="text-muted-foreground">Código</TableHead>
              <TableHead className="text-muted-foreground">Producto</TableHead>
              <TableHead className="text-muted-foreground">Descripción</TableHead>
              <TableHead className="text-muted-foreground text-center">Stock Actual</TableHead>
              <TableHead className="text-muted-foreground text-center">Stock Mín.</TableHead>
              <TableHead className="text-muted-foreground text-center">Estado</TableHead>
              <TableHead className="text-muted-foreground text-right">Acciones</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {/* Loading skeleton */}
            {isLoading && Array.from({ length: 5 }).map((_, i) => (
              <TableRow key={i} className="border-border/50">
                {Array.from({ length: 7 }).map((_, j) => (
                  <TableCell key={j}>
                    <div className="h-4 bg-secondary/50 rounded animate-pulse" />
                  </TableCell>
                ))}
              </TableRow>
            ))}

            {/* Empty state */}
            {!isLoading && filteredProducts.length === 0 && (
              <TableRow>
                <TableCell colSpan={7} className="h-32 text-center">
                  <div className="flex flex-col items-center text-muted-foreground">
                    <Package className="w-10 h-10 mb-2 opacity-50" />
                    <p>No se encontraron productos</p>
                  </div>
                </TableCell>
              </TableRow>
            )}

            {/* Data rows */}
            {!isLoading && filteredProducts.map((product, index) => {
              const status = getStockStatus(product);
              const isLowStock = status === "bajo" || status === "sin_stock";

              return (
                <TableRow
                  key={product.id}
                  className="border-border/50 hover:bg-secondary/30 transition-colors animate-fade-in opacity-0"
                  style={{
                    animationDelay: `${index * 50}ms`,
                    animationFillMode: "forwards",
                  }}
                >
                  <TableCell className="font-mono text-sm text-muted-foreground">
                    {getCode(product)}
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center shrink-0">
                        <Package className="w-4 h-4 text-primary" />
                      </div>
                      <span className="font-medium text-foreground">{product.nombre}</span>
                    </div>
                  </TableCell>
                  <TableCell className="text-muted-foreground text-sm max-w-48 truncate">
                    {product.descripcion || "—"}
                  </TableCell>
                  <TableCell className="text-center font-mono">
                    <span className={cn(isLowStock ? "text-critical font-semibold" : "text-foreground")}>
                      {product.stockActual}
                    </span>
                  </TableCell>
                  <TableCell className="text-center font-mono text-muted-foreground">
                    {product.stockMinimo}
                  </TableCell>
                  <TableCell className="text-center">
                    <Badge
                      className={cn(
                        "border",
                        status === "normal"
                          ? "bg-success/10 text-success border-success/20"
                          : status === "bajo"
                            ? "bg-warning/10 text-warning border-warning/20"
                            : "bg-critical/10 text-critical border-critical/20",
                      )}
                    >
                      {status === "normal" ? "Normal" : status === "bajo" ? "Stock bajo" : "Sin stock"}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-right">
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="icon" className="h-8 w-8">
                          <MoreHorizontal className="w-4 h-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem onClick={() => handleOpenEdit(product)}>
                          <Edit2 className="w-4 h-4 mr-2" />
                          Editar
                        </DropdownMenuItem>
                        <DropdownMenuItem
                          className="text-destructive focus:text-destructive"
                          onClick={() => handleDelete(product)}
                          disabled={deleteMutation.isPending}
                        >
                          <Trash2 className="w-4 h-4 mr-2" />
                          Eliminar
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </TableCell>
                </TableRow>
              );
            })}
          </TableBody>
        </Table>
      </div>

      {/* ── Summary ──────────────────────────────────────────────────────── */}
      {!isLoading && (
        <div className="flex items-center justify-between text-sm text-muted-foreground animate-fade-in">
          <p>
            Mostrando {filteredProducts.length} de {productList.length} productos
          </p>
        </div>
      )}
    </div>
  );
}
