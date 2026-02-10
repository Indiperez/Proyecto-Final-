import { useState } from "react";
import {
  Plus,
  Search,
  Edit2,
  Trash2,
  MoreHorizontal,
  Package,
  Filter,
  ChevronDown,
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
// import { useInventoryStore, type Product } from "@/lib/store"
import { cn } from "@/lib/utils";
import type { Product } from "@/types/dashboard";

export function ProductsPage() {
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

  const categories = ["Electronicos"];

  //   const { products, categories, addProduct, updateProduct, deleteProduct } = useInventoryStore()
  const [searchTerm, setSearchTerm] = useState("");
  const [categoryFilter, setCategoryFilter] = useState<string>("all");
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [formData, setFormData] = useState({
    code: "",
    name: "",
    category: "",
    stockMin: 0,
    leadTime: 0,
    status: "active" as "active" | "inactive",
  });

  const filteredProducts = products.filter((product) => {
    const matchesSearch =
      product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      product.code.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory =
      categoryFilter === "all" || product.category === categoryFilter;
    return matchesSearch && matchesCategory;
  });

  const handleOpenDialog = (product?: Product) => {
    if (product) {
      setEditingProduct(product);
      setFormData({
        code: product.code,
        name: product.name,
        category: product.category,
        stockMin: product.stockMin,
        leadTime: product.leadTime,
        status: product.status,
      });
    } else {
      setEditingProduct(null);
      setFormData({
        code: "",
        name: "",
        category: "",
        stockMin: 0,
        leadTime: 0,
        status: "active",
      });
    }
    setIsDialogOpen(true);
  };

  //   const handleSubmit = () => {
  //     if (editingProduct) {
  //       updateProduct(editingProduct.id, formData);
  //     } else {
  //       addProduct(formData);
  //     }
  //     setIsDialogOpen(false);
  //     setEditingProduct(null);
  //   };

  //   const handleDelete = (id: string) => {
  //     if (confirm("¿Estás seguro de eliminar este producto?")) {
  //       deleteProduct(id);
  //     }
  //   };

  return (
    <div className="space-y-6">
      {/* Page header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 animate-fade-in">
        <div>
          <h1 className="text-2xl font-bold text-foreground">Productos</h1>
          <p className="text-muted-foreground mt-1">
            Gestiona el catálogo de productos
          </p>
        </div>
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button
              onClick={() => handleOpenDialog()}
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
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="code">Código</Label>
                  <Input
                    id="code"
                    placeholder="PRD-001"
                    value={formData.code}
                    onChange={(e) =>
                      setFormData({ ...formData, code: e.target.value })
                    }
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="status">Estado</Label>
                  <Select
                    value={formData.status}
                    onValueChange={(value: "active" | "inactive") =>
                      setFormData({ ...formData, status: value })
                    }
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="active">Activo</SelectItem>
                      <SelectItem value="inactive">Inactivo</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="name">Nombre</Label>
                <Input
                  id="name"
                  placeholder="Nombre del producto"
                  value={formData.name}
                  onChange={(e) =>
                    setFormData({ ...formData, name: e.target.value })
                  }
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="category">Categoría</Label>
                <Select
                  value={formData.category}
                  onValueChange={(value) =>
                    setFormData({ ...formData, category: value })
                  }
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Selecciona una categoría" />
                  </SelectTrigger>
                  <SelectContent>
                    {categories.map((cat) => (
                      <SelectItem key={cat} value={cat}>
                        {cat}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="stockMin">Stock Mínimo</Label>
                  <Input
                    id="stockMin"
                    type="number"
                    placeholder="0"
                    value={formData.stockMin}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        stockMin: Number(e.target.value),
                      })
                    }
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="leadTime">Lead Time (días)</Label>
                  <Input
                    id="leadTime"
                    type="number"
                    placeholder="0"
                    value={formData.leadTime}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        leadTime: Number(e.target.value),
                      })
                    }
                  />
                </div>
              </div>
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setIsDialogOpen(false)}>
                Cancelar
              </Button>
              <Button
                onClick={() => {} /*handleSubmit*/}
                className="bg-primary text-primary-foreground"
              >
                {editingProduct ? "Guardar Cambios" : "Crear Producto"}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-4 animate-fade-in stagger-1">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <Input
            placeholder="Buscar por nombre o código..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10 bg-secondary/50 border-border/50"
          />
        </div>
        <Select value={categoryFilter} onValueChange={setCategoryFilter}>
          <SelectTrigger className="w-full sm:w-48 bg-secondary/50 border-border/50">
            <Filter className="w-4 h-4 mr-2 text-muted-foreground" />
            <SelectValue placeholder="Categoría" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Todas las categorías</SelectItem>
            {categories.map((cat) => (
              <SelectItem key={cat} value={cat}>
                {cat}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {/* Products Table */}
      <div className="border border-border/50 rounded-xl overflow-hidden bg-card/50 backdrop-blur-sm animate-fade-in stagger-2">
        <Table>
          <TableHeader>
            <TableRow className="hover:bg-transparent border-border/50">
              <TableHead className="text-muted-foreground">Código</TableHead>
              <TableHead className="text-muted-foreground">Producto</TableHead>
              <TableHead className="text-muted-foreground">Categoría</TableHead>
              <TableHead className="text-muted-foreground text-center">
                Stock Min
              </TableHead>
              <TableHead className="text-muted-foreground text-center">
                Lead Time
              </TableHead>
              <TableHead className="text-muted-foreground text-center">
                Estado
              </TableHead>
              <TableHead className="text-muted-foreground text-right">
                Acciones
              </TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredProducts.length === 0 ? (
              <TableRow>
                <TableCell colSpan={7} className="h-32 text-center">
                  <div className="flex flex-col items-center text-muted-foreground">
                    <Package className="w-10 h-10 mb-2 opacity-50" />
                    <p>No se encontraron productos</p>
                  </div>
                </TableCell>
              </TableRow>
            ) : (
              filteredProducts.map((product, index) => (
                <TableRow
                  key={product.id}
                  className="border-border/50 hover:bg-secondary/30 transition-colors animate-fade-in opacity-0"
                  style={{
                    animationDelay: `${index * 50}ms`,
                    animationFillMode: "forwards",
                  }}
                >
                  <TableCell className="font-mono text-sm text-muted-foreground">
                    {product.code}
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center">
                        <Package className="w-4 h-4 text-primary" />
                      </div>
                      <span className="font-medium">{product.name}</span>
                    </div>
                  </TableCell>
                  <TableCell>
                    <Badge variant="outline" className="bg-secondary/50">
                      {product.category}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-center">
                    {product.stockMin}
                  </TableCell>
                  <TableCell className="text-center">
                    {product.leadTime} días
                  </TableCell>
                  <TableCell className="text-center">
                    <Badge
                      className={cn(
                        "border",
                        product.status === "active"
                          ? "bg-success/10 text-success border-success/20"
                          : "bg-muted text-muted-foreground border-border",
                      )}
                    >
                      {product.status === "active" ? "Activo" : "Inactivo"}
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
                        <DropdownMenuItem
                          onClick={() => handleOpenDialog(product)}
                        >
                          <Edit2 className="w-4 h-4 mr-2" />
                          Editar
                        </DropdownMenuItem>
                        <DropdownMenuItem
                          className="text-destructive focus:text-destructive"
                          onClick={() => {} /*handleDelete(product.id)*/}
                        >
                          <Trash2 className="w-4 h-4 mr-2" />
                          Eliminar
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>

      {/* Summary */}
      <div className="flex items-center justify-between text-sm text-muted-foreground animate-fade-in">
        <p>
          Mostrando {filteredProducts.length} de {products.length} productos
        </p>
      </div>
    </div>
  );
}
