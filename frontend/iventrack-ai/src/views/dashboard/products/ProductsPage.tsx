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
            <div className="bg-white rounded-lg shadow-lg overflow-hidden border border-gray-200">
                <Table>
                    <TableHeader className="bg-gray-50">
                        <TableRow className="hover:bg-gray-50">
                            <TableHead className="font-semibold text-gray-700">Nombre</TableHead>
                            <TableHead className="font-semibold text-gray-700">Stock Actual</TableHead>
                            <TableHead className="font-semibold text-gray-700">Stock Mínimo</TableHead>
                            <TableHead className="text-right font-semibold text-gray-700">Acciones</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {productList.length === 0 ? (
                            <TableRow>
                                <TableCell colSpan={4} className="text-center py-12 text-gray-500 bg-gray-50">
                                    <div className="flex flex-col items-center">
                                        <div className="w-16 h-16 bg-gray-200 rounded-full flex items-center justify-center mb-4">
                                            <span className="text-2xl">📦</span>
                                        </div>
                                        <p className="text-lg font-medium text-gray-600">No hay productos registrados</p>
                                        <p className="text-sm text-gray-400 mt-2">Comienza creando tu primer producto</p>
                                    </div>
                                </TableCell>
                            </TableRow>
                        ) : (
                            productList.map((product: Producto) => (
                                <TableRow key={product.id} className="hover:bg-gray-50 transition-colors">
                                    <TableCell className="font-medium text-gray-800 py-4">
                                        <div className="flex items-center space-x-3">
                                            <div className="w-10 h-10 bg-gradient-to-br from-blue-100 to-blue-200 rounded-lg flex items-center justify-center">
                                                <span className="text-blue-600 font-bold text-sm">{product.nombre.charAt(0)}</span>
                                            </div>
                                            <div>
                                                <div className="font-semibold text-gray-900">{product.nombre}</div>
                                                {product.descripcion && (
                                                    <div className="text-sm text-gray-500 truncate max-w-xs">{product.descripcion}</div>
                                                )}
                                            </div>
                                        </div>
                                    </TableCell>
                                    <TableCell className="py-4">
                                        <div className="flex items-center space-x-2">
                                            <span className={`px-3 py-1 rounded-full font-semibold text-sm border ${product.stockActual <= product.stockMinimo
                                                    ? "bg-red-50 text-red-700 border-red-200"
                                                    : "bg-green-50 text-green-700 border-green-200"
                                                }`}>
                                                {product.stockActual}
                                            </span>
                                            {product.stockActual <= product.stockMinimo && (
                                                <span className="text-red-600 text-xs font-medium">⚠️ Bajo</span>
                                            )}
                                        </div>
                                    </TableCell>
                                    <TableCell className="py-4 text-gray-600 font-medium">{product.stockMinimo}</TableCell>
                                    <TableCell className="text-right py-4">
                                        <div className="flex justify-end gap-2">
                                            <Button
                                                variant="outline"
                                                size="sm"
                                                onClick={() => handleEdit(product)}
                                                className="border-gray-300 hover:bg-gray-50 text-gray-700"
                                            >
                                                <Pencil className="w-4 h-4 mr-1" />
                                                Editar
                                            </Button>
                                            <Button
                                                variant="destructive"
                                                size="sm"
                                                onClick={() => handleDelete(product.id)}
                                                className="bg-red-500 hover:bg-red-600 text-white"
                                            >
                                                <Trash2 className="w-4 h-4 mr-1" />
                                                Eliminar
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