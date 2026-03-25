import type { RegisterFormType } from "@/types/auth";
import { request } from "./wrapper";
import api from "@/lib/axios";
import { AUTH } from "./endpoints";

type AuthApi = {
  userRegisterForm: RegisterFormType;
};

export async function createAccount({
  userRegisterForm,
}: Pick<AuthApi, "userRegisterForm">) {
  return request<{ msg: string }>(() =>
    api.post(AUTH.REGISTER, userRegisterForm),
  );
}
