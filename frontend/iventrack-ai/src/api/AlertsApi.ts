import api from "@/lib/axios";
import { ALERTAS } from "./endpoints/endpoints";
import { request } from "./wrapper";
import type { Alerta } from "@/types/api";


export async function getAlerts() {
    return request<Alerta[]>(() => api.get(ALERTAS.LIST));
}

// marcar como leidas las alertas, esto es para que el usuario pueda limpiar su lista de alertas sin borrarlas del sistema, y para que el backend sepa que ya fueron vistas y no las vuelva a mostrar.
export async function markAlertAsRead(id: number) {
    return request<{ message: string }>(() => api.get(`${ALERTAS.LIST}/${id}/leida`));
}