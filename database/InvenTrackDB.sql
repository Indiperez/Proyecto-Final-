-- ============================================
--   CREAR BASE DE DATOS
-- ============================================
CREATE DATABASE InventarioDB;
GO

USE InventarioDB;
GO

-- ============================================
--   TABLA: Usuarios
-- ============================================
CREATE TABLE Usuarios (
    Id INT IDENTITY(1,1) PRIMARY KEY,
    Nombre NVARCHAR(100) NOT NULL,
    Email NVARCHAR(150) NOT NULL UNIQUE,
    PasswordHash NVARCHAR(255) NOT NULL,
    Rol NVARCHAR(50) NOT NULL,
    Activo BIT NOT NULL DEFAULT 1,
    FechaCreacion DATETIME NOT NULL DEFAULT GETDATE()
);
GO

-- ============================================
--   TABLA: Proveedores
-- ============================================
CREATE TABLE Proveedores (
    Id INT IDENTITY(1,1) PRIMARY KEY,
    Nombre NVARCHAR(150) NOT NULL,
    TiempoEntregaDias INT NOT NULL,
    FechaCreacion DATETIME NOT NULL DEFAULT GETDATE()
);
GO

-- ============================================
--   TABLA: Productos
-- ============================================
CREATE TABLE Productos (
    Id INT IDENTITY(1,1) PRIMARY KEY,
    Nombre NVARCHAR(150) NOT NULL,
    Descripcion NVARCHAR(255),
    StockActual INT NOT NULL DEFAULT 0,
    StockMinimo INT NOT NULL DEFAULT 0,
    FechaCreacion DATETIME NOT NULL DEFAULT GETDATE(),
    ProveedorId INT NOT NULL,
    PuntoReorden INT NOT NULL DEFAULT 0,
    CONSTRAINT FK_Productos_Proveedores 
        FOREIGN KEY (ProveedorId) REFERENCES Proveedores(Id)
);
GO

-- ============================================
--   TABLA: MovimientosInventario
-- ============================================
CREATE TABLE MovimientosInventario (
    Id INT IDENTITY(1,1) PRIMARY KEY,
    ProductoId INT NOT NULL,
    UsuarioId INT NOT NULL,
    Tipo NVARCHAR(50) NOT NULL,        -- Entrada / Salida
    Cantidad INT NOT NULL,
    Fecha DATETIME NOT NULL DEFAULT GETDATE(),
    Observacion NVARCHAR(255),

    CONSTRAINT FK_Movimientos_Productos 
        FOREIGN KEY (ProductoId) REFERENCES Productos(Id),

    CONSTRAINT FK_Movimientos_Usuarios 
        FOREIGN KEY (UsuarioId) REFERENCES Usuarios(Id)
);
GO

-- ============================================
--   TABLA: Alertas
-- ============================================
CREATE TABLE Alertas (
    Id INT IDENTITY(1,1) PRIMARY KEY,
    ProductoId INT NOT NULL,
    Mensaje NVARCHAR(255) NOT NULL,
    Fecha DATETIME NOT NULL DEFAULT GETDATE(),
    Leida BIT NOT NULL DEFAULT 0,

    CONSTRAINT FK_Alertas_Productos 
        FOREIGN KEY (ProductoId) REFERENCES Productos(Id)
);
GO
