-- SQL script to create the missing Usuarios table on your Hostinger database
-- Run this in your Hostinger MySQL database management interface (like phpMyAdmin)

CREATE TABLE IF NOT EXISTS Usuarios (
    Id INT AUTO_INCREMENT PRIMARY KEY,
    Nombre VARCHAR(100) NOT NULL,
    Email VARCHAR(255) NOT NULL UNIQUE,
    PasswordHash VARCHAR(255) NOT NULL,
    Rol VARCHAR(50) NOT NULL DEFAULT 'Operador',
    Activo BOOLEAN NOT NULL DEFAULT TRUE,
    FechaCreacion TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    INDEX idx_email (Email)
);

-- Optional: Add some sample data for testing
INSERT INTO Usuarios (Nombre, Email, PasswordHash, Rol, Activo) VALUES
('Admin Principal', 'admin@inventtrack.com', '$2a$12$LQv3c1yqBWVHxkd0LHAkCOYz6TtxMQJqhN8/LewdBPj0Fts3WbCji', 'Admin', TRUE),
('Test User', 'test@example.com', '$2a$12$LQv3c1yqBWVHxkd0LHAkCOYz6TtxMQJqhN8/LewdBPj0Fts3WbCji', 'Operador', TRUE);

-- Verify the table was created
SELECT * FROM Usuarios;