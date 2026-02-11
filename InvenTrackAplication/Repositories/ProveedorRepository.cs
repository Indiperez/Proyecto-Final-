using InventTrackAI.API.Data;
using InventTrackAI.API.DTOs;
using InventTrackAI.API.Models;
using Microsoft.Data.SqlClient;

namespace InventTrackAI.API.Repositories
{
    public class ProveedorRepository
    {
        private readonly DbConnection _db;

        public ProveedorRepository(DbConnection db)
        {
            _db = db;
        }

        // Métodos para interactuar con la base de datos (CRUD) de Proveedor
        public List<Proveedor> GetAll()
        {
            var proveedores = new List<Proveedor>();

            using (var connection = _db.GetConnection())
            {
                var query = "SELECT * FROM Proveedores";
                var command = new SqlCommand(query, connection);
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
                            Values (@Nombre, @TiempoEntregaDias, GETDATE())";

                var cmd = new SqlCommand(query, connection);

                cmd.Parameters.AddWithValue("@Nombre", dto.Nombre);
                cmd.Parameters.AddWithValue("@TiempoEntregaDias", dto.TiempoEntregaDias);

                connection.Open();
                cmd.ExecuteNonQuery();
            }
        }


        public bool Update(int id, ProveedorUpdateDto dto)
        {
            using(var conn = _db.GetConnection())
            {
                var query = @"UPDATE Proveedores
                                SET Nombre = @Nombre,
                                    TiempoEntregaDias = @TiempoEntregaDias
                                WHERE Id = @Id";

                var cmd = new SqlCommand(query, conn);
                cmd.Parameters.AddWithValue("@Id", id);
                cmd.Parameters.AddWithValue("@Nombre", dto.Nombre);
                cmd.Parameters.AddWithValue("@TiempoEntregaDias", dto.TiempoEntregaDias);
                conn.Open();

                var rowAffect = cmd.ExecuteNonQuery();

                return rowAffect > 0;
            }
        }


        public bool Delete(int id)
        {
            using(var conn = _db.GetConnection())
            {
                var query = "DELETE FROM Proveedores WHERE Id = @id";
                var cmd = new SqlCommand(query, conn);
                cmd.Parameters.AddWithValue("@id", id);
                conn.Open();
                var rowAffect = cmd.ExecuteNonQuery();
                return rowAffect > 0;
            }
        }

        private Proveedor MapProveedor(SqlDataReader reader)
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
