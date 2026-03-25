import { useState } from "react";
import {
    useProducts,
    useCreateProduct,
    useUpdateProduct,
    useDeleteProduct,
} from "@/services/products/useProducts";
import { Button } from "@/components/ui/button";
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog";
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import { Plus, Pencil, Trash2, AlertTriangle, Search, Package } from "lucide-react";
import { cn } from "@/lib/utils";
import type { Producto } from "@/types/api";

// ─── Types ────────────────────────────────────────────────────────────────────

interface ProductFormData {
    nombre: string;
    descripcion: string;
    stockActual: number;
    stockMinimo: number;
}

// ─── Page ─────────────────────────────────────────────────────────────────────

export default function ProductsPage() {
    // Modal state
    const [isCreateOpen, setIsCreateOpen] = useState(false);
    const [editingProduct, setEditingProduct] = useState<Producto | null>(null);

    // Search / filter state (local only, no filtering logic yet)
    const [searchQuery, setSearchQuery] = useState("");
    const [categoryFilter, setCategoryFilter] = useState("todas");

    // Queries & Mutations
    const { data: products, isLoading } = useProducts();
    const createMutation = useCreateProduct();
    const updateMutation = useUpdateProduct();
    const deleteMutation = useDeleteProduct();

    // Form state
    const [formData, setFormData] = useState<ProductFormData>({
        nombre: "",
        descripcion: "",
        stockActual: 0,
        stockMinimo: 0,
    });

    const closeModals = () => {
        setIsCreateOpen(false);
        setEditingProduct(null);
        setFormData({
            nombre: "",
            descripcion: "",
            stockActual: 0,
            stockMinimo: 0,
        });
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();

        console.log('handleSubmit called with:', { formData, editingProduct });
        console.log('createMutation:', createMutation);
        console.log('updateMutation:', updateMutation);

        if (editingProduct) {
            console.log('Updating product:', editingProduct.id);
            updateMutation.mutate(
                { id: editingProduct.id, data: formData },
                { onSuccess: closeModals }
            );
        } else {
            console.log('Creating new product');
            createMutation.mutate(formData, {
                onSuccess: (response) => {
                    console.log('Product created successfully:', response);
                    closeModals();
                },
                onError: (error) => {
                    console.error('Product creation failed:', error);
                }
            });
        }
    };

    const handleEdit = (product: Producto) => {
        setFormData({
            nombre: product.nombre,
            descripcion: product.descripcion || "",
            stockActual: product.stockActual,
            stockMinimo: product.stockMinimo,
        });
        setEditingProduct(product);
    };

    const handleDelete = (id: number) => {
        if (confirm("¿Estás seguro de eliminar este producto?")) {
            deleteMutation.mutate(id);
        }
    };

    if (isLoading) return (
        <div className="flex items-center justify-center py-24 text-muted-foreground">
            Cargando productos...
        </div>
    );

    // Normalize product list
    const productList = Array.isArray(products)
        ? products
        : (products && typeof products === 'object' && 'data' in products
            ? (products as { data: Producto[] }).data
            : []);

    return (
        <div className="space-y-6">
            {/* ── Header ─────────────────────────────────────────────────── */}
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 animate-fade-in">
                <div>
                    <h1 className="text-2xl font-bold text-foreground">Productos</h1>
                    <p className="text-muted-foreground mt-1">
                        Gestiona el catálogo de productos
                    </p>
                </div>

                {/* Create Dialog */}
                <Dialog open={isCreateOpen} onOpenChange={setIsCreateOpen}>
                    <DialogTrigger asChild>
                        <Button
                            className="gap-2"
                            onClick={() => setEditingProduct(null)}
                        >
                            <Plus className="w-4 h-4" />
                            Nuevo Producto
                        </Button>
                    </DialogTrigger>
                    <DialogContent>
                        <DialogHeader>
                            <DialogTitle>Crear Nuevo Producto</DialogTitle>
                        </DialogHeader>
                        <ProductForm
                            formData={formData}
                            setFormData={setFormData}
                            onSubmit={handleSubmit}
                            isLoading={createMutation.isPending}
                        />
                    </DialogContent>
                </Dialog>
            </div>

            {/* ── Search + Filter Bar ────────────────────────────────────── */}
            <div
                className="flex flex-col sm:flex-row gap-3 animate-fade-in opacity-0"
                style={{ animationDelay: "100ms", animationFillMode: "forwards" }}
            >
                <div className="relative flex-1">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground pointer-events-none" />
                    <Input
                        className="pl-9 bg-secondary/50 border-border/50"
                        placeholder="Buscar por nombre o código..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                    />
                </div>
                <Select value={categoryFilter} onValueChange={setCategoryFilter}>
                    <SelectTrigger className="w-full sm:w-48 bg-secondary/50 border-border/50">
                        <SelectValue placeholder="Todas las categorías" />
                    </SelectTrigger>
                    <SelectContent>
                        <SelectItem value="todas">Todas las categorías</SelectItem>
                    </SelectContent>
                </Select>
            </div>

            {/* ── Amber warning banner ───────────────────────────────────── */}
            <div
                className="flex items-start gap-3 rounded-lg border border-amber-500/30 bg-amber-500/10 px-4 py-3 animate-fade-in opacity-0"
                style={{ animationDelay: "150ms", animationFillMode: "forwards" }}
            >
                <AlertTriangle className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
                <p className="text-sm text-amber-400">
                    <strong>Recomendación:</strong> Para modificar el stock, usa{" "}
                    <strong>Movimientos</strong> para mantener la trazabilidad.
                </p>
            </div>

            {/* ── Products Table ─────────────────────────────────────────── */}
            <div
                className="rounded-xl border border-border/50 overflow-hidden animate-fade-in opacity-0"
                style={{ animationDelay: "200ms", animationFillMode: "forwards" }}
            >
                <Table>
                    <TableHeader>
                        <TableRow className="border-b border-gray-800 hover:bg-transparent">
                            <TableHead className="text-gray-400 text-sm font-medium">
                                Código
                            </TableHead>
                            <TableHead className="text-gray-400 text-sm font-medium">
                                Producto
                            </TableHead>
                            <TableHead className="text-gray-400 text-sm font-medium text-center">
                                Stock Actual
                            </TableHead>
                            <TableHead className="text-gray-400 text-sm font-medium text-center">
                                Stock Mínimo
                            </TableHead>
                            <TableHead className="text-gray-400 text-sm font-medium text-right">
                                Acciones
                            </TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {productList.length === 0 ? (
                            <TableRow className="hover:bg-transparent border-b border-gray-800/50">
                                <TableCell colSpan={5} className="py-16 text-center">
                                    <div className="flex flex-col items-center gap-3">
                                        <div className="w-12 h-12 rounded-full bg-secondary/50 flex items-center justify-center">
                                            <Package className="w-6 h-6 text-muted-foreground" />
                                        </div>
                                        <p className="text-sm font-medium text-foreground">
                                            No hay productos registrados
                                        </p>
                                        <p className="text-xs text-muted-foreground">
                                            Comienza creando tu primer producto
                                        </p>
                                    </div>
                                </TableCell>
                            </TableRow>
                        ) : (
                            productList.map((product: Producto) => {
                                const isLowStock = product.stockActual <= product.stockMinimo;
                                return (
                                    <TableRow
                                        key={product.id}
                                        className="border-b border-gray-800/50 hover:bg-gray-800/30 transition-colors"
                                    >
                                        {/* Código */}
                                        <TableCell className="font-mono text-sm text-gray-400">
                                            PRD-{String(product.id).padStart(3, "0")}
                                        </TableCell>

                                        {/* Producto */}
                                        <TableCell>
                                            <div className="flex items-center gap-3">
                                                <div className="w-9 h-9 rounded-lg bg-cyan-500/10 flex items-center justify-center shrink-0">
                                                    <Package className="w-4 h-4 text-cyan-500" />
                                                </div>
                                                <div className="min-w-0">
                                                    <p className="text-sm font-medium text-gray-200 truncate">
                                                        {product.nombre}
                                                    </p>
                                                    {product.descripcion && (
                                                        <p className="text-xs text-gray-400 truncate max-w-60">
                                                            {product.descripcion}
                                                        </p>
                                                    )}
                                                </div>
                                            </div>
                                        </TableCell>

                                        {/* Stock Actual */}
                                        <TableCell className="text-center">
                                            <span
                                                className={cn(
                                                    "inline-block px-2.5 py-0.5 rounded-full text-xs font-semibold border",
                                                    isLowStock
                                                        ? "bg-red-500/10 text-red-400 border-red-500/30"
                                                        : "bg-green-500/10 text-green-400 border-green-500/30",
                                                )}
                                            >
                                                {product.stockActual}
                                            </span>
                                        </TableCell>

                                        {/* Stock Mínimo */}
                                        <TableCell className="text-center text-gray-400 text-sm">
                                            {product.stockMinimo}
                                        </TableCell>

                                        {/* Acciones */}
                                        <TableCell className="text-right">
                                            <div className="flex justify-end gap-2">
                                                <Button
                                                    variant="outline"
                                                    size="sm"
                                                    onClick={() => handleEdit(product)}
                                                    className="border-gray-600 bg-transparent text-gray-300 hover:bg-gray-800 hover:text-gray-100"
                                                >
                                                    <Pencil className="w-3.5 h-3.5 mr-1" />
                                                    Editar
                                                </Button>
                                                <Button
                                                    variant="outline"
                                                    size="sm"
                                                    onClick={() => handleDelete(product.id)}
                                                    className="border-red-500/30 bg-red-500/10 text-red-400 hover:bg-red-500/20 hover:text-red-300"
                                                >
                                                    <Trash2 className="w-3.5 h-3.5 mr-1" />
                                                    Eliminar
                                                </Button>
                                            </div>
                                        </TableCell>
                                    </TableRow>
                                );
                            })
                        )}
                    </TableBody>
                </Table>
            </div>

            {/* ── Edit Dialog ────────────────────────────────────────────── */}
            <Dialog
                open={!!editingProduct}
                onOpenChange={(open) => !open && closeModals()}
            >
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>Editar Producto</DialogTitle>
                    </DialogHeader>
                    <ProductForm
                        formData={formData}
                        setFormData={setFormData}
                        onSubmit={handleSubmit}
                        isLoading={updateMutation.isPending}
                    />
                </DialogContent>
            </Dialog>
        </div>
    );
}

// ─── ProductForm subcomponent ─────────────────────────────────────────────────

interface ProductFormProps {
    formData: ProductFormData;
    setFormData: React.Dispatch<React.SetStateAction<ProductFormData>>;
    onSubmit: (e: React.FormEvent) => void;
    isLoading: boolean;
}

function ProductForm({ formData, setFormData, onSubmit, isLoading }: ProductFormProps) {
    return (
        <form onSubmit={onSubmit} className="space-y-4">
            <div className="space-y-2">
                <Label htmlFor="nombre">Nombre del Producto *</Label>
                <Input
                    id="nombre"
                    value={formData.nombre}
                    onChange={(e) => setFormData({ ...formData, nombre: e.target.value })}
                    placeholder="Ej. Laptop Dell Latitude"
                    required
                />
            </div>
            <div className="space-y-2">
                <Label htmlFor="descripcion">Descripción</Label>
                <Textarea
                    id="descripcion"
                    value={formData.descripcion}
                    onChange={(e) => setFormData({ ...formData, descripcion: e.target.value })}
                    placeholder="Detalles del producto..."
                />
            </div>
            <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                    <Label htmlFor="stockActual">Stock Inicial *</Label>
                    <Input
                        id="stockActual"
                        type="number"
                        min="0"
                        value={formData.stockActual}
                        onChange={(e) => setFormData({ ...formData, stockActual: parseInt(e.target.value) || 0 })}
                        required
                    />
                </div>
                <div className="space-y-2">
                    <Label htmlFor="stockMinimo">Alerta Stock Mínimo *</Label>
                    <Input
                        id="stockMinimo"
                        type="number"
                        min="0"
                        value={formData.stockMinimo}
                        onChange={(e) => setFormData({ ...formData, stockMinimo: parseInt(e.target.value) || 0 })}
                        required
                    />
                </div>
            </div>
            <div className="flex justify-end gap-3 pt-4">
                <Button type="submit" disabled={isLoading} className="w-full sm:w-auto">
                    {isLoading ? "Guardando cambios..." : "Guardar Producto"}
                </Button>
            </div>
        </form>
    );
}
