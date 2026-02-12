import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import * as AlertsApi from "@/api/AlertsApi";
import { toast } from "sonner";

export const alertKeys = {
    all: ["alerts"] as const,
    list: () => [...alertKeys.all, "list"] as const,
};

export function useAlerts() {
    return useQuery({
        queryKey: alertKeys.list(),
        queryFn: AlertsApi.getAlerts,
    });
}

export function useMarkAlertAsRead() {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: (id: number) => AlertsApi.markAlertAsRead(id),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: alertKeys.all });
            toast.success("Alerta marcada como leída");
        },
        onError: () => {
            toast.error("Error al marcar alerta");
        },
    });
}
