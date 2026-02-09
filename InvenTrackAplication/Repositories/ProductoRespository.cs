using InventTrackAI.API.Data;
using InventTrackAI.API.DTOs;
using InventTrackAI.API.Models;
using InventTrackAI.API.Repositories.Interfaces;
using Microsoft.Data.SqlClient;

namespace InventTrackAI.API.Repositories
{
    public class ProductoRespository 
    {
        private readonly DbConnection _db;

        public ProductoRespository(DbConnection db)
        {
            _db = db;
        }

        // Métodos para interactuar con la base de datos (CRUD)

        public List<Producto> GetAll()
        {
            var productos = new List<Producto>();

            using (var connection = _db.GetConnection())
            {
                var query = "Select * From Productos";
                var command = new SqlCommand(query, connection);

                connection.Open();
                var reader = command.ExecuteReader();

                while (reader.Read())
                {
                    productos.Add(MapProducto(reader));
                }
            }
            return productos;
        }

        public void Create(ProductoCreateDto dto)
        {
            using (var connection = _db.GetConnection())
            {
                var query = @"INSERT INTO Productos (Nombre, Descripcion, StockActual, StockMinimo, FechaCreacion)
                Values(@Nombre, @Descripcion, @StockActual, @StockMinimo, GETDATE())
                ";

                var command = new SqlCommand(query, connection);

                command.Parameters.AddWithValue("@Nombre", dto.Nombre);
                command.Parameters.AddWithValue("@Descripcion", (object)dto.Descripcion ?? DBNull.Value);
                command.Parameters.AddWithValue("@StockActual", dto.StockActual);
                command.Parameters.AddWithValue("@StockMinimo", dto.StockMinimo);

                connection.Open();
                command.ExecuteNonQuery();
            }
        }

        public bool Update(int id, ProductoUpdateDto dto)
        {
            using (var connection = _db.GetConnection())
            {
                var query = @"UPDATE Productos
                              SET Nombre = @Nombre,
                                  Descripcion = @Descripcion,
                                  StockActual = @StockActual,
                                  StockMinimo = @StockMinimo
                              WHERE Id = @Id";
                var command = new SqlCommand(query, connection);

                command.Parameters.AddWithValue("@Id", id);
                command.Parameters.AddWithValue("@Nombre", dto.Nombre);
                command.Parameters.AddWithValue("@Descripcion", (object)dto.Descripcion ?? DBNull.Value);
                command.Parameters.AddWithValue("@StockActual", dto.StockActual);
                command.Parameters.AddWithValue("@StockMinimo", dto.StockMinimo);
                connection.Open();
                var rowsAffected = command.ExecuteNonQuery();

                return rowsAffected > 0;
            }
        }

        public bool Delete(int id)
        {
            using (var connection = _db.GetConnection())
            {
                var query = "DELETE FROM Productos WHERE Id = @Id";
                var command = new SqlCommand(query, connection);
                command.Parameters.AddWithValue("@Id", id);
                connection.Open();
                var rowsAffected = command.ExecuteNonQuery();
                return rowsAffected > 0;
            }
        }


        public List<Producto> GetStockBajo()
        {
            var productos = new List<Producto>();
            using (var connection = _db.GetConnection())
            {
                var query = "SELECT * FROM Productos WHERE StockActual <= StockMinimo";

                var command = new SqlCommand(query, connection);
                connection.Open();


                var reader = command.ExecuteReader();
                while (reader.Read())
                {
                    productos.Add(MapProducto(reader));
                }

                return productos;
            }
        }

        public List<Producto> GetAltaRotacion()
        {

            var productos = new List<Producto>();
            using (var connection = _db.GetConnection())
            {
                var query = @"SELECT * FROM Productos WHERE FechaCreacion >= DATEADD(DAY, -30, GETDATE())
                               AND StockActual <= StockMinimo";
                var command = new SqlCommand(query, connection);
                connection.Open();

                var reader = command.ExecuteReader();
                while (reader.Read())
                {
                    productos.Add(MapProducto(reader));
                }

            }
            return productos;
        }

        public List<Producto> GetBajaRotacion()
        {

            var productos = new List<Producto>();
            using (var connection = _db.GetConnection())
            {
                var query = @"SELECT * FROM Productos WHERE FechaCreacion >= DATEADD(DAY, -60, GETDATE())
                            AND StockActual > StockMinimo";
                var command = new SqlCommand(query, connection);
                connection.Open();

                var reader = command.ExecuteReader();
                while (reader.Read())
                {
                    productos.Add(MapProducto(reader));
                }

            }
            return productos;
        }

        public List<PuntoReordenDto> GetPuntoReorden()
        {
            var resultado = new List<PuntoReordenDto>();
            using (var connection = _db.GetConnection())
            {
                // NO traemos PuntoReorden de la DB, porque no existe
                var query = @"
            SELECT 
                p.Id, 
                p.Nombre, 
                p.StockActual, 
                p.StockMinimo, 
                pr.TiempoEntregaDias 
            FROM Productos p
            INNER JOIN Proveedores pr ON p.ProveedorId = pr.Id";

                var command = new SqlCommand(query, connection);
                connection.Open();

                var reader = command.ExecuteReader();

                while (reader.Read())
                {
                
                    // Asumimos que StockMinimo representa la necesidad de 30 días
                    int stockMinimo = (int)reader["StockMinimo"];
                    int tiempoEntrega = (int)reader["TiempoEntregaDias"];

                    // Consumo diario estimado
                    int consumoDiario = stockMinimo / 30;
                    if (consumoDiario == 0) consumoDiario = 1;

                    // Punto de reorden = Consumo Diario * Días de espera
                    int puntoReordenCalculado = consumoDiario * tiempoEntrega;
                    // ---------------------

                    var stockActual = (int)reader["StockActual"];

                    resultado.Add(new PuntoReordenDto
                    {
                        ProductoId = (int)reader["Id"],
                        Producto = reader["Nombre"].ToString(),
                        StockActual = stockActual,
                        StockMinimo = stockMinimo,
                        PuntoReorden = puntoReordenCalculado, 
                        TiempoEntregaDias = tiempoEntrega,
                        Reordenar = stockActual <= puntoReordenCalculado 
                    });
                }
                return resultado;
            }
        }


        private Producto MapProducto(SqlDataReader reader)
        {
            return new Producto
            {
                Id = Convert.ToInt32(reader["Id"]),
                Nombre = reader["Nombre"].ToString(),
                Descripcion = reader["Descripcion"].ToString(),
                StockActual = Convert.ToInt32(reader["StockActual"]),
                StockMinimo = Convert.ToInt32(reader["StockMinimo"]),
                FechaDeCreacion = Convert.ToDateTime(reader["FechaCreacion"])
            };
        }

    }
}
