-- Crear la base de datos
CREATE DATABASE InvenTrackDB;
GO

USE InvenTrackDB;
GO

-- Tabla: Productos
CREATE TABLE Productos (
    Id INT IDENTITY(1,1) PRIMARY KEY,
    Nombre NVARCHAR(100) NOT NULL,
    Descripcion NVARCHAR(255),
    StockActual INT NOT NULL,
    StockMinimo INT NOT NULL,
    FechaCreacion DATETIME DEFAULT GETDATE()
);
GO

-- Tabla: MovimientosInventario
CREATE TABLE MovimientosInventario (
    Id INT IDENTITY(1,1) PRIMARY KEY,
    ProductoId INT NOT NULL,
    Tipo NVARCHAR(10) CHECK (Tipo IN ('Entrada', 'Salida')),
    Cantidad INT NOT NULL,
    Fecha DATETIME DEFAULT GETDATE(),
    CONSTRAINT FK_Movimientos_Productos
        FOREIGN KEY (ProductoId) REFERENCES Productos(Id)
);
GO

-- Datos de prueba
INSERT INTO Productos (Nombre, Descripcion, StockActual, StockMinimo)
VALUES 
('Arroz', 'Arroz blanco 5lb', 50, 10),
('Aceite', 'Aceite vegetal 1L', 30, 5),
('Azúcar', 'Azúcar refino 2lb', 40, 8);
GO


SELECT * FROM Productos;
SELECT * FROM MovimientosInventario;
