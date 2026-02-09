using InventTrackAI.API.Data;
using Microsoft.Data.SqlClient;

namespace InventTrackAI.API.Repositories
{
    public class UsuarioRepository
    {
        private readonly DbConnection _db;

        public UsuarioRepository(DbConnection db)
        {
            _db = db;
        }

        public (int Id, string PasswordHash, string Rol)? GetByEmail(string email)
        {
            using (var conn = _db.GetConnection())
            {
                var query = @"SELECT Id, PasswordHash, Rol FROM Usuarios WHERE Email = @Email AND Activo = 1";
                var cmd = new SqlCommand(query, conn);

                cmd.Parameters.AddWithValue("@Email", email);

                conn.Open();

                var reader = cmd.ExecuteReader();

                if (!reader.Read()) return null;

                return (
                    (int)reader["Id"],
                    reader["PasswordHash"].ToString(),
                    reader["Rol"].ToString()
                    );
            }
        }
    }
}
