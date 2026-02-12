import api from "@/lib/axios";
import { PROVEEDOR } from "./endpoints/endpoints";
import { request } from "./wrapper";
import type {
    Proveedor,
    CreateProveedorRequest,
    UpdateProveedorRequest,
} from "@/types/api";

// Obtener los proo 
export async function getSuppliers() {
    return request<Proveedor[]>(() => api.get(PROVEEDOR.LIST));
}

// Crear proovedor
export async function createSupplier(data: CreateProveedorRequest) {
    return request<{ message: string }>(() => api.post(PROVEEDOR.CREATE, data));
}


export async function updateSupplier(id: number, data: UpdateProveedorRequest) {
    return request<{ message: string }>(() => api.put(PROVEEDOR.UPDATE(id), data));
}

// borrar proovedor
export async function deleteSupplier(id: number) {
    return request<{ message: string }>(() => api.delete(PROVEEDOR.DELETE(id)));
}