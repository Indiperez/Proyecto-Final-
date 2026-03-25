//tipos de api 

export interface LoginRequest {
    email: string;
    password: string;
}

export interface AuthResponse {
    token: string;
    rol: string;
}


export interface Usuario {
    id: number;
    nombre: string;
    email: string;
    rol: string;
    activo: boolean;
    fechaCreacion: string;
}

export interface CreateUsuarioRequest {
    nombre: string;
    email: string;
    password: string;
    rol: string;
}

export interface ChangeStatusRequest {
    activo: boolean;
}

export interface ChangeRoleRequest {
    rol: string; // Changed from nuevoRol
}

export interface ChangePasswordRequest {
    passwordActual: string;
    nuevaPassword: string; // Changed from passwordNueva
}


export interface Producto {
    id: number;
    nombre: string;
    descripcion?: string;
    stockActual: number;
    stockMinimo: number;
    fechaDeCreacion: string;
}

export interface CreateProductoRequest {
    nombre: string;
    descripcion?: string;
    stockActual: number;
    stockMinimo: number;
    proveedorId?: number;
    puntoReorden?: number;
}

export interface UpdateProductoRequest {
    nombre: string;
    descripcion?: string;
    stockActual: number;
    stockMinimo: number;
}

export interface PuntoReordenDto {
    productoId: number;
    producto: string;
    stockActual: number;
    stockMinimo: number;
    puntoReorden: number;
    tiempoEntregaDias: number;
    reordenar: boolean;
}


export interface Proveedor {
    id: number;
    nombre: string;
    tiempoEntregaDias: number;
    fechaCreacion: string;
}

export interface CreateProveedorRequest {
    nombre: string;
    tiempoEntregaDias: number;
}

export interface UpdateProveedorRequest {
    nombre: string;
    tiempoEntregaDias: number;
}


export type TipoMovimiento = 'Entrada' | 'Salida' | 'Ajuste';

export interface Movimiento {
    id: number;
    productoId: number;
    usuarioId: number;
    tipo: TipoMovimiento;
    cantidad: number;
    observacion?: string;
    fecha: string;
}

export interface CreateMovimientoRequest {
    productoId: number;
    tipo: TipoMovimiento;
    cantidad: number;
    observacion?: string;
}


export interface Alerta {
    id: number;
    productoId: number;
    mensaje: string;
    fecha: string;
    leida: boolean;
}


export interface ApiResponse<T> {
    data?: T;
    message?: string;
}

export interface ApiError {
    message?: string;
    error?: string;
}


// Consumption history
export interface HistoricoConsumo {
    id: number;
    productoId: number;
    cantidad: number;
    fecha: string;
}

// Demand prediction (matches backend PrediccionDemanda model)
export interface PrediccionDemanda {
    id: number;
    productoId: number;
    consomoDiarioPromedio: number;
    demandaEstimada30Dias: number;
    tendencia: 'Sube' | 'Baja' | 'Estable';
    puntoReorden: number;
    calculadoEn: string;
}

// Analysis result per product (for AnalysisPage table)
export interface ProductoAnalisis {
    productoId: number;
    nombre: string;
    stockActual: number;
    promedio30d: number;
    promedio60d: number;
    tendencia: 'Sube' | 'Baja' | 'Estable';
    rotacion: 'Alta' | 'Media' | 'Baja';
    puntoReorden: number;
    demandaEstimada30Dias: number;
}

// AI Recommendation (for AiRecommendations component)
export interface AiRecommendation {
    productoId: number;
    producto: string;
    tipo: 'reorder' | 'trend' | 'low_rotation' | 'critical';
    prioridad: 'high' | 'medium' | 'low';
    mensaje: string;
    fechaGenerada: string;
}