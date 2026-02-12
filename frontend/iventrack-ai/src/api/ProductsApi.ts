import api from "@/lib/axios";
import { PRODUCTO } from "./endpoints/endpoints";
import { request } from "./wrapper";
import type {
    Producto,
    CreateProductoRequest,
    UpdateProductoRequest,
    PuntoReordenDto,
} from "@/types/api";


export async function getProducts() {
    return request<Producto[]>(() => api.get(PRODUCTO.LIST));
}

// crear producto
export async function createProduct(data: CreateProductoRequest) {
    return request<{ message: string }>(() => api.post(PRODUCTO.CREATE, data));
}


export async function updateProduct(id: number, data: UpdateProductoRequest) {
    return request<{ message: string }>(() => api.put(PRODUCTO.UPDATE(id), data));
}

// borrar
export async function deleteProduct(id: number) {
    return request<{ message: string }>(() => api.delete(PRODUCTO.DELETE(id)));
}


export async function getLowStockProducts() {
    return request<Producto[]>(() => api.get(PRODUCTO.LOW_STOCK));
}


export async function getHighRotationProducts() {
    return request<Producto[]>(() => api.get(PRODUCTO.HIGH_ROTATION));
}

// obtiene productos con baja rotacion (creados hace mas de 30 dias con stock alto)
export async function getLowRotationProducts() {
    return request<Producto[]>(() => api.get(PRODUCTO.LOW_ROTATION));
}


// Esto crea un nuevo endpoint en el backend que calcula el punto de reorden para cada producto y devuelve un DTO con esa información. El frontend puede usar esta función para mostrar una lista de productos con su punto de reorden y si necesitan ser reordenados o no.
export async function getReorderPointProducts() {
    return request<PuntoReordenDto[]>(() => api.get(PRODUCTO.REORDER_POINT));
}