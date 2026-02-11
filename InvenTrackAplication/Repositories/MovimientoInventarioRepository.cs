using InventTrackAI.API.Data;
using InventTrackAI.API.Models;
using InventTrackAI.API.Repositories.Interfaces;
using Microsoft.Data.SqlClient;

namespace InventTrackAI.API.Repositories
{
    public class MovimientoInventarioRepository : IMovimientoInventarioRepository
    {
        private readonly DbConnection _db;

        public MovimientoInventarioRepository(DbConnection db)
        {
            _db = db;
        }

        public void RegistrarMovimiento(MovimientoInventario movimiento)
        {
            using var connection = _db.GetConnection();
            connection.Open();

            using var transaction = connection.BeginTransaction();

            try
            {
                // 1. Verificar stock actual y existencia del producto
                var getStock = new SqlCommand(
                    "SELECT StockActual FROM Productos WHERE Id = @ProductoId",
                    connection, transaction);

                getStock.Parameters.AddWithValue("@ProductoId", movimiento.ProductoId);

                var result = getStock.ExecuteScalar();

                if (result == null)
                {
                    throw new Exception("El producto no existe");
                }

                int stockActualDB = (int)result;

                // 2. Validar salida
                if (movimiento.Tipo == "Salida" && stockActualDB < movimiento.Cantidad)
                {
                    throw new Exception("Stock insuficiente para realizar la salida");
                }

                // 3. Insertar movimiento 
                var insertMovimiento = new SqlCommand(@"
                    INSERT INTO MovimientosInventario 
                    (ProductoId, UsuarioId, Tipo, Cantidad, Observacion)
                    VALUES (@ProductoId, @UsuarioId, @Tipo, @Cantidad, @Observacion)",
                    connection, transaction);

                insertMovimiento.Parameters.AddWithValue("@ProductoId", movimiento.ProductoId);
                insertMovimiento.Parameters.AddWithValue("@UsuarioId", movimiento.UsuarioId);
                insertMovimiento.Parameters.AddWithValue("@Tipo", movimiento.Tipo);
                insertMovimiento.Parameters.AddWithValue("@Cantidad", movimiento.Cantidad);
                insertMovimiento.Parameters.AddWithValue("@Observacion",
                    (object?)movimiento.Observacion ?? DBNull.Value);

                insertMovimiento.ExecuteNonQuery();

                // 4. Actualizar stock
                var updateStock = new SqlCommand(@"
                    UPDATE Productos
                    SET StockActual = 
                        CASE 
                            WHEN @Tipo = 'Entrada' THEN StockActual + @Cantidad
                            WHEN @Tipo = 'Salida' THEN StockActual - @Cantidad
                            WHEN @Tipo = 'Ajuste' THEN @Cantidad
                        END
                    WHERE Id = @ProductoId",
                    connection, transaction);

                updateStock.Parameters.AddWithValue("@Tipo", movimiento.Tipo);
                updateStock.Parameters.AddWithValue("@Cantidad", movimiento.Cantidad);
                updateStock.Parameters.AddWithValue("@ProductoId", movimiento.ProductoId);

                updateStock.ExecuteNonQuery();

                // 5. --- NUEVA LÓGICA: CALCULAR Y GUARDAR PUNTO DE REORDEN ---

                // A. Obtener el tiempo de entrega del proveedor y el Stock Minimo
                // --- CAMBIO EN TU CÓDIGO (Paso 5.A) ---
                var getDatos = new SqlCommand(@"
                        SELECT ISNULL(pr.TiempoEntregaDias, 0) AS TiempoEntregaDias, p.StockMinimo
                        FROM Productos p
                        LEFT JOIN Proveedores pr ON p.ProveedorId = pr.Id 
                        WHERE p.Id = @ProductoId", connection, transaction);
                getDatos.Parameters.AddWithValue("@ProductoId", movimiento.ProductoId);

                using var readerDatos = getDatos.ExecuteReader();
                int tiempoEntrega = 0;
                int stockMinimo = 0;
                if (readerDatos.Read())
                {
                    tiempoEntrega = readerDatos.GetInt32(0);
                    stockMinimo = readerDatos.GetInt32(1);
                }
                readerDatos.Close();

                // B. Calcular punto de reorden (Fórmula: Consumo Diario * Días de Espera)
                // Asumimos que stockMinimo representa la necesidad para un periodo, ej. 30 días
                int consumoDiario = stockMinimo / 30;
                if (consumoDiario == 0) consumoDiario = 1;
                int nuevoPuntoReorden = consumoDiario * tiempoEntrega;

                // C. Guardar el cálculo en la tabla Productos
                var updatePuntoReorden = new SqlCommand(@"
                    UPDATE Productos 
                    SET PuntoReorden = @NuevoPuntoReorden 
                    WHERE Id = @ProductoId", connection, transaction);

                updatePuntoReorden.Parameters.AddWithValue("@NuevoPuntoReorden", nuevoPuntoReorden);
                updatePuntoReorden.Parameters.AddWithValue("@ProductoId", movimiento.ProductoId);
                updatePuntoReorden.ExecuteNonQuery();

                // 6. --- ALERTA DE STOCK MINIMO Y PUNTO DE REORDEN ---

                // Re-obtener el stock actual final después de las actualizaciones
                var getProductoFinal = new SqlCommand(@"
                    SELECT StockActual, StockMinimo, PuntoReorden
                    FROM Productos
                    WHERE Id = @ProductoId",
                    connection, transaction);
                getProductoFinal.Parameters.AddWithValue("@ProductoId", movimiento.ProductoId);

                using var readerFinal = getProductoFinal.ExecuteReader();
                int stockActualFinal = 0;
                int stockMinimoFinal = 0;
                int puntoReordenFinal = 0;
                if (readerFinal.Read())
                {
                    stockActualFinal = readerFinal.GetInt32(0);
                    stockMinimoFinal = readerFinal.GetInt32(1);
                    puntoReordenFinal = readerFinal.GetInt32(2);
                }
                readerFinal.Close();

                bool alertaStockMinimo = stockActualFinal <= stockMinimoFinal;
                bool alertaReorden = stockActualFinal <= puntoReordenFinal;

                if (alertaStockMinimo || alertaReorden)
                {
                    var insertAlerta = new SqlCommand(@"
                            INSERT INTO Alertas
                            (ProductoId, Mensaje, Fecha, Leida)
                            VALUES (@ProductoId, @Mensaje, GETDATE(), 0)", // 0 para 'No leída'
                            connection, transaction);

                    insertAlerta.Parameters.AddWithValue("@ProductoId", movimiento.ProductoId);

                    string mensaje = alertaStockMinimo
                        ? "El producto alcanzó el stock mínimo"
                        : "El producto alcanzó el punto de reorden";

                    insertAlerta.Parameters.AddWithValue("@Mensaje", mensaje);

                    insertAlerta.ExecuteNonQuery();
                }

                // 7. commit si todo salió bien
                transaction.Commit();
            }
            catch
            {
                // Si algo falla, el rollback revierte todo
                transaction.Rollback();
                throw;
            }
        }
    }
}