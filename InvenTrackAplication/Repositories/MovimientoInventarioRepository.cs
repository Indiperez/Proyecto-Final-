using InventTrackAI.API.Data;
using InventTrackAI.API.Models;
using InventTrackAI.API.Repositories.Interfaces;
using MySql.Data.MySqlClient;

namespace InventTrackAI.API.Repositories
{
    public class MovimientoInventarioRepository : IMovimientoInventarioRepository
    {
        private readonly DbConnection _db;
        public MovimientoInventarioRepository(DbConnection db) { _db = db; }

        public IEnumerable<MovimientoInventario> GetAll()
        {
            var lista = new List<MovimientoInventario>();
            using var conn = _db.GetConnection();
            var cmd = new MySqlCommand("SELECT * FROM MovimientosInventario ORDER BY FechaMovimiento DESC", conn);
            conn.Open();
            var reader = cmd.ExecuteReader();
            while (reader.Read()) lista.Add(MapMovimiento(reader));
            return lista;
        }

        public void RegistrarMovimiento(MovimientoInventario movimiento)
        {
            using var connection = _db.GetConnection();
            connection.Open();
            using var transaction = connection.BeginTransaction();
            try
            {
                // 1. Verificar que el producto existe y obtener stock actual
                var getStock = new MySqlCommand(
                    "SELECT StockActual FROM Productos WHERE Id=@ProductoId",
                    connection, transaction);
                getStock.Parameters.AddWithValue("@ProductoId", movimiento.ProductoId);
                var result = getStock.ExecuteScalar();
                if (result == null) throw new Exception("El producto no existe");
                int stockActual = Convert.ToInt32(result);

                if (movimiento.Tipo == "Salida" && stockActual < movimiento.Cantidad)
                    throw new Exception("Stock insuficiente para realizar la salida");

                // 2. Insertar el movimiento
                var insertMovimiento = new MySqlCommand(@"
                    INSERT INTO MovimientosInventario (ProductoId, UsuarioId, Tipo, Cantidad, Observacion, FechaMovimiento)
                    VALUES (@ProductoId, @UsuarioId, @Tipo, @Cantidad, @Observacion, NOW())",
                    connection, transaction);
                insertMovimiento.Parameters.AddWithValue("@ProductoId", movimiento.ProductoId);
                insertMovimiento.Parameters.AddWithValue("@UsuarioId", movimiento.UsuarioId);
                insertMovimiento.Parameters.AddWithValue("@Tipo", movimiento.Tipo);
                insertMovimiento.Parameters.AddWithValue("@Cantidad", movimiento.Cantidad);
                insertMovimiento.Parameters.AddWithValue("@Observacion", (object?)movimiento.Observacion ?? DBNull.Value);
                insertMovimiento.ExecuteNonQuery();

                // 3. Actualizar stock
                var updateStock = new MySqlCommand(@"
                    UPDATE Productos SET StockActual =
                        CASE
                            WHEN @Tipo = 'Entrada' THEN StockActual + @Cantidad
                            WHEN @Tipo = 'Salida'  THEN StockActual - @Cantidad
                            WHEN @Tipo = 'Ajuste'  THEN @Cantidad
                        END
                    WHERE Id=@ProductoId",
                    connection, transaction);
                updateStock.Parameters.AddWithValue("@Tipo", movimiento.Tipo);
                updateStock.Parameters.AddWithValue("@Cantidad", movimiento.Cantidad);
                updateStock.Parameters.AddWithValue("@ProductoId", movimiento.ProductoId);
                updateStock.ExecuteNonQuery();

                // 4. Obtener datos para calcular punto de reorden
                var getDatos = new MySqlCommand(@"
                    SELECT IFNULL(pr.TiempoEntregaDias, 0) AS TiempoEntregaDias, p.StockMinimo, p.StockActual
                    FROM Productos p
                    LEFT JOIN Proveedores pr ON p.ProveedorId = pr.Id
                    WHERE p.Id=@ProductoId",
                    connection, transaction);
                getDatos.Parameters.AddWithValue("@ProductoId", movimiento.ProductoId);
                var datosReader = getDatos.ExecuteReader();

                int tiempoEntrega = 0, stockMinimo = 0, nuevoStock = 0;
                if (datosReader.Read())
                {
                    tiempoEntrega = Convert.ToInt32(datosReader["TiempoEntregaDias"]);
                    stockMinimo = Convert.ToInt32(datosReader["StockMinimo"]);
                    nuevoStock = Convert.ToInt32(datosReader["StockActual"]);
                }
                datosReader.Close();

                // 5. Crear alerta si el stock bajó del mínimo
                int puntoReorden = stockMinimo + tiempoEntrega;
                if (nuevoStock <= puntoReorden)
                {
                    var insertAlerta = new MySqlCommand(@"
                        INSERT INTO Alertas (ProductoId, Mensaje, Fecha, Leida)
                        SELECT @ProductoId, @Mensaje, NOW(), 0 FROM DUAL
                        WHERE NOT EXISTS (
                            SELECT 1 FROM Alertas WHERE ProductoId=@ProductoId AND Leida=0
                        )",
                        connection, transaction);
                    insertAlerta.Parameters.AddWithValue("@ProductoId", movimiento.ProductoId);
                    insertAlerta.Parameters.AddWithValue("@Mensaje",
                        $"Stock bajo: producto con ID {movimiento.ProductoId} tiene {nuevoStock} unidades (mínimo: {stockMinimo})");
                    insertAlerta.ExecuteNonQuery();
                }

                transaction.Commit();
            }
            catch
            {
                transaction.Rollback();
                throw;
            }
        }

        private MovimientoInventario MapMovimiento(MySqlDataReader reader)
        {
            return new MovimientoInventario
            {
                Id = (int)reader["Id"],
                ProductoId = (int)reader["ProductoId"],
                UsuarioId = (int)reader["UsuarioId"],
                Tipo = reader["Tipo"].ToString()!,
                Cantidad = (int)reader["Cantidad"],
                Observacion = reader["Observacion"] == DBNull.Value ? null : reader["Observacion"].ToString()
            };
        }
    }
}