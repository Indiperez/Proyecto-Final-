import { useQuery } from "@tanstack/react-query";
import * as UsuarioApi from "@/api/UsuarioApi";

export const usuarioKeys = {
    all: ["usuarios"] as const,
    list: () => [...usuarioKeys.all, "list"] as const,
};

export function useUsuarios() {
    return useQuery({
        queryKey: usuarioKeys.list(),
        queryFn: UsuarioApi.getUsuarios,
    });
}
