import api from "@/lib/axios";
import { MOVIMIENTOS } from "./endpoints/endpoints";
import { request } from "./wrapper";
import type { CreateMovimientoRequest } from "@/types/api";

// CRITICO lideres!!!!!: esta es la unica forma de registrar movimientos, el backend actualiza el stock automaticamente en la transaccion. No se debe crear un endpoint para actualizar stock manualmente, 
// eso rompe la logica de negocio y puede generar inconsistencias.


// Register new movement (Entrada/Salida/Ajuste)
export async function createMovement(data: CreateMovimientoRequest) {
    return request<{ mensaje: string }>(() => api.post(MOVIMIENTOS.CREATE, data));
}

// funciones para los tipos de movimientos mas comunes, que internamente llaman a createMovement 
// con el tipo correcto. Esto es para evitar errores al escribir el tipo cada vez y para tener funciones mas semanticas en el frontend.


export async function registerEntry(
    productoId: number,
    cantidad: number,
    observacion?: string
) {
    return createMovement({
        productoId,
        tipo: "Entrada",
        cantidad,
        observacion,
    });
}


export async function registerExit(
    productoId: number,
    cantidad: number,
    observacion?: string
) {
    return createMovement({
        productoId,
        tipo: "Salida",
        cantidad,
        observacion,
    });
}

// Register stock adjustment
// Note: ajustar en el backend debe ser una transaccion que actualice el stock y registre el movimiento al mismo tiempo,
//  para evitar inconsistencias. No se debe permitir ajustar el stock sin registrar el movimiento correspondiente.
export async function registerAdjustment(
    productoId: number,
    cantidad: number,
    observacion?: string
) {
    return createMovement({
        productoId,
        tipo: "Ajuste",
        cantidad,
        observacion,
    });
}