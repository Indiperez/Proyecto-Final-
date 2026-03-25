-- Crear la base de datos
CREATE DATABASE IF NOT EXISTS u416278945_InventTrackAI;
USE u416278945_InventTrackAI;

-- Tabla: Usuarios (Faltaba esta tabla!)
CREATE TABLE Usuarios (
    Id INT AUTO_INCREMENT PRIMARY KEY,
    Nombre VARCHAR(100) NOT NULL,
    Email VARCHAR(255) NOT NULL UNIQUE,
    PasswordHash VARCHAR(255) NOT NULL,
    Rol VARCHAR(50) NOT NULL DEFAULT 'Operador',
    Activo BOOLEAN NOT NULL DEFAULT TRUE,
    FechaCreacion TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    INDEX idx_email (Email)
);

-- Tabla: Productos
CREATE TABLE Productos (
    Id INT AUTO_INCREMENT PRIMARY KEY,
    Nombre VARCHAR(100) NOT NULL,
    Descripcion VARCHAR(255),
    StockActual INT NOT NULL,
    StockMinimo INT NOT NULL,
    ProveedorId INT,
    PuntoReorden INT NOT NULL DEFAULT 0,
    FechaCreacion TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Tabla: Proveedores
CREATE TABLE Proveedores (
    Id INT AUTO_INCREMENT PRIMARY KEY,
    Nombre VARCHAR(100) NOT NULL,
    TiempoEntregaDias INT NOT NULL,
    FechaCreacion TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Tabla: MovimientosInventario
CREATE TABLE MovimientosInventario (
    Id INT AUTO_INCREMENT PRIMARY KEY,
    ProductoId INT NOT NULL,
    UsuarioId INT NOT NULL,
    Tipo ENUM('Entrada', 'Salida', 'Ajuste') NOT NULL,
    Cantidad INT NOT NULL,
    Fecha TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    Observacion VARCHAR(255),
    INDEX idx_producto_id (ProductoId),
    INDEX idx_usuario_id (UsuarioId),
    INDEX idx_fecha (Fecha)
);

-- Tabla: Alertas
CREATE TABLE Alertas (
    Id INT AUTO_INCREMENT PRIMARY KEY,
    ProductoId INT NOT NULL,
    Mensaje VARCHAR(200) NOT NULL,
    Fecha TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    Leida BOOLEAN DEFAULT FALSE,
    INDEX idx_producto_id (ProductoId),
    INDEX idx_leida (Leida)
);

-- Claves foráneas
ALTER TABLE Productos 
ADD CONSTRAINT FK_Productos_Proveedores 
FOREIGN KEY (ProveedorId) REFERENCES Proveedores(Id);

ALTER TABLE MovimientosInventario 
ADD CONSTRAINT FK_Movimientos_Productos 
FOREIGN KEY (ProductoId) REFERENCES Productos(Id);

ALTER TABLE MovimientosInventario 
ADD CONSTRAINT FK_Movimientos_Usuarios 
FOREIGN KEY (UsuarioId) REFERENCES Usuarios(Id);

ALTER TABLE Alertas 
ADD CONSTRAINT FK_Alertas_Productos 
FOREIGN KEY (ProductoId) REFERENCES Productos(Id);

-- Datos de prueba
INSERT INTO Usuarios (Nombre, Email, PasswordHash, Rol, Activo) VALUES
('Admin Principal', 'admin@inventtrack.com', '$2a$12$LQv3c1yqBWVHxkd0LHAkCOYz6TtxMQJqhN8/LewdBPj0Fts3WbCji', 'Admin', TRUE);

INSERT INTO Proveedores (Nombre, TiempoEntregaDias) VALUES
('Proveedor Central', 10),
('Distribuidora Sur', 7);

INSERT INTO Productos (Nombre, Descripcion, StockActual, StockMinimo, ProveedorId, PuntoReorden) VALUES
('Arroz', 'Arroz blanco 5lb', 50, 10, 1, 15),
('Aceite', 'Aceite vegetal 1L', 30, 5, 1, 8),
('Azúcar', 'Azúcar refino 2lb', 40, 8, 2, 12),
('Arroz Especial', 'Producto de prueba para alerta de reorden', 5, 30, 1, 20);