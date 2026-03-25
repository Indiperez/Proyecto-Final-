using InventTrackAI.API.Data;
using InventTrackAI.API.Models;
using InventTrackAI.API.Repositories.Interfaces;
using MySql.Data.MySqlClient;

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
            using var conn = _db.GetConnection();
            var query = "UPDATE Usuarios SET PasswordHash = @Hash WHERE Id = @Id";
            var cmd = new MySqlCommand(query, conn);
            cmd.Parameters.AddWithValue("@Hash", nuevaPassword);
            cmd.Parameters.AddWithValue("@Id", id);
            conn.Open();
            cmd.ExecuteNonQuery();
        }

        public bool CambiarEstado(int id, bool estado)
        {
            using var conn = _db.GetConnection();
            var query = "UPDATE Usuarios SET Activo = @Activo WHERE Id = @Id";
            var cmd = new MySqlCommand(query, conn);
            cmd.Parameters.AddWithValue("@Activo", estado ? 1 : 0);
            cmd.Parameters.AddWithValue("@Id", id);
            conn.Open();
            var rowsAffected = cmd.ExecuteNonQuery();
            return rowsAffected > 0;
        }

        public bool CambiarRol(int id, string nuevoRol)
        {
            using var conn = _db.GetConnection();
            var query = "UPDATE Usuarios SET Rol = @Rol WHERE Id = @Id";
            var cmd = new MySqlCommand(query, conn);
            cmd.Parameters.AddWithValue("@Rol", nuevoRol);
            cmd.Parameters.AddWithValue("@Id", id);
            conn.Open();
            var rowsAffected = cmd.ExecuteNonQuery();
            return rowsAffected > 0;
        }

        public void CrearUsuario(Usuario usuario)
        {
            using var conn = _db.GetConnection();
            var query = @"INSERT INTO Usuarios (Nombre, Email, PasswordHash, Rol, Activo, FechaCreacion)
                          VALUES (@Nombre, @Email, @PasswordHash, @Rol, @Activo, NOW())";
            var cmd = new MySqlCommand(query, conn);
            cmd.Parameters.AddWithValue("@Nombre", usuario.Nombre);
            cmd.Parameters.AddWithValue("@Email", usuario.Email);
            cmd.Parameters.AddWithValue("@PasswordHash", usuario.PasswordHash);
            cmd.Parameters.AddWithValue("@Rol", usuario.Rol);
            cmd.Parameters.AddWithValue("@Activo", usuario.Activo ? 1 : 0);
            conn.Open();
            cmd.ExecuteNonQuery();
        }

        public IEnumerable<Usuario> GetAll()
        {
            var usuarios = new List<Usuario>();
            using var conn = _db.GetConnection();
            var query = "SELECT Id, Nombre, Email, Rol, Activo, FechaCreacion FROM Usuarios";
            var cmd = new MySqlCommand(query, conn);
            conn.Open();
            var reader = cmd.ExecuteReader();
            while (reader.Read())
            {
                usuarios.Add(MapUsuario(reader));
            }
            return usuarios;
        }

        public (int Id, string PasswordHash, string Rol)? GetByEmail(string email)
        {
            using var conn = _db.GetConnection();
            var query = "SELECT Id, PasswordHash, Rol FROM Usuarios WHERE Email = @Email AND Activo = 1";
            var cmd = new MySqlCommand(query, conn);
            cmd.Parameters.AddWithValue("@Email", email);
            conn.Open();
            var reader = cmd.ExecuteReader();
            if (reader.Read())
            {
                return (
                    Convert.ToInt32(reader["Id"]),
                    reader["PasswordHash"].ToString(),
                    reader["Rol"].ToString()
                );
            }
            return null;
        }

        public Usuario ObtenerPorId(int id)
        {
            using var conn = _db.GetConnection();
            var query = "SELECT Id, Nombre, Email, Rol, Activo, FechaCreacion FROM Usuarios WHERE Id = @Id";
            var cmd = new MySqlCommand(query, conn);
            cmd.Parameters.AddWithValue("@Id", id);
            conn.Open();
            var reader = cmd.ExecuteReader();
            if (reader.Read())
                return MapUsuario(reader);
            return null;
        }

        private Usuario MapUsuario(MySqlDataReader reader)
        {
            return new Usuario
            {
                Id = Convert.ToInt32(reader["Id"]),
                Nombre = reader["Nombre"].ToString(),
                Email = reader["Email"].ToString(),
                Rol = reader["Rol"].ToString(),
                Activo = Convert.ToInt32(reader["Activo"]) == 1,
                FechaCrecion = Convert.ToDateTime(reader["FechaCreacion"])
            };
        }
    }
}
