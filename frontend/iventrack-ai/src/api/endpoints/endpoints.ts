//endpoints for api calls

const BASE_URL = '/api';

export const AUTH = {
  LOGIN: `${BASE_URL}/auth/login`,
} as const;

export const USUARIO = {
  LIST: `${BASE_URL}/usuario/listar-usuarios`,
  CREATE: `${BASE_URL}/usuario/crear-usuario`,
  CHANGE_STATUS: (id: number) => `${BASE_URL}/usuario/${id}/estado`,
  CHANGE_ROLE: (id: number) => `${BASE_URL}/usuario/${id}/rol`,
  CHANGE_PASSWORD: `${BASE_URL}/usuario/cambiar-password`,
} as const;

export const PRODUCTO = {
  LIST: `${BASE_URL}/producto`,
  CREATE: `${BASE_URL}/producto`,
  UPDATE: (id: number) => `${BASE_URL}/producto/${id}`,
  DELETE: (id: number) => `${BASE_URL}/producto/${id}`,
  LOW_STOCK: `${BASE_URL}/producto/Stock-bajo`,
  HIGH_ROTATION: `${BASE_URL}/producto/Rotacion-Alta`,
  LOW_ROTATION: `${BASE_URL}/producto/Rotacion-Baja`,
  REORDER_POINT: `${BASE_URL}/producto/Punto-Reorden`,
} as const;

export const PROVEEDOR = {
  LIST: `${BASE_URL}/proveedor`,
  CREATE: `${BASE_URL}/proveedor`,
  UPDATE: (id: number) => `${BASE_URL}/proveedor/${id}`,
  DELETE: (id: number) => `${BASE_URL}/proveedor/${id}`,
} as const;

export const MOVIMIENTOS = {
  CREATE: `${BASE_URL}/movimientos`,

} as const;

export const ALERTAS = {
  LIST: `${BASE_URL}/alerta`,

} as const;