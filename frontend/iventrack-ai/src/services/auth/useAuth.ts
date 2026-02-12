import { useMutation } from "@tanstack/react-query";
import * as AuthApi from "@/api/AuthApi";
import type { LoginRequest } from "@/types/api";
import { toast } from "sonner";
import { useNavigate } from "react-router-dom";
import { AxiosError } from "axios";

export function useLogin() {
    const navigate = useNavigate();

    return useMutation({
        mutationFn: (credentials: LoginRequest) => AuthApi.login(credentials),
        onSuccess: (response) => {
            if (!response) return;

            // Se asume que AuthResponse contiene directamente los datos (rol, etc.)
            AuthApi.setAuthData(response);
            toast.success(`¡Bienvenido! Rol: ${response.rol}`);
            navigate("/dashboard");
        },
        // Tipamos el error como AxiosError para acceder a la respuesta del servidor
        onError: (error: AxiosError<{ message?: string }>) => {
            const message = error.response?.data?.message || "Credenciales incorrectas";
            toast.error(message);
        },
    });
}

export function useLogout() {
    const navigate = useNavigate();

    return () => {
        AuthApi.logout();
        toast.success("Sesión cerrada exitosamente");
        navigate("/login");
    };
}