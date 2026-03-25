using InventTrackAI.API.Data;
using InventTrackAI.API.DTOs;
using InventTrackAI.API.Models;
using MySql.Data.MySqlClient;

namespace InventTrackAI.API.Repositories
{
    public class ProveedorRepository
    {
        private readonly DbConnection _db;

        public ProveedorRepository(DbConnection db)
        {
            _db = db;
        }

        public List<Proveedor> GetAll()
        {
            var proveedores = new List<Proveedor>();
            using (var connection = _db.GetConnection())
            {
                var query = "SELECT * FROM Proveedores";
                var command = new MySqlCommand(query, connection);
                connection.Open();
                var reader = command.ExecuteReader();
                while (reader.Read())
                {
                    proveedores.Add(MapProveedor(reader));
                }
            }
            return proveedores;
        }

        public void Create(ProveedorCreateDto dto)
        {
            using (var connection = _db.GetConnection())
            {
                var query = @"INSERT INTO Proveedores (Nombre, TiempoEntregaDias, FechaCreacion)
                              VALUES (@Nombre, @TiempoEntregaDias, NOW())";
                var command = new MySqlCommand(query, connection);
                command.Parameters.AddWithValue("@Nombre", dto.Nombre);
                command.Parameters.AddWithValue("@TiempoEntregaDias", dto.TiempoEntregaDias);
                connection.Open();
                command.ExecuteNonQuery();
            }
        }

        public bool Update(int id, ProveedorUpdateDto dto)
        {
            using (var connection = _db.GetConnection())
            {
                var query = @"UPDATE Proveedores
                              SET Nombre = @Nombre,
                                  TiempoEntregaDias = @TiempoEntregaDias
                              WHERE Id = @Id";
                var command = new MySqlCommand(query, connection);
                command.Parameters.AddWithValue("@Id", id);
                command.Parameters.AddWithValue("@Nombre", dto.Nombre);
                command.Parameters.AddWithValue("@TiempoEntregaDias", dto.TiempoEntregaDias);
                connection.Open();
                var rowsAffected = command.ExecuteNonQuery();
                return rowsAffected > 0;
            }
        }

        public bool Delete(int id)
        {
            using (var connection = _db.GetConnection())
            {
                var query = "DELETE FROM Proveedores WHERE Id = @Id";
                var command = new MySqlCommand(query, connection);
                command.Parameters.AddWithValue("@Id", id);
                connection.Open();
                var rowsAffected = command.ExecuteNonQuery();
                return rowsAffected > 0;
            }
        }

        private Proveedor MapProveedor(MySqlDataReader reader)
        {
            return new Proveedor
            {
                Id = Convert.ToInt32(reader["Id"]),
                Nombre = reader["Nombre"].ToString(),
                TiempoEntregaDias = Convert.ToInt32(reader["TiempoEntregaDias"]),
                FechaCreacion = Convert.ToDateTime(reader["FechaCreacion"])
            };
        }
    }
}
