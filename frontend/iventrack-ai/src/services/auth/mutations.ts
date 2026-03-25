import { createAccount } from "@/api/AuthApi";
import { useMutation } from "@tanstack/react-query";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";

const navigate = useNavigate();

export const useCreateAccount = () => {
  return useMutation({
    mutationFn: createAccount,
    onSuccess: () => {
      navigate("/auth/login");
    },
    onError: (error) => {
      toast.error(error.message);
    },
  });
};
