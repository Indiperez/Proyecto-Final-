import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import * as ProductsApi from "@/api/ProductsApi";
import type { CreateProductoRequest, UpdateProductoRequest } from "@/types/api";
import { toast } from "sonner";
import { AxiosError } from "axios";

// Tipado estándar para errores del backend
interface ApiError {
    message?: string;
}

export const productKeys = {
    all: ["products"] as const,
    list: () => [...productKeys.all, "list"] as const,
    highRotation: () => [...productKeys.all, "high-rotation"] as const,
    lowRotation: () => [...productKeys.all, "low-rotation"] as const,
    lowStock: () => [...productKeys.all, "low-stock"] as const,
    reorderPoint: () => [...productKeys.all, "reorder-point"] as const,
};

export function useProducts() {
    return useQuery({
        queryKey: productKeys.list(),
        queryFn: ProductsApi.getProducts,
    });
}

export function useHighRotationProducts() {
    return useQuery({
        queryKey: productKeys.highRotation(),
        queryFn: ProductsApi.getHighRotationProducts,
    });
}

export function useLowRotationProducts() {
    return useQuery({
        queryKey: productKeys.lowRotation(),
        queryFn: ProductsApi.getLowRotationProducts,
    });
}

export function useLowStockProducts() {
    return useQuery({
        queryKey: productKeys.lowStock(),
        queryFn: ProductsApi.getLowStockProducts,
    });
}

export function useReorderPointProducts() {
    return useQuery({
        queryKey: productKeys.reorderPoint(),
        queryFn: ProductsApi.getReorderPointProducts,
    });
}

export function useCreateProduct() {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: (data: CreateProductoRequest) => ProductsApi.createProduct(data),
        onSuccess: (response) => {
            if (!response) return;
            queryClient.invalidateQueries({ queryKey: productKeys.all });
            // Se asume que el mensaje viene directo en el objeto (no en .data.message)
            toast.success(response.message || "Producto creado exitosamente");
        },
        onError: (error: AxiosError<ApiError>) => {
            toast.error(error.response?.data?.message || "Error al crear producto");
        },
    });
}

export function useUpdateProduct() {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: ({ id, data }: { id: number; data: UpdateProductoRequest }) =>
            ProductsApi.updateProduct(id, data),
        onSuccess: (response) => {
            if (!response) return;
            queryClient.invalidateQueries({ queryKey: productKeys.all });
            toast.success(response.message || "Producto actualizado exitosamente");
        },
        onError: (error: AxiosError<ApiError>) => {
            toast.error(error.response?.data?.message || "Error al actualizar producto");
        },
    });
}

export function useDeleteProduct() {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: (id: number) => ProductsApi.deleteProduct(id),
        onSuccess: (response) => {
            if (!response) return;
            queryClient.invalidateQueries({ queryKey: productKeys.all });
            toast.success(response.message || "Producto eliminado exitosamente");
        },
        onError: (error: AxiosError<ApiError>) => {
            toast.error(error.response?.data?.message || "Error al eliminar producto");
        },
    });
}