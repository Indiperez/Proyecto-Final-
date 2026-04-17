import api from "@/lib/axios";
import { USUARIO } from "./endpoints/endpoints";
import { request } from "./wrapper";
import type { Usuario } from "@/types/api";

export async function getUsuarios() {
    return request<Usuario[]>(() => api.get(USUARIO.LIST));
}
