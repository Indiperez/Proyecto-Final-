import { register } from "@/api/AuthApi";
import { useMutation } from "@tanstack/react-query";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";

export const useCreateAccount = () => {
  const navigate = useNavigate();

  return useMutation({
    mutationFn: register,
    onSuccess: () => {
      toast.success("Cuenta creada exitosamente. Inicia sesión.");
      navigate("/auth/login");
    },
    onError: (error: Error) => {
      toast.error(error.message || "Error al crear la cuenta");
    },
  });
};
