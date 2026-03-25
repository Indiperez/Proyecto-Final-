import api from "@/lib/axios";
import { PREDICCION } from "./endpoints/endpoints";
import { request } from "./wrapper";
import type { PrediccionDemanda, ProductoAnalisis } from "@/types/api";

export async function getPredictionByProduct(productoId: number) {
    return request<PrediccionDemanda>(() => api.get(PREDICCION.GET_BY_PRODUCT(productoId)));
}

export async function recalculatePrediction(productoId: number) {
    return request<PrediccionDemanda>(() => api.post(PREDICCION.RECALCULATE(productoId)));
}

export async function getAllAnalysis() {
    return request<ProductoAnalisis[]>(() => api.get(PREDICCION.GET_ALL_ANALYSIS));
}
