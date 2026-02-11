using InventTrackAI.API.Data;
using InventTrackAI.API.DTOs;
using InventTrackAI.API.Models;
using InventTrackAI.API.Repositories.Interfaces;
using Microsoft.Data.SqlClient;

namespace InventTrackAI.API.Repositories
{
    public class UsuarioRepository : IUsuarioRepository
    {
        private readonly DbConnection _db;

        public UsuarioRepository(DbConnection db)
        {
            _db = db;
        }

        public void ActualizarPassword(int id, string nuevaPassword)
        {
            using(var conn = _db.GetConnection())
            {
                var query = @"UPDATE Usuarios SET PasswordHash = @PasswordHash WHERE Id = @Id";
                var cmd = new SqlCommand(query, conn);
                cmd.Parameters.AddWithValue("@PasswordHash", nuevaPassword);
                cmd.Parameters.AddWithValue("@Id", id);
                conn.Open();
                cmd.ExecuteNonQuery();
            }
        }

        public bool CambiarEstado(int id, bool estado)
        {
            using (var conn = _db.GetConnection())
            {
                var query = @"UPDATE Usuarios SET Activo = @Activo WHERE Id = @Id";
                var cmd = new SqlCommand(query, conn);
                cmd.Parameters.AddWithValue("@Activo", estado);
                cmd.Parameters.AddWithValue("@Id", id);
                conn.Open();
               
                int filasAfectadas = cmd.ExecuteNonQuery();

                return filasAfectadas > 0;

            }
        }

        public bool CambiarRol(int id, string nuevoRol)
        {
            using(var conn = _db.GetConnection())
            {
                var query = @"UPDATE Usuarios SET Rol = @Rol WHERE Id = @Id";
                var cmd = new SqlCommand(query, conn);
                cmd.Parameters.AddWithValue("@Rol", nuevoRol);
                cmd.Parameters.AddWithValue("@Id", id);
                conn.Open();

               int filasAfectadas =  cmd.ExecuteNonQuery();

                return filasAfectadas > 0;
            }
            

        }

        public void CrearUsuario(Usuario usuario)
        {
            using (var conn = _db.GetConnection())
            {
                var query = @"INSERT INTO Usuarios (Nombre, Email, PasswordHash, Rol, Activo, FechaCreacion) 
                              VALUES (@Nombre, @Email, @PasswordHash, @Rol, @Activo, GETDATE())";
                var cmd = new SqlCommand(query, conn);
                cmd.Parameters.AddWithValue("@Nombre", usuario.Nombre);
                cmd.Parameters.AddWithValue("@Email", usuario.Email);
                cmd.Parameters.AddWithValue("@PasswordHash", usuario.PasswordHash);
                cmd.Parameters.AddWithValue("@Rol", usuario.Rol);
                cmd.Parameters.AddWithValue("@Activo", usuario.Activo);
                conn.Open();
                cmd.ExecuteNonQuery();
            }
        }

        public IEnumerable<Usuario> GetAll()
        {
            using (var conn = _db.GetConnection())
            {
                var query = @"SELECT Id, Nombre, Email, Rol, Activo, FechaCreacion FROM Usuarios";
                var cmd = new SqlCommand(query, conn);
                conn.Open();
                var reader = cmd.ExecuteReader();
                var usuarios = new List<Usuario>();
                while (reader.Read())
                {
                    usuarios.Add(new Usuario
                    {
                        Id = (int)reader["Id"],
                        Nombre = reader["Nombre"].ToString(),
                        Email = reader["Email"].ToString(),
                        Rol = reader["Rol"].ToString(),
                        Activo = (bool)reader["Activo"],
                        FechaCrecion = (DateTime)reader["FechaCreacion"]
                    });
                }
                return usuarios;
            }
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

        public Usuario ObtenerPorId(int id)
        {
            using (var conn = _db.GetConnection())
            {
                var query = @"SELECT Id, Nombre, Email, PasswordHash, Rol, Activo FROM Usuarios WHERE Id = @Id";
                var cmd = new SqlCommand(query, conn);
                cmd.Parameters.AddWithValue("@Id", id);
                conn.Open();
                var reader = cmd.ExecuteReader();
                if (reader.Read())
                {
                    return new Usuario
                    {
                        Id = (int)reader["Id"],
                        Nombre = reader["Nombre"].ToString(),
                        Email = reader["Email"].ToString(),
                        PasswordHash = reader["PasswordHash"].ToString(),
                        Rol = reader["Rol"].ToString(),
                        Activo = (bool)reader["Activo"]
                    };
                }
                return null;
            }
        }
    }
}
