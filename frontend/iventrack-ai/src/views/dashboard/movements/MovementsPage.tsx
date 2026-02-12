import { useState } from "react";
import { useCreateMovement } from "@/services/movements/useMovements";
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
import { Plus, Info } from "lucide-react";
import type { TipoMovimiento, Producto } from "@/types/api";

// Interfaz para el estado del formulario
interface MovementFormData {
    productoId: number;
    tipo: TipoMovimiento;
    cantidad: number;
    observacion: string;
}

export default function MovementsPage() {
    const [isCreateOpen, setIsCreateOpen] = useState(false);

    // Queries - Asumiendo que useProducts devuelve Producto[] directamente
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

    return (
        <div className="p-8">
            <div className="flex justify-between items-center mb-6">
                <h1 className="text-3xl font-bold">Movimientos de Inventario</h1>
                <Dialog
                    open={isCreateOpen}
                    onOpenChange={(open) => {
                        setIsCreateOpen(open);
                        if (!open) resetForm();
                    }}
                >
                    <DialogTrigger asChild>
                        <Button>
                            <Plus className="w-4 h-4 mr-2" />
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
                                        {/* Quitamos .data porque los productos vienen directos ahora */}
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

            {/* Info Cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
                <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                    <h3 className="font-semibold text-green-800 mb-2">Entrada</h3>
                    <p className="text-sm text-green-700">
                        Suma la cantidad al stock actual. Ej: Compras, Devoluciones.
                    </p>
                </div>
                <div className="bg-red-50 border border-red-200 rounded-lg p-4">
                    <h3 className="font-semibold text-red-800 mb-2">Salida</h3>
                    <p className="text-sm text-red-700">
                        Resta la cantidad del stock actual. Ej: Ventas, Mermas.
                    </p>
                </div>
                <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                    <h3 className="font-semibold text-blue-800 mb-2">Ajuste</h3>
                    <p className="text-sm text-blue-700">
                        Establece el stock al valor exacto indicado.
                    </p>
                </div>
            </div>

            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6 flex items-start gap-3">
                <Info className="w-5 h-5 text-blue-600 flex-shrink-0 mt-0.5" />
                <p className="text-sm text-blue-800">
                    <strong>Sistema de Trazabilidad:</strong> Cada movimiento se registra con el usuario y fecha actual de forma automática.
                </p>
            </div>

            <div className="bg-gray-50 border border-gray-200 rounded-lg p-8 text-center">
                <p className="text-gray-600">
                    El historial de movimientos se puede consultar directamente en la base de datos.
                </p>
                <p className="text-sm text-gray-500 mt-2">
                    Actualmente el backend no expone un historial público en esta vista.
                </p>
            </div>
        </div>
    );
}