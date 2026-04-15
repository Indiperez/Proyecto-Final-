import { createAccount } from "@/api/AuthApi";
import { useMutation } from "@tanstack/react-query";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";

export const useCreateAccount = () => {
  const navigate = useNavigate();

  return useMutation({
    mutationFn: createAccount,
    onSuccess: () => {
      toast.success("Cuenta creada exitosamente. Inicia sesión.");
      navigate("/auth/login");
    },
    onError: (error) => {
      toast.error(error.message);
    },
  });
};
