using InventTrackAI.API.Data;
using InventTrackAI.API.DTOs;
using InventTrackAI.API.Models;
using MySql.Data.MySqlClient;

namespace InventTrackAI.API.Repositories
{
    public class ProductoRespository
    {
        private readonly DbConnection _db;
        public ProductoRespository(DbConnection db) { _db = db; }

        private Producto MapProducto(MySqlDataReader reader)
        {
            return new Producto
            {
                Id = (int)reader["Id"],
                Nombre = reader["Nombre"].ToString()!,
                Descripcion = reader["Descripcion"] == DBNull.Value ? null : reader["Descripcion"].ToString(),
                StockActual = (int)reader["StockActual"],
                StockMinimo = (int)reader["StockMinimo"]
            };
        }

        public List<Producto> GetAll()
        {
            var productos = new List<Producto>();
            using var connection = _db.GetConnection();
            var command = new MySqlCommand("SELECT * FROM Productos", connection);
            connection.Open();
            var reader = command.ExecuteReader();
            while (reader.Read()) productos.Add(MapProducto(reader));
            return productos;
        }

        public Producto? GetById(int id)
        {
            using var connection = _db.GetConnection();
            var command = new MySqlCommand("SELECT * FROM Productos WHERE Id = @Id", connection);
            command.Parameters.AddWithValue("@Id", id);
            connection.Open();
            var reader = command.ExecuteReader();
            if (reader.Read()) return MapProducto(reader);
            return null;
        }

        public void Create(ProductoCreateDto dto)
        {
            using var connection = _db.GetConnection();
            var query = "INSERT INTO Productos (Nombre, Descripcion, StockActual, StockMinimo, FechaCreacion) VALUES (@Nombre, @Descripcion, @StockActual, @StockMinimo, NOW())";
            var command = new MySqlCommand(query, connection);
            command.Parameters.AddWithValue("@Nombre", dto.Nombre);
            command.Parameters.AddWithValue("@Descripcion", (object?)dto.Descripcion ?? DBNull.Value);
            command.Parameters.AddWithValue("@StockActual", dto.StockActual);
            command.Parameters.AddWithValue("@StockMinimo", dto.StockMinimo);
            connection.Open();
            command.ExecuteNonQuery();
        }

        public bool Update(int id, ProductoUpdateDto dto)
        {
            using var connection = _db.GetConnection();
            var query = "UPDATE Productos SET Nombre=@Nombre, Descripcion=@Descripcion, StockActual=@StockActual, StockMinimo=@StockMinimo WHERE Id=@Id";
            var command = new MySqlCommand(query, connection);
            command.Parameters.AddWithValue("@Id", id);
            command.Parameters.AddWithValue("@Nombre", dto.Nombre);
            command.Parameters.AddWithValue("@Descripcion", (object?)dto.Descripcion ?? DBNull.Value);
            command.Parameters.AddWithValue("@StockActual", dto.StockActual);
            command.Parameters.AddWithValue("@StockMinimo", dto.StockMinimo);
            connection.Open();
            return command.ExecuteNonQuery() > 0;
        }

        public bool Delete(int id)
        {
            using var connection = _db.GetConnection();
            var command = new MySqlCommand("DELETE FROM Productos WHERE Id=@Id", connection);
            command.Parameters.AddWithValue("@Id", id);
            connection.Open();
            return command.ExecuteNonQuery() > 0;
        }

        public List<Producto> GetStockBajo()
        {
            var productos = new List<Producto>();
            using var connection = _db.GetConnection();
            var command = new MySqlCommand("SELECT * FROM Productos WHERE StockActual <= StockMinimo", connection);
            connection.Open();
            var reader = command.ExecuteReader();
            while (reader.Read()) productos.Add(MapProducto(reader));
            return productos;
        }

        public List<Producto> GetAltaRotacion()
        {
            var productos = new List<Producto>();
            using var connection = _db.GetConnection();
            // Productos con más movimientos de salida en los últimos 30 días
            var query = @"SELECT p.* FROM Productos p
                          INNER JOIN (
                              SELECT ProductoId, SUM(Cantidad) AS TotalSalidas
                              FROM MovimientosInventario
                              WHERE Tipo = 'Salida' AND FechaMovimiento >= DATE_SUB(NOW(), INTERVAL 30 DAY)
                              GROUP BY ProductoId
                              ORDER BY TotalSalidas DESC
                              LIMIT 10
                          ) top ON p.Id = top.ProductoId";
            var command = new MySqlCommand(query, connection);
            connection.Open();
            var reader = command.ExecuteReader();
            while (reader.Read()) productos.Add(MapProducto(reader));
            return productos;
        }

        public List<Producto> GetBajaRotacion()
        {
            var productos = new List<Producto>();
            using var connection = _db.GetConnection();
            // Productos sin movimientos de salida en los últimos 30 días
            var query = @"SELECT p.* FROM Productos p
                          WHERE p.Id NOT IN (
                              SELECT DISTINCT ProductoId FROM MovimientosInventario
                              WHERE Tipo = 'Salida' AND FechaMovimiento >= DATE_SUB(NOW(), INTERVAL 30 DAY)
                          )";
            var command = new MySqlCommand(query, connection);
            connection.Open();
            var reader = command.ExecuteReader();
            while (reader.Read()) productos.Add(MapProducto(reader));
            return productos;
        }

        public List<PuntoReordenDto> GetPuntoReorden()
        {
            var lista = new List<PuntoReordenDto>();
            using var connection = _db.GetConnection();
            var query = @"SELECT p.Nombre, p.StockActual, p.StockMinimo,
                                 IFNULL(pr.TiempoEntregaDias, 0) AS TiempoEntregaDias
                          FROM Productos p
                          LEFT JOIN Proveedores pr ON p.ProveedorId = pr.Id
                          WHERE p.StockActual <= p.StockMinimo";
            var command = new MySqlCommand(query, connection);
            connection.Open();
            var reader = command.ExecuteReader();
            while (reader.Read())
            {
                lista.Add(new PuntoReordenDto
                {
                    Producto = reader["Nombre"].ToString()!,
                    StockActual = (int)reader["StockActual"],
                    StockMinimo = (int)reader["StockMinimo"],
                    TiempoEntregaDias = (int)reader["TiempoEntregaDias"]
                });
            }
            return lista;
        }
    }
}