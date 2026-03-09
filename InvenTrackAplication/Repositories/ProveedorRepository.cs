using InventTrackAI.API.Data;
using InventTrackAI.API.DTOs;
using InventTrackAI.API.Models;
using MySql.Data.MySqlClient;

namespace InventTrackAI.API.Repositories
{
    public class ProveedorRepository
    {
        private readonly DbConnection _db;
        public ProveedorRepository(DbConnection db) { _db = db; }

        private Proveedor MapProveedor(MySqlDataReader reader)
        {
            return new Proveedor
            {
                Id = (int)reader["Id"],
                Nombre = reader["Nombre"].ToString()!,
                TiempoEntregaDias = (int)reader["TiempoEntregaDias"]
            };
        }

        public List<Proveedor> GetAll()
        {
            var proveedores = new List<Proveedor>();
            using var connection = _db.GetConnection();
            var command = new MySqlCommand("SELECT * FROM Proveedores", connection);
            connection.Open();
            var reader = command.ExecuteReader();
            while (reader.Read()) proveedores.Add(MapProveedor(reader));
            return proveedores;
        }

        public Proveedor? GetById(int id)
        {
            using var connection = _db.GetConnection();
            var command = new MySqlCommand("SELECT * FROM Proveedores WHERE Id = @Id", connection);
            command.Parameters.AddWithValue("@Id", id);
            connection.Open();
            var reader = command.ExecuteReader();
            if (reader.Read()) return MapProveedor(reader);
            return null;
        }

        public void Create(ProveedorCreateDto dto)
        {
            using var connection = _db.GetConnection();
            var cmd = new MySqlCommand(
                "INSERT INTO Proveedores (Nombre, TiempoEntregaDias, FechaCreacion) VALUES (@Nombre, @TiempoEntregaDias, NOW())",
                connection);
            cmd.Parameters.AddWithValue("@Nombre", dto.Nombre);
            cmd.Parameters.AddWithValue("@TiempoEntregaDias", dto.TiempoEntregaDias);
            connection.Open();
            cmd.ExecuteNonQuery();
        }

        public bool Update(int id, ProveedorUpdateDto dto)
        {
            using var connection = _db.GetConnection();
            var cmd = new MySqlCommand(
                "UPDATE Proveedores SET Nombre=@Nombre, TiempoEntregaDias=@TiempoEntregaDias WHERE Id=@Id",
                connection);
            cmd.Parameters.AddWithValue("@Id", id);
            cmd.Parameters.AddWithValue("@Nombre", dto.Nombre);
            cmd.Parameters.AddWithValue("@TiempoEntregaDias", dto.TiempoEntregaDias);
            connection.Open();
            return cmd.ExecuteNonQuery() > 0;
        }

        public bool Delete(int id)
        {
            using var connection = _db.GetConnection();
            var cmd = new MySqlCommand("DELETE FROM Proveedores WHERE Id=@Id", connection);
            cmd.Parameters.AddWithValue("@Id", id);
            connection.Open();
            return cmd.ExecuteNonQuery() > 0;
        }
    }
}