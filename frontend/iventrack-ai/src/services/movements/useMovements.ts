import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import * as MovementsApi from "@/api/MovementsApi";
import type { CreateMovimientoRequest } from "@/types/api";
import { toast } from "sonner";
import { AxiosError } from "axios";

interface ApiError {
    message?: string;
}

export function useMovements() {
    return useQuery({
        queryKey: ["movements", "list"],
        queryFn: () => MovementsApi.getMovements(),
    });
}

export function useCreateMovement() {
    const queryClient = useQueryClient();

    return useMutation({

        mutationFn: (data: CreateMovimientoRequest) => MovementsApi.createMovement(data),

        onSuccess: (response) => {
            // Validamos nulos para TypeScript
            if (!response) return;

            // IMPORTANTE: Invalidamos los productos para que la tabla 
            // muestre el stock actualizado después del movimiento
            queryClient.invalidateQueries({ queryKey: ["products"] });
            queryClient.invalidateQueries({ queryKey: ["movements", "list"] });
            queryClient.invalidateQueries({ queryKey: ["alerts", "list"] });
            queryClient.invalidateQueries({ queryKey: ["predictions"] });

            // Usamos 'mensaje' porque así está definido en tu request<{ mensaje: string }>
            toast.success(response.mensaje || "Movimiento registrado con éxito");
        },

        onError: (error: AxiosError<ApiError>) => {
            const message = error.response?.data?.message || "Error al registrar el movimiento";
            toast.error(message);
        },
    });
}