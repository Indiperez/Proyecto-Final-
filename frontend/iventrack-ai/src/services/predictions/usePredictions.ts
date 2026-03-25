import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import * as PredictionApi from "@/api/PredictionApi";
import { toast } from "sonner";
import { AxiosError } from "axios";
import { productKeys } from "@/services/products/useProducts";

interface ApiError {
    message?: string;
}

export const predictionKeys = {
    all: ["predictions"] as const,
    byProduct: (id: number) => [...predictionKeys.all, "product", id] as const,
    analysis: () => [...predictionKeys.all, "analysis"] as const,
};

export function usePrediction(productoId: number) {
    return useQuery({
        queryKey: predictionKeys.byProduct(productoId),
        queryFn: () => PredictionApi.getPredictionByProduct(productoId),
        enabled: !!productoId,
    });
}

export function useAllAnalysis() {
    return useQuery({
        queryKey: predictionKeys.analysis(),
        queryFn: PredictionApi.getAllAnalysis,
        staleTime: 1000 * 60 * 5,
    });
}

export function useRecalculatePrediction() {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: (productoId: number) => PredictionApi.recalculatePrediction(productoId),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: predictionKeys.all });
            queryClient.invalidateQueries({ queryKey: productKeys.all });
            toast.success("Predicción recalculada");
        },
        onError: (error: AxiosError<ApiError>) => {
            toast.error(error.response?.data?.message || "Error al recalcular predicción");
        },
    });
}
