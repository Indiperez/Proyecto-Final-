import api from "@/lib/axios";
import { AUTH } from "../api/endpoints/endpoints";
import { request } from "./wrapper";
import type { LoginRequest, AuthResponse } from "@/types/api";


export async function login(credentials: LoginRequest) {
  return request<AuthResponse>(() => api.post(AUTH.LOGIN, credentials));
}


export function logout() {
  localStorage.removeItem('AUTH_TOKEN');
  localStorage.removeItem('USER_ROLE');
}


export function getToken(): string | null {
  return localStorage.getItem('AUTH_TOKEN');
}

// guardar token y rol en local storage
export function setAuthData(authResponse: AuthResponse) {
  localStorage.setItem('AUTH_TOKEN', authResponse.token);
  localStorage.setItem('USER_ROLE', authResponse.rol);
}

// buscar el rol del usuario
export function getUserRole(): string | null {
  return localStorage.getItem('USER_ROLE');
}

// el usuario esta autenticado ?
export function isAuthenticated(): boolean {
  return !!getToken();
}

// buscar roles 
export function hasRole(role: string): boolean {
  const userRole = getUserRole();
  return userRole === role;
}

// es adminitrador ? 
export function isAdmin(): boolean {
  return hasRole('Admin');
}