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
import { Plus, Pencil, Trash2, AlertTriangle } from "lucide-react";
import type { Producto } from "@/types/api";

// Interfaz para el estado local del formulario
interface ProductFormData {
    nombre: string;
    descripcion: string;
    stockActual: number;
    stockMinimo: number;
}

export default function ProductsPage() {
    // Estados para controlar los modales
    const [isCreateOpen, setIsCreateOpen] = useState(false);
    const [editingProduct, setEditingProduct] = useState<Producto | null>(null);

    // Queries y Mutations
    const { data: products, isLoading } = useProducts();
    const createMutation = useCreateProduct();
    const updateMutation = useUpdateProduct();
    const deleteMutation = useDeleteProduct();

    // Estado del formulario
    const [formData, setFormData] = useState<ProductFormData>({
        nombre: "",
        descripcion: "",
        stockActual: 0,
        stockMinimo: 0,
    });

    // Función para resetear el estado y cerrar cualquier modal
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

        if (editingProduct) {
            updateMutation.mutate(
                { id: editingProduct.id, data: formData },
                { onSuccess: closeModals }
            );
        } else {
            createMutation.mutate(formData, {
                onSuccess: closeModals,
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

    if (isLoading) return <div className="p-8">Cargando productos...</div>;

    // Normalización de la lista de productos basada en el wrapper de la API 
    const productList = Array.isArray(products) ? products : (products && typeof products === 'object' && 'data' in products ? (products as { data: Producto[] }).data : []);

    return (
        <div className="p-8">
            <div className="flex justify-between items-center mb-6">
                <h1 className="text-3xl font-bold">Gestión de Productos</h1>

                {/* Diálogo de Creación */}
                <Dialog open={isCreateOpen} onOpenChange={setIsCreateOpen}>
                    <DialogTrigger asChild>
                        <Button onClick={() => { setEditingProduct(null); }}>
                            <Plus className="w-4 h-4 mr-2" />
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

            {/* Aviso de Trazabilidad */}
            <div className="bg-amber-50 border border-amber-200 rounded-lg p-4 mb-6 flex items-start gap-3">
                <AlertTriangle className="w-5 h-5 text-amber-600 flex-shrink-0 mt-0.5" />
                <p className="text-sm text-amber-800">
                    <strong>Recomendación:</strong> Para modificar el stock, usa <strong>Movimientos</strong> para mantener la trazabilidad de la base de datos[cite: 25].
                </p>
            </div>

            {/* Tabla de Productos */}
            <div className="bg-white rounded-lg shadow overflow-hidden border">
                <Table>
                    <TableHeader>
                        <TableRow>
                            <TableHead>Nombre</TableHead>
                            <TableHead>Stock Actual</TableHead>
                            <TableHead>Stock Mínimo</TableHead>
                            <TableHead className="text-right">Acciones</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {productList.length === 0 ? (
                            <TableRow>
                                <TableCell colSpan={4} className="text-center py-8 text-gray-500">
                                    No hay productos registrados.
                                </TableCell>
                            </TableRow>
                        ) : (
                            productList.map((product: Producto) => (
                                <TableRow key={product.id}>
                                    <TableCell className="font-medium">{product.nombre}</TableCell>
                                    <TableCell>
                                        <span className={`px-2 py-1 rounded font-semibold ${product.stockActual <= product.stockMinimo
                                                ? "bg-red-100 text-red-800"
                                                : "bg-green-100 text-green-800"
                                            }`}>
                                            {product.stockActual}
                                        </span>
                                    </TableCell>
                                    <TableCell>{product.stockMinimo}</TableCell>
                                    <TableCell className="text-right">
                                        <div className="flex justify-end gap-2">
                                            <Button variant="outline" size="sm" onClick={() => handleEdit(product)}>
                                                <Pencil className="w-4 h-4" />
                                            </Button>
                                            <Button variant="destructive" size="sm" onClick={() => handleDelete(product.id)}>
                                                <Trash2 className="w-4 h-4" />
                                            </Button>
                                        </div>
                                    </TableCell>
                                </TableRow>
                            ))
                        )}
                    </TableBody>
                </Table>
            </div>

            {/* Diálogo de Edición (Independiente para evitar conflictos de renderizado) */}
            <Dialog open={!!editingProduct} onOpenChange={(open) => !open && closeModals()}>
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

// Sub-componente del Formulario para limpieza de código
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