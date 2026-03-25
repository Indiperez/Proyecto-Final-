CREATE TABLE
    IF NOT EXISTS HistoricoConsumo (
        Id INT NOT NULL AUTO_INCREMENT,
        ProductoId INT NOT NULL,
        Cantidad INT NOT NULL,
        Fecha DATETIME NOT NULL,
        PRIMARY KEY (Id),
        INDEX idx_historico_producto_fecha (ProductoId, Fecha),
        CONSTRAINT fk_historico_producto FOREIGN KEY (ProductoId) REFERENCES Productos (Id) ON DELETE CASCADE ON UPDATE CASCADE
    ) ENGINE = InnoDB DEFAULT CHARSET = utf8mb4 COLLATE = utf8mb4_unicode_ci;

CREATE TABLE
    IF NOT EXISTS PrediccionDemanda (
        Id INT NOT NULL AUTO_INCREMENT,
        ProductoId INT NOT NULL,
        ConsumoDiarioPromedio DECIMAL(10, 2) NOT NULL,
        DemandaEstimada30Dias DECIMAL(10, 2) NOT NULL,
        Tendencia VARCHAR(10) NOT NULL CHECK (Tendencia IN ('Sube', 'Baja', 'Estable')),
        PuntoReorden DECIMAL(10, 2) NOT NULL,
        CalculadoEn DATETIME NOT NULL,
        PRIMARY KEY (Id),
        UNIQUE KEY uq_prediccion_producto (ProductoId),
        CONSTRAINT fk_prediccion_producto FOREIGN KEY (ProductoId) REFERENCES Productos (Id) ON DELETE CASCADE ON UPDATE CASCADE
    ) ENGINE = InnoDB DEFAULT CHARSET = utf8mb4 COLLATE = utf8mb4_unicode_ci;