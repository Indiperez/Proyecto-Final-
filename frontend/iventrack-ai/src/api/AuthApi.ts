import type { RegisterFormType } from "@/types/auth";
import type { LoginRequest, AuthResponse, Usuario } from "@/types/api";
import { request } from "./wrapper";
import api from "@/lib/axios";
import { AUTH, USUARIO } from "./endpoints";
import {
  setTokenLocalStorage,
  removeTokenLocalStorage,
} from "@/utils/localStorage";

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

export async function login(credentials: LoginRequest) {
  return request<AuthResponse>(() => api.post(AUTH.LOGIN, credentials));
}

export function setAuthData(response: AuthResponse) {
  setTokenLocalStorage(response.token);
}

export function logout() {
  removeTokenLocalStorage();
}

export async function getProfile() {
  return request<Usuario>(() => api.get(USUARIO.PROFILE));
}
